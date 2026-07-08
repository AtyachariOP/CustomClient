import { useState } from 'react';
import {
  Search,
  Plus,
  Folder,
  Settings,
  ChevronDown,
  Box,
  CheckCircle,
  PackageOpen,
} from 'lucide-react';
import ModpackWindow from './ModpackWindow';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { defaultProfiles } from '../utils/defaultProfiles';

export default function Library() {
  const [profiles] = useLocalStorage<any[]>(
    'launcher_profiles',
    defaultProfiles,
  );
  const [selected, setSelected] = useState(
    profiles.length > 0 ? profiles[0] : null,
  );
  const [isModpackWindowOpen, setIsModpackWindowOpen] = useState(false);

  return (
    <div
      className="animate-fade"
      style={{ display: 'flex', height: '100%', gap: '24px' }}
    >
      {/* Left Area: Grid of Modpacks */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          overflowY: 'auto',
          paddingRight: '8px',
          minWidth: '500px',
        }}
      >
        {/* Top Action Bar */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <button
            className="glass btn"
            style={{ padding: '10px 20px', borderRadius: '12px' }}
          >
            <Box size={16} /> Modpacks <ChevronDown size={14} />
          </button>
          <div
            className="glass"
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              padding: '0 16px',
              borderRadius: '12px',
              height: '42px',
            }}
          >
            <Search
              size={18}
              color="var(--text-secondary)"
              style={{ marginRight: '12px' }}
            />
            <input
              type="text"
              placeholder="Search your modpacks..."
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                outline: 'none',
                width: '100%',
                fontSize: '14px',
              }}
            />
          </div>
          <button
            className="glass btn"
            style={{ padding: '10px 20px', borderRadius: '12px' }}
          >
            Popular <ChevronDown size={14} />
          </button>
          <button
            className="btn btn-primary btn-lift"
            style={{ padding: '10px 20px', borderRadius: '12px' }}
          >
            <Plus size={16} /> New Profile
          </button>
        </div>

        {/* Modpack Grid */}
        {profiles.length === 0 ? (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              opacity: 0.5,
            }}
          >
            <PackageOpen size={64} style={{ marginBottom: '16px' }} />
            <h3
              style={{
                fontSize: '18px',
                fontWeight: 600,
                color: 'white',
                marginBottom: '8px',
              }}
            >
              No Profiles Found
            </h3>
            <p>Click "New Profile" to get started.</p>
          </div>
        ) : (
          <div
            className="grid-container"
            style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            }}
          >
            {profiles.map((pack) => (
              <div
                key={pack.id}
                className="glass"
                style={{
                  position: 'relative',
                  height: '180px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border:
                    selected?.id === pack.id
                      ? '2px solid var(--accent-primary)'
                      : '2px solid rgba(255,255,255,0.05)',
                  boxShadow:
                    selected?.id === pack.id
                      ? '0 0 20px rgba(16,185,129,0.3)'
                      : '0 10px 30px rgba(0,0,0,0.2)',
                  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                }}
                onClick={() => setSelected(pack)}
              >
                {/* Background Image */}
                <div style={{ position: 'absolute', inset: 0 }}>
                  <img
                    src={pack.bg}
                    alt={pack.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background:
                        'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 100%)',
                    }}
                  />
                </div>

                {/* Content */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '8px',
                    }}
                  >
                    <img
                      src={pack.icon}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                      }}
                    />
                    <h3
                      style={{
                        fontSize: '18px',
                        fontWeight: 800,
                        textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                      }}
                    >
                      {pack.title}
                    </h3>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        background: 'rgba(255,255,255,0.2)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        backdropFilter: 'blur(4px)',
                      }}
                    >
                      {pack.version}
                    </span>
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        background: 'rgba(0,0,0,0.5)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                      }}
                    >
                      By {pack.author}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Area: Selected Modpack Details */}
      {selected && (
        <div
          className="glass"
          style={{
            width: '340px',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '24px',
            padding: '24px',
            overflowY: 'auto',
            background:
              'linear-gradient(180deg, rgba(20,21,26,0.8), rgba(15,15,18,0.95))',
            border: '1px solid rgba(255,255,255,0.08)',
            flexShrink: 0,
          }}
        >
          <h2
            style={{
              fontSize: '14px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '16px',
            }}
          >
            Selected Version
          </h2>

          <div
            style={{
              width: '100%',
              height: '160px',
              borderRadius: '16px',
              backgroundImage: `url(${selected.bg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              marginBottom: '20px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          />

          <h3
            style={{
              fontSize: '20px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '12px',
            }}
          >
            <img
              src={selected.icon}
              style={{ width: '24px', borderRadius: '4px' }}
            />{' '}
            Minecraft {selected.version}
          </h3>

          <p
            style={{
              fontSize: '13px',
              color: 'var(--text-secondary)',
              lineHeight: '1.6',
              flex: 1,
            }}
          >
            {selected.desc}
          </p>

          {/* Selected Version Controls */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              marginTop: '32px',
            }}
          >
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: '12px',
                background: '#1a1b1e',
                border: '1px solid rgba(255,255,255,0.05)',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'var(--transition-fast)',
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = '#25262b')
              }
              onMouseOut={(e) => (e.currentTarget.style.background = '#1a1b1e')}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                }}
              >
                <Folder size={16} color="#fbbf24" /> Custom directory
              </div>
              <ChevronDown size={14} />
            </button>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontSize: '14px', fontWeight: 600 }}>Version</span>
              <div
                className="glass"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  background: 'rgba(255,255,255,0.05)',
                }}
              >
                {selected.version} <ChevronDown size={14} />
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontSize: '14px', fontWeight: 600 }}>Addons</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ position: 'relative' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: '#1a1b1e',
                    }}
                  />
                  <CheckCircle
                    size={14}
                    color="#10b981"
                    fill="#1a1a1a"
                    style={{ position: 'absolute', top: '-4px', right: '-4px' }}
                  />
                </div>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: '#1a1b1e',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button
                className="glass"
                onClick={() => setIsModpackWindowOpen(true)}
                style={{
                  padding: '16px',
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)',
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')
                }
              >
                <Settings size={20} color="var(--text-secondary)" />
              </button>
              <button
                className="btn-launch"
                style={{ flex: 1, padding: '0', justifyContent: 'center' }}
              >
                LAUNCH GAME
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modpack Window Overlay */}
      {isModpackWindowOpen && selected && (
        <ModpackWindow
          modpack={selected}
          close={() => setIsModpackWindowOpen(false)}
        />
      )}
    </div>
  );
}
