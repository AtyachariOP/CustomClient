import React, { useState } from 'react';
import { Search, Grid, List, Download, Share2, Trash2, Calendar, Folder } from 'lucide-react';

export default function Screenshots() {
  const generatePlaceholder = (text: string, width = 640, height = 360) => {
    return `data:image/svg+xml;utf8,<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="${width}" height="${height}" fill="%231a1b1e"/><text fill="rgba(255,255,255,0.3)" xml:space="preserve" style="white-space: pre" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle" dominant-baseline="middle" x="${width/2}" y="${height/2}">${text}</text></svg>`;
  };

  const screenshots = [
    { id: 1, date: '2026-07-01', time: '14:32:10', size: '2.4 MB', server: 'mc.hypixel.net', img: generatePlaceholder('WIP - Bedwars Win Screenshot') },
    { id: 2, date: '2026-07-01', time: '12:15:00', size: '1.8 MB', server: 'Singleplayer', img: generatePlaceholder('WIP - Survival House Screenshot') },
    { id: 3, date: '2026-06-29', time: '18:45:33', size: '3.1 MB', server: 'play.mccisland.net', img: generatePlaceholder('WIP - Skybattle Screenshot') },
    { id: 4, date: '2026-06-28', time: '09:12:05', size: '2.0 MB', server: 'play.wynncraft.com', img: generatePlaceholder('WIP - Wynncraft Quest Screenshot') },
    { id: 5, date: '2026-06-25', time: '21:05:40', size: '4.5 MB', server: 'mc.hypixel.net', img: generatePlaceholder('WIP - Skyblock Hub Screenshot') },
    { id: 6, date: '2026-06-20', time: '16:20:12', size: '1.9 MB', server: 'Singleplayer', img: generatePlaceholder('WIP - Redstone Build Screenshot') },
  ];

  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '24px' }}>
      
      {/* Header Area */}
      <div className="glass" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderRadius: '16px', flexShrink: 0, background: 'rgba(25, 26, 30, 0.7)' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px' }}>
             Screenshot Gallery
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>Manage and share your captured moments.</p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="glass" style={{ display: 'flex', alignItems: 'center', padding: '0 16px', borderRadius: '8px', height: '40px', background: 'rgba(0, 0, 0, 0.2)' }}>
            <Search size={16} color="var(--text-secondary)" style={{ marginRight: '12px' }} />
            <input type="text" placeholder="Search by server..." style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', width: '200px', fontSize: '13px' }} />
          </div>
          
          <button className="glass btn" style={{ padding: '10px', borderRadius: '8px' }}>
            <Folder size={18} />
          </button>
          
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '8px', gap: '4px' }}>
             <button style={{ background: 'var(--accent-primary)', color: 'white', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}><Grid size={16}/></button>
             <button style={{ background: 'transparent', color: 'var(--text-secondary)', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}><List size={16}/></button>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px' }}>
        <div className="grid-container" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px', paddingBottom: '32px' }}>
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
                transform: hovered === shot.id ? 'translateY(-4px)' : 'translateY(0)',
                boxShadow: hovered === shot.id ? '0 12px 30px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.1)'
              }}
              onMouseOver={() => setHovered(shot.id)}
              onMouseOut={() => setHovered(null)}
            >
              <div style={{ position: 'relative', width: '100%', height: '200px' }}>
                <img src={shot.img} alt={`Screenshot ${shot.date}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                
                {/* Hover overlay actions */}
                <div style={{ 
                  position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px',
                  opacity: hovered === shot.id ? 1 : 0, transition: 'opacity 0.2s', backdropFilter: 'blur(2px)'
                }}>
                  <button className="glass" style={{ padding: '12px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', cursor: 'pointer' }} title="Download">
                    <Download size={20} />
                  </button>
                  <button className="glass" style={{ padding: '12px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', cursor: 'pointer' }} title="Share">
                    <Share2 size={20} />
                  </button>
                  <button className="glass" style={{ padding: '12px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#ef4444', cursor: 'pointer' }} title="Delete">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
              
              <div style={{ padding: '16px', background: 'linear-gradient(180deg, rgba(25,26,30,0.4), rgba(20,21,26,0.8))' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {shot.date}_{shot.time}.png
                </h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', color: 'var(--text-secondary)', fontSize: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} /> {shot.date} at {shot.time}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span>{shot.size}</span>
                    <span style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px' }}>{shot.server}</span>
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
