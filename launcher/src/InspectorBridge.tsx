import { useEffect } from 'react';

export default function InspectorBridge() {
  useEffect(() => {
    // Only run if running in Electron
    if (!window.require) return;
    
    const { ipcRenderer } = window.require('electron');

    // IPC listener for live edits from the Inspector V2 window
    const handleInspectorAction = (_e: any, action: string, payload: any) => {
      if (action === 'toggle-feature') {
        // Toggle feature (e.g. blur, particles) globally
        const { feature, enabled } = payload;
        const styleId = `debug-feature-${feature}`;
        if (!enabled) {
          let style = document.getElementById(styleId);
          if (!style) {
            style = document.createElement('style');
            style.id = styleId;
            if (feature === 'blur') style.innerHTML = `* { backdrop-filter: none !important; filter: none !important; }`;
            if (feature === 'animations') style.innerHTML = `* { animation: none !important; transition: none !important; }`;
            if (feature === 'shadows') style.innerHTML = `* { box-shadow: none !important; text-shadow: none !important; }`;
            document.head.appendChild(style);
          }
        } else {
          const style = document.getElementById(styleId);
          if (style) style.remove();
        }
      }
    };

    // Telemetry Engine (FPS, Frame Times, DOM Stats)
    let lastTime = performance.now();
    let frames = 0;
    let frameTimes: number[] = [];
    let telemetryInterval: any;

    const measureFPS = () => {
      const now = performance.now();
      const delta = now - lastTime;
      frameTimes.push(delta);
      frames++;
      lastTime = now;
      requestAnimationFrame(measureFPS);
    };
    requestAnimationFrame(measureFPS);

    telemetryInterval = setInterval(() => {
      // Calculate FPS and 1% Lows
      const fps = frames;
      frames = 0;
      
      let avgFrameTime = 0;
      let onePercentLowFPS = fps;
      
      if (frameTimes.length > 0) {
        avgFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
        // Sort descending to find highest frame times (slowest frames)
        frameTimes.sort((a, b) => b - a);
        const onePercentIndex = Math.max(0, Math.floor(frameTimes.length * 0.01));
        const onePercentSlowest = frameTimes[onePercentIndex] || avgFrameTime;
        onePercentLowFPS = Math.round(1000 / (onePercentSlowest || 16.6));
      }
      frameTimes = []; // reset for next second

      // Scan DOM
      const allNodes = document.querySelectorAll('*');
      const images = document.querySelectorAll('img');
      let visible = 0;
      let hidden = 0;
      
      allNodes.forEach(node => {
        const style = window.getComputedStyle(node);
        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
          hidden++;
        } else {
          visible++;
        }
      });

      // Memory
      const process = window.require ? window.require('process') : null;
      let nodeMem = 0;
      if (process && process.memoryUsage) {
        nodeMem = Math.round(process.memoryUsage().rss / (1024 * 1024));
      }
      
      const jsHeap = (performance as any).memory ? Math.round((performance as any).memory.usedJSHeapSize / (1024 * 1024)) : 0;

      const telemetryData = {
        fps,
        avgFrameTime: avgFrameTime.toFixed(1),
        onePercentLowFPS,
        domStats: {
          total: allNodes.length,
          visible,
          hidden,
          images: images.length
        },
        memory: {
          nodeMem,
          jsHeap
        }
      };

      ipcRenderer.send('inspector:relay-data', { type: 'telemetry', data: telemetryData });
    }, 1000);

    // Attach Event Listeners
    ipcRenderer.on('inspector:action', handleInspectorAction);

    return () => {
      ipcRenderer.removeListener('inspector:action', handleInspectorAction);
      clearInterval(telemetryInterval);
    };
  }, []);

  return null; // Silent component
}
