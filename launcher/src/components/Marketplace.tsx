import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Download, ArrowLeft, CheckCircle, ExternalLink, Loader2 } from 'lucide-react';

export default function Marketplace() {
  const [query, setQuery] = useState('');
  const [mods, setMods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [totalHits, setTotalHits] = useState(0);
  
  // Default to fabric per architecture rules
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedEnvironments, setSelectedEnvironments] = useState<string[]>([]);
  const [projectType, setProjectType] = useState('mod');
  const [sort, setSort] = useState('relevance');
  const [isSortOpen, setIsSortOpen] = useState(false);
  
  const [viewingMod, setViewingMod] = useState<any>(null);
  const [modDetails, setModDetails] = useState<any>(null);
  
  const [installedMods, setInstalledMods] = useState<string[]>([]);

  const categoriesList = ['Adventure', 'Challenging', 'Combat', 'Kitchen Sink', 'Lightweight', 'Magic', 'Optimization', 'Decoration', 'Library'];

  // Initialize installed mods from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('installedMods');
    if (saved) {
      setInstalledMods(JSON.parse(saved));
    }
  }, []);

  const handleInstall = (modId: string) => {
    const updated = [...installedMods, modId];
    setInstalledMods(updated);
    localStorage.setItem('installedMods', JSON.stringify(updated));
  };

  const fetchMods = async () => {
    if (offset === 0) setLoading(true);
    else setLoadingMore(true);
    
    try {
      let facetsList = [];
      
      // Only force Fabric loader for mods and modpacks
      if (projectType === 'mod' || projectType === 'modpack') {
        facetsList.push(`["categories:fabric"]`);
      }
      
      // Project type
      facetsList.push(`["project_type:${projectType}"]`);

      // Categories
      if (selectedCategories.length > 0) {
        facetsList.push(`[` + selectedCategories.map(c => `"categories:${c.toLowerCase().replace(' ', '_')}"`).join(',') + `]`);
      }

      // Environments
      if (selectedEnvironments.includes('Client')) {
        facetsList.push(`["client_side:required", "client_side:optional"]`);
      }
      if (selectedEnvironments.includes('Server')) {
        facetsList.push(`["server_side:required", "server_side:optional"]`);
      }
      
      const facets = `[` + facetsList.join(',') + `]`;
      
      const url = `https://api.modrinth.com/v2/search?query=${encodeURIComponent(query)}&facets=${encodeURIComponent(facets)}&index=${sort}&limit=20&offset=${offset}`;
      const res = await fetch(url);
      const data = await res.json();
      
      if (offset === 0) {
        setMods(data.hits);
      } else {
        setMods(prev => {
          const newIds = new Set(data.hits.map((m: any) => m.project_id));
          const filteredPrev = prev.filter((m: any) => !newIds.has(m.project_id));
          return [...filteredPrev, ...data.hits];
        });
      }
      
      setTotalHits(data.total_hits);
    } catch (err) {
      console.error("Failed to fetch Modrinth API:", err);
    }
    
    setLoading(false);
    setLoadingMore(false);
  };

  // Fast Search (Rate Limit Removed)
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchMods();
    }, 50); // 50ms almost instant debounce
    return () => clearTimeout(handler);
  }, [query, selectedCategories, selectedEnvironments, projectType, sort, offset]);

  // Fetch full details when viewing a specific mod
  useEffect(() => {
    if (viewingMod) {
      setModDetails(null);
      fetch(`https://api.modrinth.com/v2/project/${viewingMod.project_id}`)
        .then(res => res.json())
        .then(data => setModDetails(data))
        .catch(err => console.error(err));
    }
  }, [viewingMod]);

  const toggleCategory = (cat: string) => {
    setMods([]);
    setOffset(0); // Reset pagination
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter(c => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const renderSkeletons = (count: number) => (
    <>
      {[...Array(count)].map((_, i) => (
        <div key={`skel-${i}`} className="glass skeleton" style={{ display: 'flex', padding: '16px', alignItems: 'center', gap: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.02)' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)' }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ width: '30%', height: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} />
            <div style={{ width: '60%', height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} />
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ width: '40px', height: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }} />
              <div style={{ width: '40px', height: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
            <div style={{ width: '80px', height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} />
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ width: '60px', height: '24px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px' }} />
              <div style={{ width: '60px', height: '24px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px' }} />
            </div>
          </div>
        </div>
      ))}
    </>
  );

  // --------------------------------------------------------
  // SUB-VIEW: Mod Details Page
  // --------------------------------------------------------
  if (viewingMod) {
    const isInstalled = installedMods.includes(viewingMod.project_id);
    
    return (
      <div className="animate-scale-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button className="glass btn" onClick={() => setViewingMod(null)} style={{ padding: '8px 16px', borderRadius: '8px' }}>
            <ArrowLeft size={18} style={{ marginRight: '8px' }}/> Back to Search
          </button>
        </div>
        
        <div className="glass" style={{ flex: 1, padding: '32px', borderRadius: '16px', overflowY: 'auto', background: 'rgba(25, 26, 30, 0.7)' }}>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
            <img src={viewingMod.icon_url || 'data:image/svg+xml;utf8,<svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="128" height="128" rx="16" fill="%232c2d33"/></svg>'} alt="Icon" style={{ width: '128px', height: '128px', borderRadius: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }} />
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: '32px', fontWeight: 700 }}>{viewingMod.title}</h1>
              <p style={{ fontSize: '18px', color: 'var(--text-secondary)', marginTop: '8px' }}>{viewingMod.description}</p>
              
              <div style={{ display: 'flex', gap: '16px', marginTop: '24px', alignItems: 'center' }}>
                <button 
                  className={isInstalled ? "glass btn" : "btn btn-primary"} 
                  onClick={() => !isInstalled && handleInstall(viewingMod.project_id)}
                  style={{ padding: '12px 32px', fontSize: '16px', borderRadius: '12px', boxShadow: isInstalled ? 'none' : '0 4px 16px rgba(168,85,247,0.3)' }}
                >
                  {isInstalled ? <><CheckCircle size={18} style={{ marginRight: '8px' }} color="#a855f7"/> Installed</> : 'Install Mod'}
                </button>
                <a href={`https://modrinth.com/mod/${viewingMod.project_id}`} target="_blank" rel="noreferrer" className="glass btn" style={{ padding: '12px 24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'white' }}>
                  <ExternalLink size={18}/> View on Modrinth Website
                </a>
              </div>
            </div>
            
            <div className="glass" style={{ width: '280px', padding: '24px', borderRadius: '16px', background: 'rgba(0,0,0,0.2)' }}>
              <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>Information</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Downloads</span>
                  <span>{viewingMod.downloads.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Author</span>
                  <span>{viewingMod.author}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>License</span>
                  <span>{modDetails ? modDetails.license?.name || 'Unknown' : 'Loading...'}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div style={{ marginTop: '48px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>Description</h2>
            {modDetails ? (
              <div style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '15px' }}>
                {/* Normally we would render markdown here. For this demo, just show text */}
                <p>Welcome to the in-launcher details page for {viewingMod.title}!</p>
                <p>This mod has been fetched securely from Modrinth. Currently rendering markdown is mocked for performance in this early build, but all core API stats have been retrieved correctly.</p>
                <p><strong>Support:</strong> {modDetails.issues_url || 'No issue tracker available.'}</p>
                <p><strong>Source:</strong> {modDetails.source_url || 'No source available.'}</p>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                <Loader2 className="animate-spin" size={20} /> Loading details from Modrinth...
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------
  // MAIN VIEW: Search and Discovery
  // --------------------------------------------------------
  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '16px' }}>
      
      {/* Top Navigation Row */}
      <div className="glass" style={{ display: 'flex', gap: '8px', padding: '6px', borderRadius: '10px', width: 'fit-content', background: 'rgba(25, 26, 30, 0.7)' }}>
        {[
          { label: 'Modpacks', type: 'modpack' }, 
          { label: 'Mods', type: 'mod' }, 
          { label: 'Resource Packs', type: 'resourcepack' }, 
          { label: 'Shaders', type: 'shader' }
        ].map((tab) => (
           <button 
             key={tab.type}
             className="btn-lift"
             onClick={() => { setProjectType(tab.type); setMods([]); setOffset(0); }}
             style={{ 
               background: projectType === tab.type ? 'var(--accent-primary)' : 'transparent', 
               border: 'none', padding: '6px 16px', fontSize: '13px', 
               color: projectType === tab.type ? 'white' : 'var(--text-secondary)', 
               cursor: 'pointer', borderRadius: '6px'
             }}
             onMouseOver={(e) => {
               if(projectType !== tab.type) {
                 e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                 e.currentTarget.style.color = 'white';
               }
             }}
             onMouseOut={(e) => {
               if(projectType !== tab.type) {
                 e.currentTarget.style.background = 'transparent';
                 e.currentTarget.style.color = 'var(--text-secondary)';
               }
             }}
           >
             {tab.label}
           </button>
        ))}
      </div>

      <div style={{ display: 'flex', height: '100%', gap: '24px', overflow: 'hidden' }}>
        {/* Main Mods List */}
        <div 
          style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', paddingRight: '8px', minWidth: '500px' }}
          onScroll={(e) => {
            const target = e.currentTarget;
            if (target.scrollHeight - target.scrollTop - target.clientHeight < 150) {
              if (!loading && !loadingMore && offset + 20 < totalHits) {
                setOffset(prev => prev + 20);
              }
            }
          }}
        >
          
          {/* Search Bar */}
          <div className="glass" style={{ display: 'flex', alignItems: 'center', padding: '0 16px', borderRadius: '8px', flexShrink: 0, height: '48px', background: 'rgba(25, 26, 30, 0.7)' }}>
            <Search size={20} color="var(--text-secondary)" style={{ marginRight: '12px' }} />
            <input 
              type="text" 
              placeholder="Search Modrinth (Fabric)..." 
              value={query}
              onChange={(e) => { setQuery(e.target.value); setMods([]); setOffset(0); }}
              style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', width: '100%', fontSize: '15px' }} 
            />
            {loading && <Loader2 className="animate-spin" size={20} color="var(--accent-primary)" />}
          </div>

          {/* Sort By and Pagination */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', marginRight: '8px', color: 'var(--text-secondary)' }}>Sort by:</span>
                
                <div 
                  className="glass" 
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '6px 12px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', minWidth: '130px', justifyContent: 'space-between', transition: 'var(--transition-fast)' }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                >
                  {sort === 'relevance' && 'Relevance'}
                  {sort === 'downloads' && 'Downloads'}
                  {sort === 'newest' && 'Newest'}
                  {sort === 'updated' && 'Recently Updated'}
                  <ChevronDown size={14} style={{ transform: isSortOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}/>
                </div>
                
                {isSortOpen && (
                  <div className="glass animate-fade" style={{ position: 'absolute', top: '100%', left: '50px', marginTop: '8px', width: '160px', borderRadius: '12px', padding: '6px', display: 'flex', flexDirection: 'column', gap: '2px', zIndex: 100, background: 'rgba(20, 21, 26, 0.95)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
                    {[
                      { value: 'relevance', label: 'Relevance' },
                      { value: 'downloads', label: 'Downloads' },
                      { value: 'newest', label: 'Newest' },
                      { value: 'updated', label: 'Recently Updated' }
                    ].map(opt => (
                      <button 
                        key={opt.value}
                        className="slide-right"
                        onClick={() => { setSort(opt.value); setMods([]); setOffset(0); setIsSortOpen(false); }}
                        style={{ background: sort === opt.value ? 'var(--accent-primary)' : 'transparent', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', textAlign: 'left', fontSize: '13px', cursor: 'pointer' }}
                        onMouseOver={(e) => { 
                          if(sort !== opt.value) e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                        }}
                        onMouseOut={(e) => { 
                          if(sort !== opt.value) e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}>
                {totalHits.toLocaleString()} results found
              </div>
            </div>
          </div>

          {/* Mod List */}
          <div 
            className="animate-slide-up" 
            style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '32px' }}
          >
            {mods.length === 0 && !loading && (
              <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No mods found for this query.
              </div>
            )}
            
            {loading && offset === 0 && renderSkeletons(8)}

            {mods.map((mod) => {
              const isInstalled = installedMods.includes(mod.project_id);
              
              return (
                <div key={mod.project_id} className="glass" style={{ 
                   display: 'flex', 
                   padding: '16px', 
                   alignItems: 'center', 
                   gap: '16px', 
                   borderRadius: '16px',
                   transition: 'transform 0.2s, box-shadow 0.2s, background 0.2s',
                   background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
                   boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                   cursor: 'pointer'
                }}
                onMouseOver={(e) => {
                   e.currentTarget.style.transform = 'translateY(-2px)';
                   e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
                   e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))';
                }}
                onMouseOut={(e) => {
                   e.currentTarget.style.transform = 'translateY(0)';
                   e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
                   e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))';
                }}
                >
                  <img src={mod.icon_url || 'data:image/svg+xml;utf8,<svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="56" height="56" rx="12" fill="%232c2d33"/></svg>'} alt="Icon" style={{ width: '56px', height: '56px', borderRadius: '12px', boxShadow: '0 4px 8px rgba(0,0,0,0.3)' }} />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {mod.title}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '6px' }}>{mod.description}</p>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '10px', fontSize: '12px', color: 'var(--text-secondary)', alignItems: 'center' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '12px' }}>
                         {mod.author}
                      </span>
                      {mod.categories?.slice(0, 3).map((tag: string) => (
                        <span key={tag} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '12px' }}>
                          <div style={{ width:'6px', height:'6px', borderRadius:'50%', background: tag === 'fabric' ? '#d3c4a9' : 'var(--accent-primary)' }} /> 
                          {tag.charAt(0).toUpperCase() + tag.slice(1)}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Download size={12}/> {mod.downloads >= 1000000 ? (mod.downloads/1000000).toFixed(1) + 'M' : mod.downloads.toLocaleString()}</span>
                      <span>{new Date(mod.date_modified).toLocaleDateString()}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        className="btn btn-lift" 
                        onClick={(e) => { e.stopPropagation(); setViewingMod(mod); }} 
                        style={{ padding: '6px 16px', fontSize: '13px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)' }}
                      >View</button>
                      
                      <button 
                        className={isInstalled ? "glass btn btn-lift" : "btn btn-primary btn-lift"} 
                        onClick={(e) => { e.stopPropagation(); !isInstalled && handleInstall(mod.project_id); }}
                        style={{ padding: '6px 16px', fontSize: '13px', borderRadius: '8px', boxShadow: isInstalled ? 'none' : '0 4px 12px rgba(168,85,247,0.3)' }}
                      >
                        {isInstalled ? <CheckCircle size={14} color="#a855f7" /> : 'Install'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {loadingMore && renderSkeletons(3)}
        </div>
      </div>

      {/* Right Sidebar Filters - Heavy Glassmorphism */}
      <div className="glass" style={{ width: '260px', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto', flexShrink: 0, padding: '20px', borderRadius: '16px', background: 'rgba(15, 15, 18, 0.45)' }}>
        
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'white', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            Category <ChevronDown size={16}/>
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
             {categoriesList.map(cat => {
               const isActive = selectedCategories.includes(cat);
               return (
                 <button 
                   key={cat} 
                   className="slide-right"
                   onClick={() => toggleCategory(cat)}
                   style={{ 
                     display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', 
                     color: isActive ? 'white' : 'var(--text-secondary)', 
                     background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent', 
                     border: 'none', cursor: 'pointer', padding: '6px 8px', borderRadius: '6px'
                   }} 
                   onMouseOver={(e) => {
                     if(!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                   }} 
                   onMouseOut={(e) => {
                     if(!isActive) e.currentTarget.style.background = 'transparent';
                   }}
                 >
                   <div style={{ 
                     width: '16px', height: '16px', border: isActive ? 'none' : '1px solid rgba(255,255,255,0.2)', 
                     borderRadius: '4px', background: isActive ? 'var(--accent-primary)' : 'rgba(0,0,0,0.2)',
                     display: 'flex', alignItems: 'center', justifyContent: 'center'
                   }}>
                     {isActive && <CheckCircle size={12} color="white" />}
                   </div> 
                   {cat}
                 </button>
               )
             })}
             <button style={{ background: 'transparent', border: 'none', color: 'var(--accent-primary)', fontSize: '12px', marginTop: '8px', cursor: 'pointer', textAlign: 'left', fontWeight: 600 }}>+ View 13 More</button>
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'white', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            Environment <ChevronDown size={16}/>
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
             {['Client', 'Server'].map(env => {
               const isActive = selectedEnvironments.includes(env);
               return (
                  <button 
                    key={env} 
                    onClick={() => {
                      setMods([]);
                      setOffset(0);
                      if(isActive) setSelectedEnvironments(selectedEnvironments.filter(e => e !== env));
                      else setSelectedEnvironments([...selectedEnvironments, env]);
                    }}
                    className="slide-right"
                   style={{ 
                     display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', 
                     color: isActive ? 'white' : 'var(--text-secondary)', 
                     background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent', 
                     border: 'none', cursor: 'pointer', padding: '6px 8px', borderRadius: '6px'
                   }} 
                   onMouseOver={(e) => {
                     if(!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                   }} 
                   onMouseOut={(e) => {
                     if(!isActive) e.currentTarget.style.background = 'transparent';
                   }}
                 >
                   <div style={{ 
                     width: '16px', height: '16px', border: isActive ? 'none' : '1px solid rgba(255,255,255,0.2)', 
                     borderRadius: '4px', background: isActive ? 'var(--accent-primary)' : 'rgba(0,0,0,0.2)',
                     display: 'flex', alignItems: 'center', justifyContent: 'center'
                   }}>
                     {isActive && <CheckCircle size={12} color="white" />}
                   </div> 
                   {env}
                 </button>
               )
             })}
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'white', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            Game version <ChevronDown size={16}/>
          </h4>
        </div>

        <div>
          <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'white', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            Loader <ChevronDown size={16}/>
          </h4>
        </div>

      </div>
      </div>
    </div>
  );
}
