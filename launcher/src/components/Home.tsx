import { useState } from 'react';
import { Play, Box, ChevronDown, Search, Plus, User } from 'lucide-react';

export default function Home() {
  const [activeProfile, setActiveProfile] = useState("ATYACHARI PRIV.");

  const profiles = [
    { title: "ATYACHARI PRIV.", author: "@Atyachari", icon: "user" },
    { title: "MCC ISLAND FOR LUNAR", author: "@LunarClient", icon: "user" },
    { title: "WYNNCRAFT", author: "@LunarClient", icon: "user" },
    { title: "HYPIXEL SKYBLOCK", author: "@LunarClient", icon: "user" },
    { title: "VANILLA+", author: "@CustomClient", icon: "box" }
  ];


  return (
    <div className="animate-fade" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Navigation Bar */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Welcome to Custom Client!</h1>
          <p style={{ fontSize: '12px', color: 'var(--accent-primary)', fontWeight: 500, marginTop: '4px', fontFamily: "'Manrope', sans-serif", letterSpacing: '0.5px' }}>By Atyachari</p>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>0 Instances running</span>
        </div>
      </header>

      <div style={{ overflowY: 'auto', paddingRight: '8px', display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '32px' }}>
        
        {/* Massive Lunar-style Hero Banner */}
        <div style={{
          position: 'relative',
          width: '100%',
          minHeight: '280px',
          borderRadius: '16px',
          backgroundImage: `url('/bg.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          flexShrink: 0,
          transition: 'background-position 0.3s ease-out'
        }}>
          {/* Dark Overlay - Upgraded to radial gradient to spotlight the center */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(0,0,0,0.2) 0%, rgba(10,10,12,0.8) 100%)' }} />
          
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
             <button className="btn-launch">
               <Play fill="currentColor" size={24} />
               LAUNCH GAME
             </button>
             <p style={{ marginTop: '12px', color: 'rgba(255,255,255,0.7)', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                {activeProfile} <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)' }}/> Fabric 1.20.4
             </p>
          </div>
        </div>

        {/* Quick Library */}
        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Library Top Bar */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <button className="glass btn btn-lift" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', fontSize: '14px', fontWeight: 600 }}>
              <Box size={16} /> Modpacks <ChevronDown size={14} style={{ marginLeft: '4px' }} />
            </button>
            
            <div className="glass" style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 16px', borderRadius: '10px', height: '42px', background: 'rgba(15, 15, 18, 0.45)' }}>
              <Search size={18} color="var(--text-secondary)" style={{ marginRight: '12px' }} />
              <input 
                type="text" 
                placeholder="Search your modpacks..." 
                style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '100%', fontSize: '14px' }} 
              />
            </div>
            
            <button className="glass btn btn-lift" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', fontSize: '14px' }}>
              Popular <ChevronDown size={14} />
            </button>
            
            <button className="btn btn-primary btn-lift" style={{ padding: '10px 20px', borderRadius: '10px', fontSize: '14px' }}>
              <Plus size={16} /> New Profile
            </button>
          </div>

          {/* Profile Grid */}
          <div className="grid-container" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {profiles.map((profile, i) => {
              const isActive = activeProfile === profile.title;
              return (
                <div 
                  key={i} 
                  className="card slide-right" 
                  onClick={() => setActiveProfile(profile.title)}
                  style={{ 
                    display: 'flex', flexDirection: 'column', 
                    background: 'rgba(15, 15, 18, 0.45)', 
                    height: '140px', padding: '20px', 
                    borderRadius: '12px', cursor: 'pointer',
                    border: isActive ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                    boxShadow: isActive ? '0 0 20px rgba(168, 85, 247, 0.15)' : 'none'
                  }}>
                  
                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div style={{ background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px' }}>
                        {profile.icon === 'user' ? <User size={24} color="#fcd34d" /> : <Box size={24} color="#9ca3af" />}
                      </div>
                      <div>
                        <h3 style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '0.5px' }}>{profile.title}</h3>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>By {profile.author}</p>
                      </div>
                    </div>
                    
                    <button className="btn-lift" style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)', cursor: 'pointer' }}>
                      <Play size={14} fill="currentColor" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
