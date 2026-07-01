import React from 'react';
import { Play, Download, Star } from 'lucide-react';

export default function Home() {
  const modpacks = [
    { title: "Fabulously Optimized", desc: "Beautiful graphics and speedy performance.", dls: "13.6M", author: "Opti", tag: "Optimization" },
    { title: "Cobblemon Official", desc: "The official modpack of the Cobblemon mod.", dls: "8.2M", author: "Cobble", tag: "Adventure" },
    { title: "Vanilla Perfected", desc: "A compilation of Vanilla Plus mods.", dls: "1.9M", author: "Perfect", tag: "Optimization" },
    { title: "Aged", desc: "Realistic medieval progression.", dls: "1.1M", author: "Medieval", tag: "Adventure" }
  ];

  // SVG Placeholders
  const heroPlaceholder = `data:image/svg+xml;utf8,<svg width="1920" height="400" viewBox="0 0 1920 400" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="1920" height="400" fill="%2325262b"/><text fill="white" xml:space="preserve" style="white-space: pre" font-family="Inter" font-size="48" font-weight="bold" letter-spacing="0em"><tspan x="780" y="210">WIP - Hero Banner</tspan></text></svg>`;
  const cardPlaceholder = `data:image/svg+xml;utf8,<svg width="600" height="300" viewBox="0 0 600 300" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="600" height="300" fill="%2325262b"/><text fill="white" xml:space="preserve" style="white-space: pre" font-family="Inter" font-size="24" font-weight="bold" letter-spacing="0em"><tspan x="200" y="160">WIP - Modpack Cover</tspan></text></svg>`;

  return (
    <div className="animate-fade" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Navigation Bar */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Welcome to Custom Client!</h1>
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
          backgroundImage: `url('${heroPlaceholder}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: '1px solid var(--border-subtle)',
          flexShrink: 0
        }}>
          {/* Dark Overlay */}
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)' }} />
          
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
             <button className="btn-launch">
               <Play fill="currentColor" size={24} />
               LAUNCH GAME
             </button>
             <p style={{ marginTop: '12px', color: 'rgba(255,255,255,0.7)', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                Custom Client 1.20.4 <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)' }}/> Fabric
             </p>
          </div>
        </div>

        {/* Modrinth-style Grid */}
        <div style={{ flexShrink: 0 }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Discover Themes & Modpacks
          </h2>
          <div className="grid-container">
            {modpacks.map((pack, i) => (
              <div key={i} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '140px', backgroundColor: '#333', backgroundImage: `url('${cardPlaceholder}')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600 }}>{pack.title}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4', flex: 1 }}>{pack.desc}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Download size={14}/> {pack.dls}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Star size={14}/> {pack.author}</span>
                    <span style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '10px' }}>{pack.tag}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
