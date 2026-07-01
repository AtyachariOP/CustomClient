import React, { useState } from 'react';
import { X, Search, Monitor, Settings as SettingsIcon, User, HardDrive, Bell, Shield } from 'lucide-react';

export default function Settings({ performanceMode, togglePerformanceMode, close }: { performanceMode: boolean, togglePerformanceMode: () => void, close: () => void }) {
  const [activeTab, setActiveTab] = useState('General');

  const tabs = [
    { id: 'Game', icon: Monitor },
    { id: 'General', icon: SettingsIcon },
    { id: 'Account', icon: User },
    { id: 'Storage', icon: HardDrive },
    { id: 'Notifications', icon: Bell },
    { id: 'Privacy', icon: Shield },
  ];

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 100,
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)'
    }}>
      <div className="animate-fade" style={{
        width: '900px', height: '600px',
        backgroundColor: '#16171b', borderRadius: '12px',
        display: 'flex', border: '1px solid var(--border-subtle)',
        boxShadow: '0 24px 48px rgba(0,0,0,0.4)', overflow: 'hidden'
      }}>
        
        {/* Settings Sidebar */}
        <div style={{ width: '240px', backgroundColor: '#111215', borderRight: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', padding: '16px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', background: '#1c1d21', borderRadius: '6px', padding: '8px', marginBottom: '16px', border: '1px solid var(--border-subtle)' }}>
            <Search size={16} color="var(--text-secondary)" style={{ marginRight: '8px' }} />
            <input type="text" placeholder="Search settings..." style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', width: '100%', fontSize: '14px' }} />
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {tabs.map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px', borderRadius: '8px', cursor: 'pointer',
                  border: 'none', background: activeTab === tab.id ? '#25262b' : 'transparent',
                  color: activeTab === tab.id ? 'white' : 'var(--text-secondary)',
                  fontWeight: activeTab === tab.id ? 600 : 500,
                  transition: 'background 0.1s'
                }}
              >
                <tab.icon size={18} />
                {tab.id}
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <button onClick={close} style={{ position: 'absolute', top: '24px', right: '24px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
          
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px' }}>{activeTab} Settings</h2>

          {activeTab === 'Game' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              
              {/* Performance Mode Setting */}
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Monitor size={16}/> Low-End PC Mode (Performance)
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '16px' }}>Disable all blurred backgrounds, heavy CSS animations, and background videos to maximize client performance.</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="checkbox" className="custom-checkbox" checked={performanceMode} onChange={togglePerformanceMode} />
                    <span style={{ fontSize: '14px' }}>Enable Performance Mode</span>
                  </label>
                </div>
              </div>

              {/* Memory Setting (Visual Only for now) */}
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <HardDrive size={16}/> Allocated Memory
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '16px' }}>How much memory should we allocate to the game instance</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#1c1d21', padding: '6px 12px', borderRadius: '6px', width: 'fit-content', border: '1px solid var(--border-subtle)', marginBottom: '12px' }}>
                   <span style={{ fontWeight: 600 }}>4 GB</span>
                   <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>~16.0 GB</span>
                </div>
                <input type="range" min="1" max="16" defaultValue="4" />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', color: 'var(--text-secondary)', fontSize: '12px' }}>
                  <span>1.0 GB</span>
                  <span>16.0 GB</span>
                </div>
              </div>
              
            </div>
          )}

          {activeTab === 'General' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                No general settings available yet.
              </div>
            </div>
          )}

          {activeTab !== 'Game' && activeTab !== 'General' && (
            <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Settings for {activeTab} are Work in Progress.
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
