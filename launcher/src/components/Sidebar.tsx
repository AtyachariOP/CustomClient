import React from 'react';
import { Home as HomeIcon, Compass, Library, Settings, LogIn, Users, Image as ImageIcon } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) {
  const topItems = [
    { id: 'home', icon: HomeIcon, label: 'Home' },
    { id: 'discover', icon: Compass, label: 'Discover' },
    { id: 'library', icon: Library, label: 'Library' },
    { id: 'screenshots', icon: ImageIcon, label: 'Screenshots' }
  ];

  return (
    <aside style={{
      width: '64px',
      height: '100%',
      backgroundColor: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px 0',
      zIndex: 10
    }}>
      {/* Brand Icon */}
      <div style={{ color: 'var(--accent-primary)', marginBottom: '32px' }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Main Nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        {topItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={{
              background: 'transparent',
              border: 'none',
              color: activeTab === item.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
              padding: '12px',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'var(--transition-fast)',
              position: 'relative'
            }}
            title={item.label}
          >
            <item.icon size={24} />
            {activeTab === item.id && (
              <div style={{
                position: 'absolute',
                left: '-20px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '4px',
                height: '24px',
                backgroundColor: 'var(--accent-primary)',
                borderRadius: '0 4px 4px 0'
              }} />
            )}
          </button>
        ))}
      </nav>

      {/* Bottom Nav */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button
          onClick={() => setActiveTab('friends')}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', padding: '12px', cursor: 'pointer' }}
          title="Friends"
        >
          <Users size={24} />
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          style={{ background: 'transparent', border: 'none', color: activeTab === 'settings' ? 'var(--accent-primary)' : 'var(--text-secondary)', padding: '12px', cursor: 'pointer' }}
          title="Settings"
        >
          <Settings size={24} />
        </button>
        <button
          style={{ background: 'transparent', border: 'none', color: 'var(--accent-primary)', padding: '12px', cursor: 'pointer', marginTop: '8px' }}
          title="Sign In"
        >
          <LogIn size={24} />
        </button>
      </div>
    </aside>
  );
}
