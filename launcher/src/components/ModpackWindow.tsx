import { useState, useEffect } from 'react';
import {
  X,
  Search,
  Folder,
  Code,
  Gamepad2,
  Download,
  Package,
  Layers,
  Server,
  Image as ImageIcon,
  AlertCircle,
  Copy,
  Trash2,
  CheckCircle,
  Upload,
} from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function ModpackWindow({
  modpack,
  close,
}: {
  modpack: any;
  close: () => void;
}) {
  const [activeTab, setActiveTab] = useState('Files');

  const contentTabs = [
    { id: 'Mods', icon: Package },
    { id: 'Resource Packs', icon: Layers },
    { id: 'Server Packs', icon: Server },
    { id: 'Screenshots', icon: ImageIcon },
  ];

  const settingsTabs = [
    { id: 'Files', icon: Folder },
    { id: 'Java Environment', icon: Code },
    { id: 'Versions', icon: Gamepad2 },
    { id: 'Export', icon: Download },
  ];

  const [installedMods, setInstalledMods] = useState<any[]>([]);
  const [loadingMods, setLoadingMods] = useState(false);

  // Instance Settings
  const [javaPath, setJavaPath] = useLocalStorage(
    `java_path_${modpack.id}`,
    '<Use Global Default>',
  );
  const [jvmArgs, setJvmArgs] = useLocalStorage(
    `jvm_args_${modpack.id}`,
    '-Xmx4G -XX:+UseG1GC',
  );
  const [mcVersion, setMcVersion] = useLocalStorage(
    `mc_version_${modpack.id}`,
    modpack.version || '1.20.4',
  );
  const [modLoader, setModLoader] = useLocalStorage(
    `mod_loader_${modpack.id}`,
    modpack.loader || 'Fabric',
  );

  useEffect(() => {
    if (activeTab === 'Mods') {
      const saved = localStorage.getItem('installedMods');
      if (saved) {
        const ids = JSON.parse(saved);
        if (ids.length > 0) {
          setLoadingMods(true);
          const formattedIds = JSON.stringify(ids);
          fetch(`https://api.modrinth.com/v2/projects?ids=${formattedIds}`)
            .then((res) => res.json())
            .then((data) => {
              setInstalledMods(data);
              setLoadingMods(false);
            })
            .catch((err) => {
              console.error(err);
              setLoadingMods(false);
            });
        }
      }
    }
  }, [activeTab]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 200,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div
        className="animate-fade"
        style={{
          width: '950px',
          height: '650px',
          backgroundColor: '#121317',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 32px 64px rgba(0,0,0,0.5)',
          overflow: 'hidden',
        }}
      >
        {/* Top Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            background: '#16171b',
          }}
        >
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                color: 'var(--text-secondary)',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              Modifying
            </span>
            <img
              src={modpack.icon}
              alt="icon"
              style={{ width: '20px', height: '20px', borderRadius: '4px' }}
            />
            <span style={{ fontWeight: 700, fontSize: '15px' }}>
              {modpack.title}
            </span>
          </div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <button
              className="btn-lift"
              onClick={close}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Left Sidebar */}
          <div
            style={{
              width: '260px',
              backgroundColor: '#16171b',
              borderRight: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              padding: '20px 16px',
              overflowY: 'auto',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: '#1c1d21',
                borderRadius: '8px',
                padding: '10px 12px',
                marginBottom: '24px',
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
                placeholder="Search settings..."
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  width: '100%',
                  fontSize: '13px',
                }}
              />
            </div>

            <h3
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '12px',
                paddingLeft: '8px',
              }}
            >
              Content
            </h3>
            <nav
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                marginBottom: '24px',
              }}
            >
              {contentTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    border: 'none',
                    background:
                      activeTab === tab.id
                        ? 'rgba(255,255,255,0.05)'
                        : 'transparent',
                    color:
                      activeTab === tab.id ? 'white' : 'var(--text-secondary)',
                    fontWeight: activeTab === tab.id ? 600 : 500,
                    transition: 'all 0.15s ease',
                    textAlign: 'left',
                  }}
                  onMouseOver={(e) => {
                    if (activeTab !== tab.id)
                      e.currentTarget.style.color = 'white';
                  }}
                  onMouseOut={(e) => {
                    if (activeTab !== tab.id)
                      e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  <tab.icon size={18} />
                  {tab.id}
                </button>
              ))}
            </nav>

            <h3
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '12px',
                paddingLeft: '8px',
              }}
            >
              Settings
            </h3>
            <nav
              style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
            >
              {settingsTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    border: 'none',
                    background:
                      activeTab === tab.id
                        ? 'rgba(255,255,255,0.05)'
                        : 'transparent',
                    color:
                      activeTab === tab.id ? 'white' : 'var(--text-secondary)',
                    fontWeight: activeTab === tab.id ? 600 : 500,
                    transition: 'all 0.15s ease',
                    textAlign: 'left',
                  }}
                  onMouseOver={(e) => {
                    if (activeTab !== tab.id)
                      e.currentTarget.style.color = 'white';
                  }}
                  onMouseOut={(e) => {
                    if (activeTab !== tab.id)
                      e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  <tab.icon size={18} />
                  {tab.id}
                </button>
              ))}
            </nav>
          </div>

          {/* Right Content */}
          <div
            style={{
              flex: 1,
              padding: '32px',
              overflowY: 'auto',
              backgroundColor: '#111215',
            }}
          >
            <h1
              style={{
                fontSize: '24px',
                fontWeight: 700,
                marginBottom: '24px',
              }}
            >
              {activeTab}
            </h1>

            {activeTab === 'Files' && (
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
              >
                <h3
                  style={{
                    fontSize: '15px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <Folder size={18} /> Game Directory
                </h3>
                <p
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '13px',
                    marginBottom: '8px',
                  }}
                >
                  Select which directory to launch Minecraft from
                </p>

                <div
                  style={{
                    background: 'rgba(234, 179, 8, 0.1)',
                    border: '1px solid rgba(234, 179, 8, 0.2)',
                    borderRadius: '8px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    marginBottom: '16px',
                  }}
                >
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <AlertCircle
                      size={20}
                      color="#eab308"
                      style={{ flexShrink: 0, marginTop: '2px' }}
                    />
                    <p
                      style={{
                        color: '#fef08a',
                        fontSize: '13px',
                        lineHeight: '1.5',
                        fontWeight: 500,
                      }}
                    >
                      This profile uses your global .minecraft folder, sharing
                      files with anything else that points there. Its mods stay
                      separate, kept per-profile.
                    </p>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      marginLeft: '32px',
                    }}
                  >
                    <span
                      style={{
                        color: '#eab308',
                        fontSize: '11px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Current directory
                    </span>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: 'rgba(0,0,0,0.3)',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        border: '1px solid rgba(234, 179, 8, 0.1)',
                      }}
                    >
                      <code
                        style={{
                          flex: 1,
                          color: 'var(--text-secondary)',
                          fontSize: '12px',
                          fontFamily: 'monospace',
                        }}
                      >
                        C:\Users\helpa\AppData\Roaming\.minecraft
                      </code>
                      <button
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-secondary)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                        className="btn-lift"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    className="btn btn-lift"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      padding: '10px 16px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'white',
                    }}
                  >
                    <Folder size={16} /> Change directory
                  </button>
                  <button
                    className="btn-lift"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'transparent',
                      border: 'none',
                      padding: '10px 16px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                    }}
                  >
                    Reset directory
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'Mods' && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <h3 style={{ fontSize: '16px', fontWeight: 600 }}>
                    Installed Mods ({installedMods.length})
                  </h3>
                  <div
                    className="glass"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      background: 'rgba(0,0,0,0.2)',
                      borderRadius: '8px',
                      padding: '6px 12px',
                      border: '1px solid rgba(255,255,255,0.05)',
                    }}
                  >
                    <Search
                      size={14}
                      color="var(--text-secondary)"
                      style={{ marginRight: '8px' }}
                    />
                    <input
                      type="text"
                      placeholder="Search installed..."
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-primary)',
                        outline: 'none',
                        width: '150px',
                        fontSize: '13px',
                      }}
                    />
                  </div>
                </div>

                {loadingMods ? (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="glass skeleton"
                        style={{ height: '64px', borderRadius: '12px' }}
                      />
                    ))}
                  </div>
                ) : installedMods.length > 0 ? (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      overflowY: 'auto',
                    }}
                  >
                    {installedMods.map((mod: any) => (
                      <div
                        key={mod.id}
                        className="glass"
                        style={{
                          display: 'flex',
                          padding: '12px',
                          alignItems: 'center',
                          gap: '16px',
                          borderRadius: '12px',
                          background: 'rgba(255,255,255,0.02)',
                          border: '1px solid rgba(255,255,255,0.05)',
                        }}
                      >
                        <img
                          src={
                            mod.icon_url ||
                            'data:image/svg+xml;utf8,<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" rx="8" fill="%232c2d33"/></svg>'
                          }
                          alt="icon"
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <h4
                            style={{
                              fontSize: '14px',
                              fontWeight: 600,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                            }}
                          >
                            {mod.title}
                            <span
                              style={{
                                fontSize: '11px',
                                background: 'rgba(255,255,255,0.1)',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                color: 'var(--text-secondary)',
                              }}
                            >
                              v{mod.versions?.[0] ? 'Latest' : '1.0.0'}
                            </span>
                          </h4>
                          <p
                            style={{
                              fontSize: '12px',
                              color: 'var(--text-secondary)',
                              marginTop: '4px',
                            }}
                          >
                            {mod.description}
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            className="btn-lift"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              background: 'rgba(168,85,247,0.1)',
                              color: '#a855f7',
                              border: '1px solid rgba(168,85,247,0.2)',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              fontSize: '12px',
                              cursor: 'pointer',
                            }}
                          >
                            <CheckCircle size={14} /> Enabled
                          </button>
                          <button
                            className="btn-lift"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: 'rgba(239,68,68,0.1)',
                              color: '#ef4444',
                              border: '1px solid rgba(239,68,68,0.2)',
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              cursor: 'pointer',
                            }}
                            onClick={() => {
                              const updated = installedMods.filter(
                                (m) => m.id !== mod.id,
                              );
                              setInstalledMods(updated);
                              localStorage.setItem(
                                'installedMods',
                                JSON.stringify(updated.map((m) => m.id)),
                              );
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '14px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      opacity: 0.5,
                    }}
                  >
                    <Package size={48} style={{ marginBottom: '16px' }} />
                    <p>No mods installed on this profile yet.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Resource Packs' && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <h3 style={{ fontSize: '16px', fontWeight: 600 }}>
                    Resource Packs (0)
                  </h3>
                  <button
                    className="btn btn-lift"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'white',
                    }}
                  >
                    <Folder size={14} /> Open Folder
                  </button>
                </div>
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(0,0,0,0.2)',
                    borderRadius: '12px',
                    border: '1px dashed rgba(255,255,255,0.1)',
                  }}
                >
                  <Layers
                    size={48}
                    color="var(--text-secondary)"
                    style={{ marginBottom: '16px', opacity: 0.5 }}
                  />
                  <p
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '14px',
                      marginBottom: '16px',
                    }}
                  >
                    No resource packs installed yet.
                  </p>
                  <button
                    className="btn btn-primary btn-lift"
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '13px',
                    }}
                  >
                    Browse Marketplace
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'Server Packs' && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <h3 style={{ fontSize: '16px', fontWeight: 600 }}>
                    Server Packs (0)
                  </h3>
                </div>
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(0,0,0,0.2)',
                    borderRadius: '12px',
                    border: '1px dashed rgba(255,255,255,0.1)',
                  }}
                >
                  <Server
                    size={48}
                    color="var(--text-secondary)"
                    style={{ marginBottom: '16px', opacity: 0.5 }}
                  />
                  <p
                    style={{ color: 'var(--text-secondary)', fontSize: '14px' }}
                  >
                    No server packs installed.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'Screenshots' && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <h3 style={{ fontSize: '16px', fontWeight: 600 }}>
                    Screenshots Gallery
                  </h3>
                  <button
                    className="btn btn-lift"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'white',
                    }}
                  >
                    <Folder size={14} /> Open Folder
                  </button>
                </div>
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(0,0,0,0.2)',
                    borderRadius: '12px',
                    border: '1px dashed rgba(255,255,255,0.1)',
                  }}
                >
                  <ImageIcon
                    size={48}
                    color="var(--text-secondary)"
                    style={{ marginBottom: '16px', opacity: 0.5 }}
                  />
                  <p
                    style={{ color: 'var(--text-secondary)', fontSize: '14px' }}
                  >
                    No screenshots taken yet.
                  </p>
                  <p
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '12px',
                      marginTop: '8px',
                      opacity: 0.7,
                    }}
                  >
                    Press F2 in-game to take a screenshot.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'Java Environment' && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '15px',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <Code size={18} /> Java Executable
                  </h3>
                  <p
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '13px',
                      marginBottom: '8px',
                    }}
                  >
                    Path to the java or javaw executable used to run this
                    profile.
                  </p>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <input
                      type="text"
                      className="input-premium"
                      value={javaPath}
                      onChange={(e) => setJavaPath(e.target.value)}
                      style={{
                        flex: 1,
                        fontFamily: 'monospace',
                        fontSize: '13px',
                      }}
                    />
                    <button
                      className="btn btn-lift"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        padding: '10px 16px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: 'white',
                      }}
                    >
                      <Folder size={16} /> Browse
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '15px',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <AlertCircle size={18} /> JVM Arguments
                  </h3>
                  <p
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '13px',
                      marginBottom: '8px',
                    }}
                  >
                    Custom arguments passed to the Java Virtual Machine. (Leave
                    empty to use global settings)
                  </p>
                  <input
                    type="text"
                    className="input-premium"
                    value={jvmArgs}
                    onChange={(e) => setJvmArgs(e.target.value)}
                    style={{
                      width: '100%',
                      fontFamily: 'monospace',
                      fontSize: '13px',
                    }}
                  />
                </div>
              </div>
            )}

            {activeTab === 'Versions' && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '15px',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <Gamepad2 size={18} /> Minecraft Version
                  </h3>
                  <p
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '13px',
                      marginBottom: '8px',
                    }}
                  >
                    Select the base game version for this profile.
                  </p>
                  <select
                    value={mcVersion}
                    onChange={(e) => setMcVersion(e.target.value)}
                    className="input-premium"
                    style={{
                      width: '200px',
                      cursor: 'pointer',
                      appearance: 'none',
                      background:
                        'rgba(0,0,0,0.2) url("data:image/svg+xml;utf8,<svg fill=%27white%27 height=%2724%27 viewBox=%270 0 24 24%27 width=%2724%27 xmlns=%27http://www.w3.org/2000/svg%27><path d=%27M7 10l5 5 5-5z%27/></svg>") no-repeat right 8px center',
                    }}
                  >
                    <option value="1.21.1">1.21.1</option>
                    <option value="1.20.4">1.20.4</option>
                    <option value="1.19.4">1.19.4</option>
                    <option value="1.18.2">1.18.2</option>
                    <option value="1.8.9">1.8.9</option>
                  </select>
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '15px',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <Layers size={18} /> Mod Loader
                  </h3>
                  <p
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '13px',
                      marginBottom: '8px',
                    }}
                  >
                    Which loader to use for mods.
                  </p>
                  <select
                    value={modLoader}
                    onChange={(e) => setModLoader(e.target.value)}
                    className="input-premium"
                    style={{
                      width: '200px',
                      cursor: 'pointer',
                      appearance: 'none',
                      background:
                        'rgba(0,0,0,0.2) url("data:image/svg+xml;utf8,<svg fill=%27white%27 height=%2724%27 viewBox=%270 0 24 24%27 width=%2724%27 xmlns=%27http://www.w3.org/2000/svg%27><path d=%27M7 10l5 5 5-5z%27/></svg>") no-repeat right 8px center',
                    }}
                  >
                    <option value="Fabric">Fabric</option>
                    <option value="Forge">Forge</option>
                    <option value="Quilt">Quilt</option>
                    <option value="NeoForge">NeoForge</option>
                    <option value="Vanilla">Vanilla</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'Export' && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px',
                }}
              >
                <div
                  style={{
                    background: 'rgba(168, 85, 247, 0.1)',
                    border: '1px solid rgba(168, 85, 247, 0.2)',
                    borderRadius: '12px',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}
                >
                  <Download
                    size={48}
                    color="#a855f7"
                    style={{ marginBottom: '16px' }}
                  />
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: 600,
                      color: 'white',
                      marginBottom: '8px',
                    }}
                  >
                    Export Profile
                  </h3>
                  <p
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '14px',
                      marginBottom: '24px',
                      maxWidth: '400px',
                    }}
                  >
                    Share your custom modpack with friends! This will package
                    all your mods, configs, and resource packs into a single zip
                    file.
                  </p>
                  <button
                    className="btn btn-primary btn-lift"
                    style={{
                      padding: '12px 32px',
                      fontSize: '16px',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <Upload size={18} /> Generate .zip Archive
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
