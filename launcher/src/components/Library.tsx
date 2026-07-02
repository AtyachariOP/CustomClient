import React, { useState } from 'react';
import { Search, Plus, Folder, Settings, ChevronDown, Play, Box, CheckCircle } from 'lucide-react';

export default function Library() {
  const generatePlaceholder = (text: string, width = 800, height = 400) => {
    return `data:image/svg+xml;utf8,<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="${width}" height="${height}" fill="%231a1b1e"/><text fill="rgba(255,255,255,0.3)" xml:space="preserve" style="white-space: pre" font-family="sans-serif" font-size="24" font-weight="bold" text-anchor="middle" dominant-baseline="middle" x="${width/2}" y="${height/2}">${text}</text></svg>`;
  };

  const modpacks = [
    { id: 1, title: 'ATYACHARI PRIV.', author: 'Atyachari', version: '1.21.1', desc: 'A fully custom private modpack for Atyachari featuring extreme performance and custom aesthetic UI.', bg: generatePlaceholder('WIP - ATYACHARI PRIV. Cover'), icon: 'https://mc-heads.net/head/Atyachari/100' },
    { id: 2, title: 'MCC ISLAND FOR LUNAR', author: 'LunarClient', version: '1.20.4', desc: 'The official modpack for playing on Noxcrew\'s MCC Island with custom features.', bg: generatePlaceholder('WIP - MCC ISLAND Cover'), icon: 'https://mc-heads.net/head/Notch/100' },
    { id: 3, title: 'WYNNCRAFT', author: 'LunarClient', version: '1.20.4', desc: 'The ultimate MMORPG experience in Minecraft. Custom items, quests, and massive world.', bg: generatePlaceholder('WIP - WYNNCRAFT Cover'), icon: 'https://mc-heads.net/head/Herobrine/100' },
    { id: 4, title: 'HYPIXEL SKYBLOCK', author: 'LunarClient', version: '1.8.9', desc: 'Custom mods specifically designed for Hypixel Skyblock players. Includes NEU and SBA.', bg: generatePlaceholder('WIP - HYPIXEL SKYBLOCK Cover'), icon: 'https://mc-heads.net/head/Technoblade/100' },
    { id: 5, title: 'Vanilla+', author: 'CustomClient', version: '1.20.4', desc: 'Standard vanilla with massive performance upgrades.', bg: generatePlaceholder('WIP - Vanilla+ Cover'), icon: 'https://mc-heads.net/head/Steve/100' }
  ];

  const [selected, setSelected] = useState(modpacks[0]);

  return (
    <div className="animate-fade" style={{ display: 'flex', height: '100%', gap: '24px' }}>
      
      {/* Left Area: Grid of Modpacks */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto', paddingRight: '8px', minWidth: '500px' }}>
        
        {/* Top Action Bar */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button className="glass btn" style={{ padding: '10px 20px', borderRadius: '12px' }}>
            <Box size={16}/> Modpacks <ChevronDown size={14}/>
          </button>
          <div className="glass" style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 16px', borderRadius: '12px', height: '42px' }}>
            <Search size={18} color="var(--text-secondary)" style={{ marginRight: '12px' }} />
            <input type="text" placeholder="Search your modpacks..." style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', width: '100%', fontSize: '14px' }} />
          </div>
          <button className="glass btn" style={{ padding: '10px 20px', borderRadius: '12px' }}>
            Popular <ChevronDown size={14}/>
          </button>
          <button className="btn btn-primary btn-lift" style={{ padding: '10px 20px', borderRadius: '12px' }}>
            <Plus size={16}/> New Profile
          </button>
        </div>

        {/* Modpack Grid */}
        <div className="grid-container" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
          {modpacks.map(pack => (
            <div 
              key={pack.id} 
              className="glass"
              style={{ 
                position: 'relative',
                height: '180px',
                borderRadius: '16px',
                overflow: 'hidden',
                cursor: 'pointer',
                border: selected.id === pack.id ? '2px solid var(--accent-primary)' : '2px solid rgba(255,255,255,0.05)',
                boxShadow: selected.id === pack.id ? '0 0 20px rgba(16,185,129,0.3)' : '0 10px 30px rgba(0,0,0,0.2)',
                transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
              }}
              onClick={() => setSelected(pack)}
              onMouseOver={(e) => { if(selected.id !== pack.id) e.currentTarget.style.transform = 'translateY(-4px)' }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${pack.bg})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.6)' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)' }} />
              
              <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src={pack.icon} alt="Icon" style={{ width: '32px', height: '32px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.5)' }} />
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{pack.title}</h3>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>By @{pack.author}</p>
                  </div>
                </div>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(4px)' }}>
                  <Play size={14} fill="currentColor" style={{ marginLeft: '2px' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side: Selected Version Details (Glassmorphism heavily applied) */}
      <div className="glass" style={{ width: '340px', display: 'flex', flexDirection: 'column', borderRadius: '24px', padding: '24px', overflowY: 'auto', background: 'linear-gradient(180deg, rgba(20,21,26,0.8), rgba(15,15,18,0.95))', border: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
        <h2 style={{ fontSize: '14px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Selected Version</h2>
        
        <div style={{ width: '100%', height: '160px', borderRadius: '16px', backgroundImage: `url(${selected.bg})`, backgroundSize: 'cover', backgroundPosition: 'center', marginBottom: '20px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }} />
        
        <h3 style={{ fontSize: '20px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <img src={selected.icon} style={{ width: '24px', borderRadius: '4px' }} /> Minecraft {selected.version}
        </h3>
        
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', flex: 1 }}>
          {selected.desc}
        </p>

        {/* Selected Version Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '32px' }}>
          
          <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '12px', background: '#1a1b1e', border: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-secondary)', cursor: 'pointer', transition: 'var(--transition-fast)' }} onMouseOver={e => e.currentTarget.style.background = '#25262b'} onMouseOut={e => e.currentTarget.style.background = '#1a1b1e'}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}><Folder size={16} color="#fbbf24" /> Custom directory</div>
            <ChevronDown size={14} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '14px', fontWeight: 600 }}>Version</span>
            <div className="glass" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '8px', fontSize: '13px', background: 'rgba(255,255,255,0.05)' }}>
              {selected.version} <ChevronDown size={14}/>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '14px', fontWeight: 600 }}>Addons</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ position: 'relative' }}>
                 <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#1a1b1e', backgroundImage: `url(${generatePlaceholder('Addon', 100, 100)})`, backgroundSize: 'cover' }} />
                 <CheckCircle size={14} color="#10b981" fill="#1a1a1a" style={{ position: 'absolute', top: '-4px', right: '-4px' }} />
              </div>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#1a1b1e', backgroundImage: `url(${generatePlaceholder('Addon', 100, 100)})`, backgroundSize: 'cover' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button className="glass" style={{ padding: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', transition: 'var(--transition-fast)' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
              <Settings size={20} color="var(--text-secondary)" />
            </button>
            <button className="btn-launch" style={{ flex: 1, padding: '0', justifyContent: 'center' }}>
              LAUNCH GAME
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}
