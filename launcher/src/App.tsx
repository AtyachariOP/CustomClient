import React, { useState, useEffect, Suspense, lazy } from 'react';
import './index.css';
import Sidebar from './components/Sidebar';
import RightSidebar from './components/RightSidebar';
import Home from './components/Home';
import InspectorBridge from './InspectorBridge';
import { useLocalStorage } from './hooks/useLocalStorage';

// Lazy load heavy components
const Settings = lazy(() => import('./components/Settings'));
const Marketplace = lazy(() => import('./components/Marketplace'));
const Library = lazy(() => import('./components/Library'));
const Screenshots = lazy(() => import('./components/Screenshots'));
const FriendsHub = lazy(() => import('./components/FriendsHub'));

function App() {
  const [performanceMode, setPerformanceMode] = useLocalStorage(
    'performanceMode',
    false,
  );
  const [activeTab, setActiveTab] = useState('home');
  const [showSettings, setShowSettings] = useState(false);
  const [cursorData, setCursorData] = useLocalStorage<{
    name: string;
    default: string;
    pointer: string;
  } | null>('cursorTheme', null);

  useEffect(() => {
    if (performanceMode) {
      document.body.classList.add('performance-mode');
    } else {
      document.body.classList.remove('performance-mode');
    }
  }, [performanceMode]);

  const togglePerformanceMode = () => {
    setPerformanceMode(!performanceMode);
  };

  useEffect(() => {
    // Setup IPC listeners for the external Debugger Window
    if (window.require) {
      const { ipcRenderer } = window.require('electron');

      // Logging Bridge: Intercept console logs and send to main which forwards to debug
      const origLog = console.log;
      console.log = (...args) => {
        origLog(...args);
        ipcRenderer.send('relay-log', {
          type: 'log',
          args: args.map((a) => String(a)),
        });
      };
      const origWarn = console.warn;
      console.warn = (...args) => {
        origWarn(...args);
        ipcRenderer.send('relay-log', {
          type: 'warn',
          args: args.map((a) => String(a)),
        });
      };
      const origError = console.error;
      console.error = (...args) => {
        origError(...args);
        ipcRenderer.send('relay-log', {
          type: 'error',
          args: args.map((a) => String(a)),
        });
      };

      return () => {
        console.log = origLog;
        console.warn = origWarn;
        console.error = origError;
      };
    }
  }, []);

  // Handle sidebar clicks
  const handleTabChange = (tab: string) => {
    if (tab === 'settings') {
      setShowSettings(true);
    } else {
      setActiveTab(tab);
      setShowSettings(false);
    }
  };

  return (
    <div
      style={
        {
          display: 'flex',
          width: '100%',
          height: '100%',
          position: 'relative',
          minWidth: '1360px',
          minHeight: '720px',
          overflow: 'auto',
          '--app-cursor': cursorData ? cursorData.default : undefined,
          '--app-cursor-pointer': cursorData ? cursorData.pointer : undefined,
        } as React.CSSProperties
      }
    >
      {/* Title Bar Drag Region */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '30px',
          zIndex: 9999,
          ...({ WebkitAppRegion: 'drag' } as any),
        }}
      />

      {/* Dynamic Background */}
      <div
        id="video-bg"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
          overflow: 'hidden',
          background: '#09090b',
        }}
      >
        <div className="blob-pink"></div>
        <div className="blob-green"></div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(9,9,11,0.2), rgba(9,9,11,0.8))',
            backdropFilter: 'blur(100px)',
          }}
        />
      </div>

      <Sidebar
        activeTab={showSettings ? 'settings' : activeTab}
        setActiveTab={handleTabChange}
      />

      <main
        style={{
          flex: 1,
          minWidth: '700px',
          padding: '32px 32px 32px 40px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Suspense
          fallback={
            <div style={{ padding: '40px', color: 'var(--text-secondary)' }}>
              Loading...
            </div>
          }
        >
          {activeTab === 'home' && <Home />}
          {activeTab === 'discover' && <Marketplace />}
          {activeTab === 'library' && <Library />}
          {activeTab === 'screenshots' && <Screenshots />}
          {activeTab === 'friends' && <FriendsHub />}
        </Suspense>
      </main>

      {/* Right Sidebar - Friends & Ads */}
      <RightSidebar />

      {/* Lunar Style Settings Modal Overlay */}
      {showSettings && (
        <Suspense fallback={null}>
          <Settings
            performanceMode={performanceMode}
            togglePerformanceMode={togglePerformanceMode}
            cursorData={cursorData}
            setCursorData={setCursorData}
            close={() => setShowSettings(false)}
          />
        </Suspense>
      )}

      {/* Inspector V2 Bridge (Ephemeral) */}
      <InspectorBridge />
    </div>
  );
}

export default App;
