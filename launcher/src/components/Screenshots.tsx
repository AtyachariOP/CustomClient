import React, { useState, useEffect } from 'react';
import {
  Search,
  Grid,
  List,
  Download,
  Share2,
  Trash2,
  Calendar,
  Folder,
} from 'lucide-react';

declare global {
  interface Window {
    require: any;
  }
}

export default function Screenshots() {
  const [screenshots, setScreenshots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const loadScreenshots = () => {
    try {
      if (!window.require) {
        console.warn(
          'Node integration not available. Cannot read local files.',
        );
        setLoading(false);
        return;
      }
      const fs = window.require('fs');
      const path = window.require('path');
      const os = window.require('os');

      const mcPath = path.join(
        os.homedir(),
        'AppData',
        'Roaming',
        '.minecraft',
        'screenshots',
      );

      if (fs.existsSync(mcPath)) {
        const files = fs.readdirSync(mcPath);
        const imageFiles = files.filter((f: string) =>
          f.toLowerCase().endsWith('.png'),
        );

        // Sort newest first
        imageFiles.sort((a: string, b: string) => {
          return (
            fs.statSync(path.join(mcPath, b)).mtimeMs -
            fs.statSync(path.join(mcPath, a)).mtimeMs
          );
        });

        const loadedShots = imageFiles.map((file: string, index: number) => {
          const filePath = path.join(mcPath, file);
          const stats = fs.statSync(filePath);
          const sizeMB = (stats.size / (1024 * 1024)).toFixed(1) + ' MB';

          const d = new Date(stats.mtimeMs);
          const dateStr = d.toISOString().split('T')[0];
          const timeStr = d.toTimeString().split(' ')[0];

          const imgUrl = `file:///${filePath.replace(/\\/g, '/')}`;

          return {
            id: index,
            name: file,
            date: dateStr,
            time: timeStr,
            size: sizeMB,
            server: 'Local File',
            img: imgUrl,
            path: filePath,
          };
        });

        setScreenshots(loadedShots);
      }
    } catch (e) {
      console.error('Failed to load screenshots:', e);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadScreenshots();
  }, []);

  const handleOpenFolder = () => {
    try {
      if (!window.require) return;
      const { shell } = window.require('electron');
      const os = window.require('os');
      const path = window.require('path');
      const mcPath = path.join(
        os.homedir(),
        'AppData',
        'Roaming',
        '.minecraft',
        'screenshots',
      );
      shell.openPath(mcPath);
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenImage = (path: string) => {
    try {
      if (!window.require) return;
      const { shell } = window.require('electron');
      shell.openPath(path);
    } catch (e) {
      console.error(e);
    }
  };

  const handleShare = (e: React.MouseEvent, shot: any) => {
    e.stopPropagation();
    try {
      if (!window.require) return;
      const nativeImage = window.require('electron').nativeImage;
      const image = nativeImage.createFromPath(shot.path);
      window.require('electron').clipboard.writeImage(image);

      setCopiedId(shot.id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch (err) {
      console.error('Failed to copy image:', err);
    }
  };

  const handleDownload = (e: React.MouseEvent, shot: any) => {
    e.stopPropagation();
    const a = document.createElement('a');
    a.href = shot.img;
    a.download = shot.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDelete = (e: React.MouseEvent, shot: any) => {
    e.stopPropagation();
    if (
      window.confirm(
        `Are you sure you want to delete ${shot.name}? This cannot be undone.`,
      )
    ) {
      try {
        if (!window.require) return;
        const fs = window.require('fs');
        fs.unlinkSync(shot.path);
        setScreenshots((prev) => prev.filter((s) => s.id !== shot.id));
      } catch (err) {
        console.error('Failed to delete screenshot:', err);
      }
    }
  };

  return (
    <div
      className="animate-fade"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        gap: '24px',
      }}
    >
      {/* Header Area */}
      <div
        className="glass"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 24px',
          borderRadius: '16px',
          flexShrink: 0,
          background: 'rgba(25, 26, 30, 0.7)',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            Screenshot Gallery
          </h1>
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '14px',
              marginTop: '4px',
            }}
          >
            Manage and share your captured moments.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            className="glass"
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0 16px',
              borderRadius: '8px',
              height: '40px',
              background: 'rgba(0, 0, 0, 0.2)',
            }}
          >
            <Search
              size={16}
              color="var(--text-secondary)"
              style={{ marginRight: '12px' }}
            />
            <input
              type="text"
              placeholder="Search by server..."
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                outline: 'none',
                width: '200px',
                fontSize: '13px',
              }}
            />
          </div>

          <button
            className="glass btn"
            onClick={handleOpenFolder}
            style={{ padding: '10px', borderRadius: '8px' }}
            title="Open Screenshots Folder"
          >
            <Folder size={18} />
          </button>

          <div
            style={{
              display: 'flex',
              background: 'rgba(0,0,0,0.2)',
              padding: '4px',
              borderRadius: '8px',
              gap: '4px',
            }}
          >
            <button
              style={{
                background: 'var(--accent-primary)',
                color: 'var(--text-primary)',
                border: 'none',
                padding: '6px',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              <Grid size={16} />
            </button>
            <button
              style={{
                background: 'transparent',
                color: 'var(--text-secondary)',
                border: 'none',
                padding: '6px',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px' }}>
        <div
          className="grid-container"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '24px',
            paddingBottom: '32px',
          }}
        >
          {screenshots.length === 0 && !loading && (
            <div
              style={{
                padding: '48px',
                color: 'var(--text-secondary)',
                gridColumn: '1 / -1',
                textAlign: 'center',
              }}
            >
              No screenshots found in your .minecraft folder!
            </div>
          )}

          {screenshots.map((shot) => (
            <div
              key={shot.id}
              className="glass"
              style={{
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '16px',
                overflow: 'hidden',
                transition: 'transform 0.2s, box-shadow 0.2s',
                transform:
                  hovered === shot.id ? 'translateY(-4px)' : 'translateY(0)',
                boxShadow:
                  hovered === shot.id
                    ? '0 12px 30px rgba(0,0,0,0.3)'
                    : '0 4px 12px rgba(0,0,0,0.1)',
              }}
              onMouseOver={() => setHovered(shot.id)}
              onMouseOut={() => setHovered(null)}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '200px',
                  cursor: 'pointer',
                }}
                onClick={() => handleOpenImage(shot.path)}
              >
                <img
                  src={shot.img}
                  alt={`Screenshot ${shot.date}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                {/* Hover overlay actions */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    opacity: hovered === shot.id ? 1 : 0,
                    transition: 'opacity 0.2s',
                    backdropFilter: 'blur(2px)',
                  }}
                >
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <button
                      onClick={(e) => handleDownload(e, shot)}
                      className="glass"
                      style={{
                        padding: '12px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        transition: 'var(--transition-fast)',
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.background =
                          'rgba(255,255,255,0.2)')
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.background =
                          'rgba(255,255,255,0.1)')
                      }
                      title="Download"
                    >
                      <Download size={20} />
                    </button>
                    <button
                      onClick={(e) => handleShare(e, shot)}
                      className="glass"
                      style={{
                        padding: '12px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        transition: 'var(--transition-fast)',
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.background =
                          'rgba(255,255,255,0.2)')
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.background =
                          'rgba(255,255,255,0.1)')
                      }
                      title="Copy to Clipboard"
                    >
                      <Share2 size={20} />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, shot)}
                      className="glass"
                      style={{
                        padding: '12px',
                        borderRadius: '50%',
                        background: 'rgba(239, 68, 68, 0.2)',
                        border: '1px solid rgba(239, 68, 68, 0.4)',
                        color: '#ef4444',
                        cursor: 'pointer',
                        transition: 'var(--transition-fast)',
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.background =
                          'rgba(239, 68, 68, 0.4)')
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.background =
                          'rgba(239, 68, 68, 0.2)')
                      }
                      title="Delete"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  {/* Copied indicator */}
                  {copiedId === shot.id && (
                    <div
                      className="animate-fade"
                      style={{
                        background: 'var(--accent-primary)',
                        color: 'var(--text-primary)',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 600,
                        boxShadow: '0 4px 12px rgba(168,85,247,0.4)',
                      }}
                    >
                      Copied to clipboard!
                    </div>
                  )}
                </div>
              </div>

              <div
                style={{
                  padding: '16px',
                  background:
                    'linear-gradient(180deg, rgba(25,26,30,0.4), rgba(20,21,26,0.8))',
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
                  {shot.name}
                </h3>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '12px',
                    color: 'var(--text-secondary)',
                    fontSize: '12px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Calendar size={14} /> {shot.date} at {shot.time}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <span>{shot.size}</span>
                    <span
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                      }}
                    >
                      {shot.server}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
