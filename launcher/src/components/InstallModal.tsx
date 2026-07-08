import { useState } from 'react';
import { X, Search, Plus } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { defaultProfiles } from '../utils/defaultProfiles';

export default function InstallModal({
  mod,
  onInstall,
  close,
}: {
  mod: any;
  onInstall: (modId: string) => void;
  close: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [profiles] = useLocalStorage<any[]>(
    'launcher_profiles',
    defaultProfiles,
  );

  const filteredProfiles = profiles.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 300,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        className="animate-scale-in"
        style={{
          width: '500px',
          backgroundColor: '#16171b',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px 24px',
          }}
        >
          <h2
            style={{
              fontSize: '20px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <img
              src={
                mod?.icon_url ||
                'data:image/svg+xml;utf8,<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="4" fill="%232c2d33"/></svg>'
              }
              alt="icon"
              style={{ width: '24px', height: '24px', borderRadius: '6px' }}
            />
            Install {mod?.title}
          </h2>
          <button
            className="btn-lift"
            onClick={close}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Search Bar & Create Button */}
        <div
          style={{
            padding: '0 24px',
            display: 'flex',
            gap: '12px',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              background: '#1c1d21',
              borderRadius: '8px',
              padding: '10px 12px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <Search
              size={16}
              color="var(--text-secondary)"
              style={{ marginRight: '8px' }}
            />
            <input
              type="text"
              placeholder="Search profiles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
            className="btn btn-lift"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              borderRadius: '8px',
            }}
          >
            <Plus size={16} /> Create
          </button>
        </div>

        {/* Profile List */}
        <div
          style={{
            padding: '0 24px 24px 24px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <h3
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              marginBottom: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            Compatible Profiles ({filteredProfiles.length})
          </h3>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              maxHeight: '300px',
              overflowY: 'auto',
              paddingRight: '4px',
            }}
          >
            {filteredProfiles.map((profile) => (
              <div
                key={profile.id}
                onClick={() => {
                  onInstall(mod.project_id);
                  close();
                }}
                className="glass btn-lift"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-subtle)',
                  transition: 'background 0.2s, transform 0.2s',
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')
                }
              >
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
                >
                  <img
                    src={profile.icon}
                    alt="Icon"
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                    }}
                  />
                  <span style={{ fontSize: '15px', fontWeight: 600 }}>
                    {profile.name}
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: 'var(--text-secondary)',
                    fontSize: '13px',
                  }}
                >
                  {profile.loader === 'Fabric' && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <div
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: '#d3c4a9',
                        }}
                      />
                    </div>
                  )}
                  {profile.version}
                </div>
              </div>
            ))}

            {filteredProfiles.length === 0 && (
              <div
                style={{
                  textAlign: 'center',
                  padding: '32px 0',
                  color: 'var(--text-secondary)',
                  fontSize: '14px',
                }}
              >
                No compatible profiles found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
