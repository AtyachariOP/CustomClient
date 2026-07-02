import React, { useState, useEffect } from 'react';
import './index.css';
import Sidebar from './components/Sidebar';
import RightSidebar from './components/RightSidebar';
import Home from './components/Home';
import Settings from './components/Settings';
import Marketplace from './components/Marketplace';
import Library from './components/Library';
import Screenshots from './components/Screenshots';

function App() {
  const [performanceMode, setPerformanceMode] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [showSettings, setShowSettings] = useState(false);
  const [cursorData, setCursorData] = useState<{name: string, default: string, pointer: string} | null>(null);

  const togglePerformanceMode = () => {
    setPerformanceMode(!performanceMode);
    if (!performanceMode) {
      document.body.classList.add('performance-mode');
    } else {
      document.body.classList.remove('performance-mode');
    }
  };

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
    <div style={{ 
      display: 'flex', width: '100%', height: '100%', position: 'relative',
      minWidth: '1360px', minHeight: '720px', overflow: 'auto',
      '--app-cursor': cursorData ? cursorData.default : undefined,
      '--app-cursor-pointer': cursorData ? cursorData.pointer : undefined
    } as React.CSSProperties}>
      
      {/* Title Bar Drag Region */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '30px', WebkitAppRegion: 'drag', zIndex: 9999 }} />

      {/* Dynamic Background */}
      <div id="video-bg" style={{ 
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1,
        overflow: 'hidden'
      }}>
         <video 
           autoPlay 
           loop 
           muted 
           style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(8px) brightness(0.5)', transform: 'scale(1.05)' }}
         >
            <source src="https://cdn.modrinth.com/video/minecraft_background.mp4" type="video/mp4" />
            {/* Fallback to CSS gradient if video fails */}
         </video>
         <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,10,10,0.2), rgba(10,10,10,0.8))' }} />
      </div>

      <Sidebar activeTab={showSettings ? 'settings' : activeTab} setActiveTab={handleTabChange} />
      
      <main style={{ flex: 1, minWidth: '700px', padding: '32px 32px 32px 40px', overflow: 'hidden', position: 'relative' }}>
        {activeTab === 'home' && <Home />}
        {activeTab === 'discover' && <Marketplace />}
        {activeTab === 'library' && <Library />}
        {activeTab === 'screenshots' && <Screenshots />}
      </main>

      {/* Right Sidebar - Friends & Ads */}
      <RightSidebar />

      {/* Lunar Style Settings Modal Overlay */}
      {showSettings && (
        <Settings 
          performanceMode={performanceMode} 
          togglePerformanceMode={togglePerformanceMode} 
          cursorData={cursorData}
          setCursorData={setCursorData}
          close={() => setShowSettings(false)} 
        />
      )}

    </div>
  );
}

export default App;
