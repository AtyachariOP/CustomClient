import React, { useState } from 'react';
import { ExternalLink, Users, UserPlus, MoreVertical, LogOut } from 'lucide-react';

export const getPlayerAvatar = (username: string, size: number = 32) => {
  // mc-heads.net allows fetching avatars directly via username rather than requiring a UUID first
  return `https://mc-heads.net/avatar/${username}/${size}`;
};

export default function RightSidebar() {
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  const friends = [
    { name: 'xEradicator', tag: 'Playing Bedwars', status: 'Online', avatar: getPlayerAvatar('xEradicator') },
    { name: 'EC_Revamp', tag: 'Last seen 2h ago', status: 'Offline', avatar: getPlayerAvatar('EC_Revamp') }
  ];

  const adPlaceholder = `data:image/svg+xml;utf8,<svg width="240" height="180" viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="240" height="180" fill="%231a1b1e"/><text fill="rgba(255,255,255,0.5)" xml:space="preserve" style="white-space: pre" font-family="Inter" font-size="16" font-weight="600"><tspan x="60" y="95">Ad Placement</tspan></text></svg>`;

  return (
    <aside className="glass" style={{
      width: '300px',
      flexShrink: 0,
      height: '100%',
      borderLeft: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px',
      zIndex: 10,
      background: 'rgba(15, 15, 18, 0.45)',
      boxShadow: '-10px 0 30px rgba(0,0,0,0.2)'
    }}>
      
      {/* Account Center */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '12px', paddingLeft: '4px' }}>
           Playing as
        </h2>
        <div style={{
           padding: '16px',
           borderRadius: '16px',
           background: '#1a1b1e', // Dark sleek background matching screenshot
           border: '1px solid rgba(255,255,255,0.05)',
           display: 'flex',
           flexDirection: 'column',
           gap: '16px'
        }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#111', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                <img src="https://mc-heads.net/head/Atyachari/100" alt="Avatar" style={{ width: '40px', height: '40px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />
              </div>
              <div style={{ flex: 1 }}>
                 <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '2px' }}>Logged in as</div>
                 <div style={{ fontSize: '16px', fontWeight: 700, color: 'white', letterSpacing: '0.5px' }}>Atyachari</div>
              </div>
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => setShowAccountMenu(!showAccountMenu)}
                  style={{ 
                    background: showAccountMenu ? 'rgba(255,255,255,0.1)' : 'transparent', 
                    border: 'none', 
                    color: 'var(--text-secondary)', 
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '8px',
                    transition: 'var(--transition-fast)'
                  }} 
                  onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                  onMouseOut={(e) => e.currentTarget.style.background = showAccountMenu ? 'rgba(255,255,255,0.1)' : 'transparent'}
                >
                   <MoreVertical size={18} />
                </button>
                
                {/* Dropdown Menu */}
                {showAccountMenu && (
                  <div className="glass" style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '8px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '4px',
                    minWidth: '160px',
                    zIndex: 20
                  }}>
                    <button 
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        background: 'transparent',
                        border: 'none',
                        color: '#ef4444',
                        fontSize: '13px',
                        fontWeight: 500,
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'var(--transition-fast)'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                      onClick={() => setShowAccountMenu(false)}
                    >
                      <LogOut size={14} />
                      Remove Account
                    </button>
                  </div>
                )}
              </div>
           </div>
           
           <button style={{ 
              width: '100%', 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: 'rgba(255,255,255,0.05)', 
              border: '1px solid rgba(255,255,255,0.05)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              fontWeight: 500,
              padding: '12px',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'var(--transition-fast)'
           }}
           onMouseOver={(e) => {
             e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
             e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
           }}
           onMouseOut={(e) => {
             e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
             e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
           }}>
              <UserPlus size={16} />
              Add Account
           </button>
        </div>
      </div>

      {/* Social Hub Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
           <Users size={18} className="text-accent"/> Social Hub
        </h2>
        <button className="btn" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', padding: '6px' }}>
          <ExternalLink size={14}/>
        </button>
      </div>

      {/* Friends List (Redesigned with glass cards) */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto', paddingRight: '8px' }}>
        
        {/* Online Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Online ({friends.filter(f => f.status === 'Online').length})</div>
            <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600, transition: 'var(--transition-fast)' }} onMouseOver={e => e.currentTarget.style.color = 'white'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
              <UserPlus size={14} /> Add
            </button>
          </div>
          {friends.filter(f => f.status === 'Online').map(friend => (
            <div key={friend.name} className="glass" style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', 
              borderRadius: '12px', background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.2s', cursor: 'pointer'
            }}>
              <div style={{ position: 'relative' }}>
                <img src={friend.avatar} alt={friend.name} style={{ width: '36px', height: '36px', borderRadius: '6px' }} />
                <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', border: '2px solid #1a1b1e' }}/>
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>{friend.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{friend.tag}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Offline Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Offline ({friends.filter(f => f.status === 'Offline').length})</div>
          {friends.filter(f => f.status === 'Offline').map(friend => (
            <div key={friend.name} className="glass" style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', 
              borderRadius: '12px', background: 'rgba(255,255,255,0.01)',
              border: '1px solid rgba(255,255,255,0.02)', transition: 'all 0.2s', cursor: 'pointer', opacity: 0.6
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
            onMouseOut={(e) => e.currentTarget.style.opacity = '0.6'}
            >
              <div style={{ position: 'relative' }}>
                <img src={friend.avatar} alt={friend.name} style={{ width: '36px', height: '36px', borderRadius: '6px', filter: 'grayscale(100%) brightness(70%)' }} />
                <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '10px', height: '10px', borderRadius: '50%', background: '#6b7280', border: '2px solid #1a1b1e' }}/>
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>{friend.name}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>{friend.tag}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sponsor / Ads Section */}
      <div className="glass" style={{ 
        marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '16px',
        padding: '16px', borderRadius: '16px', background: 'rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div style={{
          width: '100%', height: '120px', borderRadius: '8px', overflow: 'hidden',
          backgroundImage: `url('${adPlaceholder}')`, backgroundSize: 'cover', backgroundPosition: 'center',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)'
        }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button className="btn btn-primary" style={{ fontSize: '13px', padding: '10px', justifyContent: 'center', width: '100%' }}>
             🚀 Subscribe to Custom Client+
          </button>
          <button className="btn" style={{ fontSize: '12px', padding: '8px', justifyContent: 'center', background: 'transparent', border: 'none', color: 'var(--text-secondary)' }}>
             Remove Ads
          </button>
        </div>
      </div>

    </aside>
  );
}
