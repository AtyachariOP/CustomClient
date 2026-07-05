import { useState } from 'react';
import { 
  X, Search, Monitor, Settings as SettingsIcon, 
  User, HardDrive, Bell, Shield, Folder, 
  Volume2, RefreshCcw, LogOut, Plus, Trash2, 
  Gamepad2, Layers, Cpu, Maximize, ChevronDown
} from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

function CustomDropdown({ value, options, onChange, width = '300px' }: { value: string, options: string[], onChange: (val: string) => void, width?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative', width }} onClick={() => setOpen(!open)}>
      <div className="btn-lift" style={{ background: '#1c1d21', border: '1px solid var(--border-subtle)', color: 'white', padding: '10px 12px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontSize: '14px', transition: 'border-color 0.2s ease, box-shadow 0.2s ease', borderColor: open ? 'var(--accent-primary)' : 'var(--border-subtle)', boxShadow: open ? '0 0 0 2px rgba(168, 85, 247, 0.2)' : 'none' }}>
        {value}
        <ChevronDown size={16} style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} color="var(--text-secondary)" />
      </div>
      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 10 }} onClick={() => setOpen(false)} />
          <div className="animate-fade glass" style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, zIndex: 20, borderRadius: '6px', overflow: 'hidden', padding: '4px', background: '#16171b', border: '1px solid var(--border-subtle)' }}>
            {options.map(opt => (
              <div key={opt} onClick={() => { onChange(opt); setOpen(false); }} style={{ padding: '8px 12px', cursor: 'pointer', fontSize: '14px', borderRadius: '4px', background: opt === value ? 'rgba(168,85,247,0.1)' : 'transparent', color: opt === value ? 'var(--accent-primary)' : 'white', transition: 'background 0.15s ease' }} onMouseOver={e => e.currentTarget.style.background = opt === value ? 'rgba(168,85,247,0.15)' : 'rgba(255,255,255,0.05)'} onMouseOut={e => e.currentTarget.style.background = opt === value ? 'rgba(168,85,247,0.1)' : 'transparent'}>
                {opt}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default function Settings({ performanceMode, togglePerformanceMode, cursorData: _cursorData, setCursorData: _setCursorData, close }: { performanceMode: boolean, togglePerformanceMode: () => void, cursorData: any, setCursorData: any, close: () => void }) {
  const [activeTab, setActiveTab] = useState('General');
  const [launchBehavior, setLaunchBehavior] = useLocalStorage('settings_launchBehavior', 'Keep launcher open');
  const [language, setLanguage] = useLocalStorage('settings_language', 'English (US)');
  const [allocatedMemory, setAllocatedMemory] = useLocalStorage('settings_allocatedMemory', '4');
  const [resX, setResX] = useLocalStorage('settings_resX', '854');
  const [resY, setResY] = useLocalStorage('settings_resY', '480');
  const [jvmArgs, setJvmArgs] = useLocalStorage('settings_jvmArgs', '-XX:+UseG1GC -Dsun.rmi.dgc.server.gcInterval=2147483646 -XX:+UnlockExperimentalVMOptions');

  // Reordered tabs
  const tabs = [
    { id: 'General', icon: SettingsIcon },
    { id: 'Game', icon: Monitor },
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
            <input type="text" placeholder="Search settings..." style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '100%', fontSize: '14px' }} />
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
        <div style={{ flex: 1, padding: '32px', display: 'flex', flexDirection: 'column', position: 'relative', overflowY: 'auto' }}>
          <button onClick={close} style={{ position: 'absolute', top: '24px', right: '24px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
          
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '32px', display: 'flex', alignItems: 'center' }}>
            {activeTab} Settings 
            <span style={{fontSize: '11px', color: 'var(--accent-primary)', fontWeight: 500, marginLeft: '16px', fontFamily: "'Manrope', sans-serif", letterSpacing: '0.5px', padding: '4px 8px', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '6px'}}>By Atyachari</span>
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '32px' }}>
            {activeTab === 'General' && (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Layers size={16}/> Launch Behavior
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>What should the launcher do when the game starts?</p>
                  <div style={{ marginTop: '8px' }}>
                    <CustomDropdown 
                      value={launchBehavior} 
                      options={['Keep launcher open', 'Hide launcher', 'Close launcher completely']} 
                      onChange={setLaunchBehavior} 
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Cpu size={16}/> Hardware Acceleration
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Enable GPU acceleration for smoother launcher animations. Disable if you experience graphical glitches.</p>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '8px' }}>
                    <input type="checkbox" className="custom-checkbox" defaultChecked />
                    <span style={{ fontSize: '14px' }}>Enable Hardware Acceleration</span>
                  </label>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <SettingsIcon size={16}/> Language
                  </h3>
                  <div style={{ marginTop: '8px' }}>
                    <CustomDropdown 
                      value={language} 
                      options={['English (US)', 'Spanish', 'French', 'German']} 
                      onChange={setLanguage} 
                    />
                  </div>
                </div>
              </>
            )}

            {activeTab === 'Game' && (
              <>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Monitor size={16}/> Low-End PC Mode (Performance)
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '16px' }}>Disable all blurred backgrounds, heavy CSS animations, and background videos to maximize client performance.</p>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="checkbox" className="custom-checkbox" checked={performanceMode} onChange={togglePerformanceMode} />
                    <span style={{ fontSize: '14px' }}>Enable Performance Mode</span>
                  </label>
                </div>

                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <HardDrive size={16}/> Allocated Memory
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '16px' }}>How much RAM should be allocated to the game instance.</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#1c1d21', padding: '6px 12px', borderRadius: '6px', width: 'fit-content', border: '1px solid var(--border-subtle)', marginBottom: '12px' }}>
                     <span style={{ fontWeight: 600 }}>{allocatedMemory} GB</span>
                     <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>~16.0 GB Total</span>
                  </div>
                  <input type="range" min="1" max="16" value={allocatedMemory} onChange={(e) => setAllocatedMemory(e.target.value)} style={{ width: '100%' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', color: 'var(--text-secondary)', fontSize: '12px' }}>
                    <span>1.0 GB</span>
                    <span>16.0 GB</span>
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Maximize size={16}/> Game Resolution
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '16px' }}>Set the default window size for Minecraft.</p>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <input className="input-premium" type="text" value={resX} onChange={(e) => setResX(e.target.value)} style={{ width: '80px', textAlign: 'center' }} />
                    <span style={{ color: 'var(--text-secondary)' }}>x</span>
                    <input className="input-premium" type="text" value={resY} onChange={(e) => setResY(e.target.value)} style={{ width: '80px', textAlign: 'center' }} />
                  </div>
                </div>
                
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <SettingsIcon size={16}/> JVM Arguments
                  </h3>
                  <input className="input-premium" type="text" value={jvmArgs} onChange={(e) => setJvmArgs(e.target.value)} style={{ width: '100%', fontSize: '12px', fontFamily: 'monospace' }} />
                </div>
              </>
            )}

            {activeTab === 'Account' && (
              <>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <User size={16}/> Active Session
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                    <img src="https://minotar.net/helm/Atyachari/64.png" alt="Avatar" style={{ width: '48px', height: '48px', borderRadius: '8px' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '16px', fontWeight: 600 }}>Atyachari</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%' }} /> Microsoft Account (Active)
                      </div>
                    </div>
                    <button className="btn btn-lift" style={{ background: 'rgba(255,255,255,0.05)', padding: '8px 16px', borderRadius: '8px', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                      <RefreshCcw size={14} style={{ marginRight: '8px' }} /> Refresh
                    </button>
                    <button className="btn btn-lift" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                      <LogOut size={14} style={{ marginRight: '8px' }} /> Log Out
                    </button>
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    Other Accounts
                  </h3>
                  <button className="btn btn-lift" style={{ width: '100%', padding: '16px', border: '1px dashed var(--border-subtle)', background: 'transparent', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', borderRadius: '12px', cursor: 'pointer' }}>
                    <Plus size={18} /> Add Microsoft Account
                  </button>
                </div>
              </>
            )}

            {activeTab === 'Storage' && (
              <>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Folder size={16}/> Installation Directory
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '12px' }}>Where game instances, mods, and assets are saved.</p>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <input className="input-premium" type="text" readOnly value="C:\Users\Atyachari\AppData\Roaming\.customclient" style={{ flex: 1, fontSize: '13px', fontFamily: 'monospace' }} />
                    <button className="btn btn-lift" style={{ background: 'var(--accent-primary)', color: 'white', padding: '0 20px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>Browse</button>
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <HardDrive size={16}/> Cache Management
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '16px' }}>Clear downloaded assets, images, and mod indices to free up space. (Estimated size: ~1.2 GB)</p>
                  <button className="btn btn-lift" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '10px 20px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <Trash2 size={16} /> Clear Cache Now
                  </button>
                </div>
              </>
            )}

            {activeTab === 'Notifications' && (
              <>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Bell size={16}/> Desktop Notifications
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '16px' }}>Receive OS-level notifications for important events.</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input type="checkbox" className="custom-checkbox" defaultChecked />
                      <span style={{ fontSize: '14px' }}>Notify when a Modpack has an update available</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input type="checkbox" className="custom-checkbox" defaultChecked />
                      <span style={{ fontSize: '14px' }}>Notify if the game crashes</span>
                    </label>
                  </div>
                </div>

                <div style={{ marginTop: '16px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Volume2 size={16}/> Sounds
                  </h3>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="checkbox" className="custom-checkbox" defaultChecked />
                    <span style={{ fontSize: '14px' }}>Play sound when game successfully launches</span>
                  </label>
                </div>
              </>
            )}

            {activeTab === 'Privacy' && (
              <>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Gamepad2 size={16}/> Discord Rich Presence
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '16px' }}>Show what you're playing on your Discord profile.</p>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="checkbox" className="custom-checkbox" defaultChecked />
                    <span style={{ fontSize: '14px' }}>Enable Discord Integration</span>
                  </label>
                </div>

                <div style={{ marginTop: '16px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Shield size={16}/> Telemetry & Crash Reports
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '16px' }}>Help us improve the launcher by sending anonymous usage and crash data.</p>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="checkbox" className="custom-checkbox" defaultChecked />
                    <span style={{ fontSize: '14px' }}>Send anonymous telemetry</span>
                  </label>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
