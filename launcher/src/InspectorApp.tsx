import { useState, useEffect } from 'react';
import { Monitor, BoxSelect } from 'lucide-react';

export default function InspectorApp() {
  const [activeTab, setActiveTab] = useState('performance');

  const [hardware, setHardware] = useState<any>(null);
  const [telemetry, setTelemetry] = useState<any>(null);
  const [clientMetrics, setClientMetrics] = useState<any>(null);
  const [telemetryHistory, setTelemetryHistory] = useState<any[]>([]);
  const [features, setFeatures] = useState<Record<string, boolean>>({
    blur: true, animations: true, shadows: true
  });
  
  // IPC Setup
  const ipc = window.require ? window.require('electron').ipcRenderer : null;

  useEffect(() => {
    if (!ipc) return;

    const handleData = (_e: any, payload: { type: string, data: any }) => {
      if (payload.type === 'telemetry') {
        setTelemetry(payload.data);
        setTelemetryHistory(prev => [...prev.slice(-30), payload.data]); // keep last 30 secs
      }
    };

    const handleHardware = (_e: any, hw: any) => {
      setHardware(hw);
    };

    const handleMetrics = (_e: any, metrics: any) => {
      setClientMetrics(metrics);
    };

    ipc.on('inspector:data-received', handleData);
    ipc.on('inspector:hardware-received', handleHardware);
    ipc.on('inspector:metrics-received', handleMetrics);
    
    // Request hardware info on mount
    ipc.send('inspector:request-hardware');

    // Poll for client metrics every second
    const metricsInterval = setInterval(() => {
      ipc.send('inspector:request-metrics');
    }, 1000);

    return () => {
      ipc.removeListener('inspector:data-received', handleData);
      ipc.removeListener('inspector:hardware-received', handleHardware);
      ipc.removeListener('inspector:metrics-received', handleMetrics);
      clearInterval(metricsInterval);
    };
  }, [ipc]);

  const sendAction = (action: string, payload?: any) => {
    if (ipc) ipc.send('inspector:action', action, payload);
  };

  const toggleFeature = (feature: string) => {
    const newState = !features[feature];
    setFeatures(prev => ({ ...prev, [feature]: newState }));
    sendAction('toggle-feature', { feature, enabled: newState });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh', background: '#111111', color: '#e5e7eb', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Header Tabs */}
      <header style={{ display: 'flex', background: '#1a1a1a', borderBottom: '1px solid #333', padding: '0 16px', height: '48px', alignItems: 'center', gap: '8px' }}>
        <div style={{ fontWeight: 'bold', marginRight: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BoxSelect size={18} color="#3b82f6" /> Developer Options
        </div>
        {[
          { id: 'performance', icon: Monitor, label: 'Performance' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '6px', 
              padding: '6px 12px', background: activeTab === tab.id ? '#2a2a2a' : 'transparent', 
              border: 'none', borderRadius: '4px', color: activeTab === tab.id ? '#fff' : '#9ca3af',
              cursor: 'pointer', transition: '0.15s'
            }}
          >
            <tab.icon size={14} /> {tab.label}
          </button>
        ))}
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* Main Content Area */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          
          {activeTab === 'performance' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Hardware Section */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
                {[
                  { label: 'CPU', val: hardware ? hardware.cpu : 'Loading...' },
                  { label: 'GPU', val: hardware ? hardware.gpu : 'Loading...' },
                  { label: 'RAM', val: hardware ? hardware.ram : 'Loading...' },
                  { label: 'OS', val: hardware ? hardware.os : 'Loading...' },
                  { label: 'Engine', val: hardware ? `Chromium ${hardware.chromeVersion}` : 'Loading...' }
                ].map((item, i) => (
                  <div key={i} style={{ background: '#1a1a1a', padding: '16px', borderRadius: '8px', border: '1px solid #333' }}>
                    <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</div>
                    <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#e5e7eb' }}>{item.val}</div>
                  </div>
                ))}
              </div>

              {/* Telemetry Dashboard */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '24px' }}>
                
                {/* Real-time Stats */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                   <div style={{ background: '#1a1a1a', padding: '16px', borderRadius: '8px', border: '1px solid #333', textAlign: 'center' }}>
                      <div style={{ fontSize: '12px', color: '#9ca3af' }}>Current FPS</div>
                      <div style={{ fontSize: '32px', fontWeight: 'bold', color: (telemetry?.fps || 0) > 40 ? '#34d399' : '#f87171' }}>{telemetry?.fps || 0}</div>
                      <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>1% Low: {telemetry?.onePercentLowFPS || 0} FPS</div>
                   </div>
                   <div style={{ background: '#1a1a1a', padding: '16px', borderRadius: '8px', border: '1px solid #333', textAlign: 'center' }}>
                      <div style={{ fontSize: '12px', color: '#9ca3af' }}>Frame Time</div>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#60a5fa' }}>{telemetry?.avgFrameTime || 0} ms</div>
                   </div>
                   <div style={{ background: '#1a1a1a', padding: '16px', borderRadius: '8px', border: '1px solid #333' }}>
                      <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '8px' }}>Client Usage</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                        <span>CPU Usage</span>
                        <span style={{ fontWeight: 'bold' }}>{clientMetrics?.cpuPercent || 0}%</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                        <span>RAM (Total)</span>
                        <span style={{ fontWeight: 'bold' }}>{clientMetrics?.ramMB || 0} MB</span>
                      </div>
                   </div>
                   <div style={{ background: '#1a1a1a', padding: '16px', borderRadius: '8px', border: '1px solid #333' }}>
                      <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '8px' }}>Internal Memory</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                        <span>V8 Heap (JS)</span>
                        <span style={{ fontWeight: 'bold' }}>{telemetry?.memory?.jsHeap || 0} MB</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                        <span>Node (RSS)</span>
                        <span style={{ fontWeight: 'bold' }}>{telemetry?.memory?.nodeMem || 0} MB</span>
                      </div>
                   </div>
                   <div style={{ background: '#1a1a1a', padding: '16px', borderRadius: '8px', border: '1px solid #333' }}>
                      <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '8px' }}>DOM Statistics</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                        <span>Total Nodes</span>
                        <span style={{ fontWeight: 'bold' }}>{telemetry?.domStats?.total || 0}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                        <span>Visible</span>
                        <span style={{ fontWeight: 'bold', color: '#34d399' }}>{telemetry?.domStats?.visible || 0}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                        <span>Images</span>
                        <span style={{ fontWeight: 'bold' }}>{telemetry?.domStats?.images || 0}</span>
                      </div>
                   </div>
                </div>

                {/* Live Graphs & Controls */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  
                  {/* Scrolling Graph */}
                  <div style={{ background: '#1a1a1a', padding: '16px', borderRadius: '8px', border: '1px solid #333', height: '200px', display: 'flex', flexDirection: 'column' }}>
                     <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                        <span>Framerate Timeline</span>
                        <span style={{ color: '#6b7280', fontWeight: 'normal' }}>60 FPS Target</span>
                     </div>
                     <div style={{ flex: 1, borderBottom: '1px solid #333', borderLeft: '1px solid #333', position: 'relative', overflow: 'hidden' }}>
                        <svg width="100%" height="100%" viewBox="0 0 300 100" preserveAspectRatio="none">
                           {telemetryHistory.length > 1 && (
                             <polyline 
                               fill="none" 
                               stroke="#34d399" 
                               strokeWidth="2" 
                               points={telemetryHistory.map((t, i) => `${(i / 30) * 300},${100 - (Math.min(t.fps, 100) / 100) * 100}`).join(' ')} 
                             />
                           )}
                        </svg>
                     </div>
                  </div>

                  {/* Feature Toggles & Bottlenecks */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ background: '#1a1a1a', padding: '16px', borderRadius: '8px', border: '1px solid #333' }}>
                       <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '12px' }}>Expensive Feature Toggles</div>
                       <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                         {['blur', 'animations', 'shadows'].map(feat => (
                           <label key={feat} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', cursor: 'pointer' }}>
                             <span style={{ textTransform: 'capitalize' }}>{feat}</span>
                             <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                               <span style={{ color: '#f87171', fontSize: '11px' }}>High Impact</span>
                               <input type="checkbox" checked={features[feat]} onChange={() => toggleFeature(feat)} />
                             </div>
                           </label>
                         ))}
                       </div>
                    </div>

                    <div style={{ background: '#1a1a1a', padding: '16px', borderRadius: '8px', border: '1px solid #333' }}>
                       <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '12px' }}>Bottleneck Detector</div>
                       {(telemetry?.domStats?.total > 1500) && (
                         <div style={{ background: 'rgba(248, 113, 113, 0.1)', border: '1px solid rgba(248, 113, 113, 0.3)', padding: '8px', borderRadius: '4px', fontSize: '12px', color: '#f87171', marginBottom: '8px' }}>
                           <strong>Warning:</strong> Deep DOM detected ({telemetry.domStats.total} nodes). This causes heavy layout recalcs.
                         </div>
                       )}
                       {features.blur && (
                         <div style={{ background: 'rgba(96, 165, 250, 0.1)', border: '1px solid rgba(96, 165, 250, 0.3)', padding: '8px', borderRadius: '4px', fontSize: '12px', color: '#60a5fa' }}>
                           <strong>Recommendation:</strong> Disabling backdrop-blur can yield +15-20 FPS on Low End PCs.
                         </div>
                       )}
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

        </main>
      </div>
    </div>
  );
}
