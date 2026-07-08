import { useState, useEffect, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import {
  Search,
  ChevronDown,
  ChevronUp,
  Download,
  ArrowLeft,
  CheckCircle,
  ExternalLink,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import InstallModal from './InstallModal';

export default function Marketplace() {
  const [query, setQuery] = useState('');
  const [mods, setMods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [totalHits, setTotalHits] = useState(0);

  // Default to fabric per architecture rules
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedEnvironments, setSelectedEnvironments] = useState<string[]>(
    [],
  );
  const [projectType, setProjectType] = useState('mod');
  const [sort, setSort] = useState('relevance');
  const [isSortOpen, setIsSortOpen] = useState(false);

  const [viewingMod, setViewingMod] = useState<any>(null);
  const [modDetails, setModDetails] = useState<any>(null);
  const [installingMod, setInstallingMod] = useState<any>(null);

  const [installedMods, setInstalledMods] = useState<string[]>([]);

  // Sidebar Filters State
  const [gameVersions, setGameVersions] = useState<string[]>([]);
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
  const [versionSearch, setVersionSearch] = useState('');
  const [showAllVersions, setShowAllVersions] = useState(false);
  const [showMoreCategories, setShowMoreCategories] = useState(false);
  const [openSourceOnly, setOpenSourceOnly] = useState(false);

  const [expandedSections, setExpandedSections] = useState({
    gameVersion: true,
    loader: true,
    category: true,
    environment: true,
    license: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: mods.length + (loadingMore ? 3 : 0), // Add 3 for skeleton loaders at the end
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120, // 104px card + 16px gap roughly
    overscan: 5,
  });

  const categoriesList = [
    'Adventure',
    'Cursed',
    'Decoration',
    'Economy',
    'Equipment',
    'Food',
    'Game Mechanics',
    'Library',
    'Magic',
    'Management',
    'Minigame',
    'Mobs',
    'Optimization',
    'Social',
    'Storage',
    'Technology',
    'Transportation',
    'Utility',
    'World Generation',
  ];

  // Initialize installed mods from localStorage
  useEffect(() => {
    // Fetch available game versions
    fetch('https://api.modrinth.com/v2/tag/game_version')
      .then((res) => res.json())
      .then((data) => {
        setGameVersions(
          data
            .filter((v: any) => v.version_type === 'release')
            .map((v: any) => v.version),
        );
      })
      .catch(console.error);

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
    setApiError(null);

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
        facetsList.push(
          `[` +
            selectedCategories
              .map((c) => `"categories:${c.toLowerCase().replace(' ', '_')}"`)
              .join(',') +
            `]`,
        );
      }

      // Environments
      if (selectedEnvironments.includes('Client')) {
        facetsList.push(`["client_side:required", "client_side:optional"]`);
      }
      if (selectedEnvironments.includes('Server')) {
        facetsList.push(`["server_side:required", "server_side:optional"]`);
      }

      // Game Versions
      if (selectedVersions.length > 0) {
        facetsList.push(
          `[` + selectedVersions.map((v) => `"versions:${v}"`).join(',') + `]`,
        );
      }

      // License
      if (openSourceOnly) {
        facetsList.push(`["open_source:true"]`);
      }

      const facets = `[` + facetsList.join(',') + `]`;

      const url = `https://api.modrinth.com/v2/search?query=${encodeURIComponent(query)}&facets=${encodeURIComponent(facets)}&index=${sort}&limit=20&offset=${offset}`;
      const res = await fetch(url);
      const data = await res.json();

      if (offset === 0) {
        setMods(data.hits);
      } else {
        setMods((prev) => {
          const newIds = new Set(data.hits.map((m: any) => m.project_id));
          const filteredPrev = prev.filter(
            (m: any) => !newIds.has(m.project_id),
          );
          return [...filteredPrev, ...data.hits];
        });
      }

      setTotalHits(data.total_hits);
    } catch (err: any) {
      console.error('Failed to fetch Modrinth API:', err);
      setApiError(
        'Failed to connect to the Modrinth API. Please check your internet connection or try again later.',
      );
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    query,
    selectedCategories,
    selectedEnvironments,
    selectedVersions,
    openSourceOnly,
    projectType,
    sort,
    offset,
  ]);

  // Fetch full details when viewing a specific mod
  useEffect(() => {
    if (viewingMod) {
      setModDetails(null);
      fetch(`https://api.modrinth.com/v2/project/${viewingMod.project_id}`)
        .then((res) => res.json())
        .then((data) => setModDetails(data))
        .catch((err) => console.error(err));
    }
  }, [viewingMod]);

  const toggleCategory = (cat: string) => {
    setMods([]);
    setOffset(0); // Reset pagination
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const renderSkeletons = (count: number) => (
    <>
      {[...Array(count)].map((_, i) => (
        <div
          key={`skel-${i}`}
          className="glass skeleton"
          style={{
            display: 'flex',
            padding: '16px',
            alignItems: 'center',
            gap: '16px',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.02)',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.05)',
            }}
          />
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div
              style={{
                width: '30%',
                height: '16px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '4px',
              }}
            />
            <div
              style={{
                width: '60%',
                height: '12px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '4px',
              }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <div
                style={{
                  width: '40px',
                  height: '16px',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '12px',
                }}
              />
              <div
                style={{
                  width: '40px',
                  height: '16px',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '12px',
                }}
              />
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '8px',
            }}
          >
            <div
              style={{
                width: '80px',
                height: '12px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '4px',
              }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <div
                style={{
                  width: '60px',
                  height: '24px',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '6px',
                }}
              />
              <div
                style={{
                  width: '60px',
                  height: '24px',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '6px',
                }}
              />
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
      <div
        className="animate-scale-in"
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          gap: '24px',
        }}
      >
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button
            className="glass btn"
            onClick={() => setViewingMod(null)}
            style={{ padding: '8px 16px', borderRadius: '8px' }}
          >
            <ArrowLeft size={18} style={{ marginRight: '8px' }} /> Back to
            Search
          </button>
        </div>

        <div
          className="glass"
          style={{
            flex: 1,
            padding: '32px',
            borderRadius: '16px',
            overflowY: 'auto',
            background: 'rgba(25, 26, 30, 0.7)',
          }}
        >
          <div
            style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}
          >
            <img
              src={
                viewingMod.icon_url ||
                'data:image/svg+xml;utf8,<svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="128" height="128" rx="16" fill="%232c2d33"/></svg>'
              }
              alt="Icon"
              style={{
                width: '128px',
                height: '128px',
                borderRadius: '24px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              }}
            />
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: '32px', fontWeight: 700 }}>
                {viewingMod.title}
              </h1>
              <p
                style={{
                  fontSize: '18px',
                  color: 'var(--text-secondary)',
                  marginTop: '8px',
                }}
              >
                {viewingMod.description}
              </p>

              <div
                style={{
                  display: 'flex',
                  gap: '16px',
                  marginTop: '24px',
                  alignItems: 'center',
                }}
              >
                <button
                  className={isInstalled ? 'glass btn' : 'btn btn-primary'}
                  onClick={() => !isInstalled && setInstallingMod(viewingMod)}
                  style={{
                    padding: '12px 32px',
                    fontSize: '16px',
                    borderRadius: '12px',
                    boxShadow: isInstalled
                      ? 'none'
                      : '0 4px 16px rgba(168,85,247,0.3)',
                  }}
                >
                  {isInstalled ? (
                    <>
                      <CheckCircle
                        size={18}
                        style={{ marginRight: '8px' }}
                        color="#a855f7"
                      />{' '}
                      Installed
                    </>
                  ) : (
                    'Install Mod'
                  )}
                </button>
                <a
                  href={`https://modrinth.com/mod/${viewingMod.project_id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="glass btn"
                  style={{
                    padding: '12px 24px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    textDecoration: 'none',
                    color: 'var(--text-primary)',
                  }}
                >
                  <ExternalLink size={18} /> View on Modrinth Website
                </a>
              </div>
            </div>

            <div
              className="glass"
              style={{
                width: '280px',
                padding: '24px',
                borderRadius: '16px',
                background: 'rgba(0,0,0,0.2)',
              }}
            >
              <h3
                style={{
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                  marginBottom: '16px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                Information
              </h3>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  fontSize: '14px',
                }}
              >
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span style={{ color: 'var(--text-secondary)' }}>
                    Downloads
                  </span>
                  <span>{viewingMod.downloads.toLocaleString()}</span>
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span style={{ color: 'var(--text-secondary)' }}>Author</span>
                  <span>{viewingMod.author}</span>
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span style={{ color: 'var(--text-secondary)' }}>
                    License
                  </span>
                  <span>
                    {modDetails
                      ? modDetails.license?.name || 'Unknown'
                      : 'Loading...'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '48px' }}>
            <h2
              style={{
                fontSize: '20px',
                fontWeight: 600,
                marginBottom: '24px',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                paddingBottom: '12px',
              }}
            >
              Description
            </h2>
            {modDetails ? (
              <div
                style={{
                  color: 'var(--text-secondary)',
                  lineHeight: '1.8',
                  fontSize: '15px',
                }}
              >
                {/* Normally we would render markdown here. For this demo, just show text */}
                <p>
                  Welcome to the in-launcher details page for {viewingMod.title}
                  !
                </p>
                <p>
                  This mod has been fetched securely from Modrinth. Currently
                  rendering markdown is mocked for performance in this early
                  build, but all core API stats have been retrieved correctly.
                </p>
                <p>
                  <strong>Support:</strong>{' '}
                  {modDetails.issues_url || 'No issue tracker available.'}
                </p>
                <p>
                  <strong>Source:</strong>{' '}
                  {modDetails.source_url || 'No source available.'}
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--text-secondary)',
                }}
              >
                <Loader2 className="animate-spin" size={20} /> Loading details
                from Modrinth...
              </div>
            )}
          </div>
        </div>

        {installingMod && (
          <InstallModal
            mod={installingMod}
            onInstall={handleInstall}
            close={() => setInstallingMod(null)}
          />
        )}
      </div>
    );
  }

  // --------------------------------------------------------
  // MAIN VIEW: Search and Discovery
  // --------------------------------------------------------
  return (
    <div
      className="animate-fade"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        gap: '16px',
      }}
    >
      {/* Top Navigation Row */}
      <div
        className="glass"
        style={{
          display: 'flex',
          gap: '8px',
          padding: '6px',
          borderRadius: '10px',
          width: 'fit-content',
          background: 'rgba(25, 26, 30, 0.7)',
        }}
      >
        {[
          { label: 'Modpacks', type: 'modpack' },
          { label: 'Mods', type: 'mod' },
          { label: 'Resource Packs', type: 'resourcepack' },
          { label: 'Shaders', type: 'shader' },
        ].map((tab) => (
          <button
            key={tab.type}
            className="btn-lift"
            onClick={() => {
              setProjectType(tab.type);
              setMods([]);
              setOffset(0);
            }}
            style={{
              background:
                projectType === tab.type
                  ? 'var(--accent-primary)'
                  : 'transparent',
              border: 'none',
              padding: '6px 16px',
              fontSize: '13px',
              color:
                projectType === tab.type ? 'white' : 'var(--text-secondary)',
              cursor: 'pointer',
              borderRadius: '6px',
            }}
            onMouseOver={(e) => {
              if (projectType !== tab.type) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.color = 'white';
              }
            }}
            onMouseOut={(e) => {
              if (projectType !== tab.type) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          height: '100%',
          gap: '24px',
          overflow: 'hidden',
        }}
      >
        {/* Main Mods Area */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            minWidth: '500px',
          }}
        >
          {/* Search Bar */}
          <div
            className="glass"
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0 16px',
              borderRadius: '8px',
              flexShrink: 0,
              height: '48px',
              background: 'rgba(25, 26, 30, 0.7)',
            }}
          >
            <Search
              size={20}
              color="var(--text-secondary)"
              style={{ marginRight: '12px' }}
            />
            <input
              type="text"
              placeholder="Search Modrinth (Fabric)..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setMods([]);
                setOffset(0);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                outline: 'none',
                width: '100%',
                fontSize: '15px',
              }}
            />
            {loading && (
              <Loader2
                className="animate-spin"
                size={20}
                color="var(--accent-primary)"
              />
            )}
          </div>

          {/* Sort By and Pagination */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexShrink: 0,
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', gap: '12px' }}>
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    fontSize: '13px',
                    marginRight: '8px',
                    color: 'var(--text-secondary)',
                  }}
                >
                  Sort by:
                </span>

                <div
                  className="glass"
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'var(--text-primary)',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    minWidth: '130px',
                    justifyContent: 'space-between',
                    transition: 'var(--transition-fast)',
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.background =
                      'rgba(255,255,255,0.08)')
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.background =
                      'rgba(255,255,255,0.05)')
                  }
                >
                  {sort === 'relevance' && 'Relevance'}
                  {sort === 'downloads' && 'Downloads'}
                  {sort === 'newest' && 'Newest'}
                  {sort === 'updated' && 'Recently Updated'}
                  <ChevronDown
                    size={14}
                    style={{
                      transform: isSortOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s',
                    }}
                  />
                </div>

                {isSortOpen && (
                  <div
                    className="glass animate-fade"
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: '50px',
                      marginTop: '8px',
                      width: '160px',
                      borderRadius: '12px',
                      padding: '6px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                      zIndex: 100,
                      background: 'rgba(20, 21, 26, 0.95)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                    }}
                  >
                    {[
                      { value: 'relevance', label: 'Relevance' },
                      { value: 'downloads', label: 'Downloads' },
                      { value: 'newest', label: 'Newest' },
                      { value: 'updated', label: 'Recently Updated' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        className="slide-right"
                        onClick={() => {
                          setSort(opt.value);
                          setMods([]);
                          setOffset(0);
                          setIsSortOpen(false);
                        }}
                        style={{
                          background:
                            sort === opt.value
                              ? 'var(--accent-primary)'
                              : 'transparent',
                          color: 'var(--text-primary)',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          textAlign: 'left',
                          fontSize: '13px',
                          cursor: 'pointer',
                        }}
                        onMouseOver={(e) => {
                          if (sort !== opt.value)
                            e.currentTarget.style.background =
                              'rgba(255,255,255,0.1)';
                        }}
                        onMouseOut={(e) => {
                          if (sort !== opt.value)
                            e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div
                style={{
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {totalHits.toLocaleString()} results found
              </div>
            </div>
          </div>

          {/* SCROLLING Mod List (Virtualized) */}
          <div
            ref={parentRef}
            className="animate-slide-up"
            style={{
              flex: 1,
              overflowY: 'auto',
              paddingRight: '8px',
              position: 'relative',
            }}
            onScroll={(e) => {
              const target = e.currentTarget;
              if (
                target.scrollHeight - target.scrollTop - target.clientHeight <
                400
              ) {
                if (!loading && !loadingMore && offset + 20 < totalHits) {
                  setOffset((prev) => prev + 20);
                }
              }
            }}
          >
            {apiError && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '60%',
                  color: 'var(--text-secondary)',
                  marginTop: '48px',
                }}
              >
                <AlertCircle
                  size={64}
                  style={{
                    marginBottom: '16px',
                    color: '#ef4444',
                    opacity: 0.8,
                  }}
                />
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: 600,
                    color: 'white',
                    marginBottom: '8px',
                  }}
                >
                  API Error
                </h3>
                <p
                  style={{
                    maxWidth: '400px',
                    textAlign: 'center',
                    lineHeight: '1.5',
                  }}
                >
                  {apiError}
                </p>
                <button
                  className="btn btn-primary btn-lift"
                  onClick={() => fetchMods()}
                  style={{
                    marginTop: '24px',
                    padding: '10px 24px',
                    borderRadius: '8px',
                  }}
                >
                  Retry Connection
                </button>
              </div>
            )}

            {!apiError && mods.length === 0 && !loading && (
              <div
                style={{
                  padding: '48px',
                  textAlign: 'center',
                  color: 'var(--text-secondary)',
                }}
              >
                No mods found for this query.
              </div>
            )}

            {!apiError && loading && offset === 0 && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                {renderSkeletons(8)}
              </div>
            )}

            {!apiError && mods.length > 0 && (
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: `${rowVirtualizer.getTotalSize()}px`,
                }}
              >
                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                  const mod = mods[virtualRow.index];

                  // If mod is undefined, we are rendering a skeleton for the "loadingMore" state
                  if (!mod) {
                    return (
                      <div
                        key={`loading-${virtualRow.index}`}
                        ref={rowVirtualizer.measureElement}
                        data-index={virtualRow.index}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          transform: `translateY(${virtualRow.start}px)`,
                          paddingBottom: '12px',
                        }}
                      >
                        {renderSkeletons(1)}
                      </div>
                    );
                  }

                  const isInstalled = installedMods.includes(mod.project_id);

                  return (
                    <div
                      key={mod.project_id}
                      ref={rowVirtualizer.measureElement}
                      data-index={virtualRow.index}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        transform: `translateY(${virtualRow.start}px)`,
                        paddingBottom: '12px',
                      }}
                    >
                      <div
                        className="glass"
                        style={{
                          display: 'flex',
                          padding: '16px',
                          alignItems: 'center',
                          gap: '16px',
                          borderRadius: '16px',
                          transition:
                            'transform 0.2s, box-shadow 0.2s, background 0.2s',
                          background:
                            'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                          cursor: 'pointer',
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow =
                            '0 8px 24px rgba(0,0,0,0.2)';
                          e.currentTarget.style.background =
                            'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow =
                            '0 4px 20px rgba(0,0,0,0.1)';
                          e.currentTarget.style.background =
                            'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))';
                        }}
                      >
                        <img
                          src={
                            mod.icon_url ||
                            'data:image/svg+xml;utf8,<svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="56" height="56" rx="12" fill="%232c2d33"/></svg>'
                          }
                          alt="Icon"
                          style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '12px',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <h3
                            style={{
                              fontSize: '16px',
                              fontWeight: 600,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                            }}
                          >
                            {mod.title}
                          </h3>
                          <p
                            style={{
                              color: 'var(--text-secondary)',
                              fontSize: '13px',
                              marginTop: '6px',
                            }}
                          >
                            {mod.description}
                          </p>
                          <div
                            style={{
                              display: 'flex',
                              gap: '12px',
                              marginTop: '10px',
                              fontSize: '12px',
                              color: 'var(--text-secondary)',
                              alignItems: 'center',
                            }}
                          >
                            <span
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                background: 'rgba(255,255,255,0.05)',
                                padding: '2px 8px',
                                borderRadius: '12px',
                              }}
                            >
                              {mod.author}
                            </span>
                            {mod.categories?.slice(0, 3).map((tag: string) => (
                              <span
                                key={tag}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  background: 'rgba(255,255,255,0.05)',
                                  padding: '2px 8px',
                                  borderRadius: '12px',
                                }}
                              >
                                <div
                                  style={{
                                    width: '6px',
                                    height: '6px',
                                    borderRadius: '50%',
                                    background:
                                      tag === 'fabric'
                                        ? '#d3c4a9'
                                        : 'var(--accent-primary)',
                                  }}
                                />
                                {tag.charAt(0).toUpperCase() + tag.slice(1)}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            gap: '12px',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              gap: '12px',
                              fontSize: '12px',
                              color: 'var(--text-secondary)',
                            }}
                          >
                            <span
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                              }}
                            >
                              <Download size={12} />{' '}
                              {mod.downloads >= 1000000
                                ? (mod.downloads / 1000000).toFixed(1) + 'M'
                                : mod.downloads.toLocaleString()}
                            </span>
                            <span>
                              {new Date(mod.date_modified).toLocaleDateString()}
                            </span>
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              className="btn btn-lift"
                              onClick={(e) => {
                                e.stopPropagation();
                                setViewingMod(mod);
                              }}
                              style={{
                                padding: '6px 16px',
                                fontSize: '13px',
                                borderRadius: '8px',
                                background: 'rgba(255,255,255,0.1)',
                              }}
                            >
                              View
                            </button>

                            <button
                              className={
                                isInstalled
                                  ? 'glass btn btn-lift'
                                  : 'btn btn-primary btn-lift'
                              }
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!isInstalled) setInstallingMod(mod);
                              }}
                              style={{
                                padding: '6px 16px',
                                fontSize: '13px',
                                borderRadius: '8px',
                                boxShadow: isInstalled
                                  ? 'none'
                                  : '0 4px 12px rgba(168,85,247,0.3)',
                              }}
                            >
                              {isInstalled ? (
                                <CheckCircle size={14} color="#a855f7" />
                              ) : (
                                'Install'
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar Filters - Heavy Glassmorphism */}
        <div
          className="glass"
          style={{
            width: '260px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            overflowY: 'auto',
            flexShrink: 0,
            padding: '20px',
            borderRadius: '16px',
            background: 'rgba(15, 15, 18, 0.45)',
          }}
        >
          {/* Game Version */}
          <div>
            <h4
              onClick={() => toggleSection('gameVersion')}
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: expandedSections.gameVersion ? '12px' : '0',
                display: 'flex',
                justifyContent: 'space-between',
                paddingBottom: '8px',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                cursor: 'pointer',
              }}
            >
              Game version{' '}
              {expandedSections.gameVersion ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </h4>
            {expandedSections.gameVersion && (
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'rgba(0,0,0,0.2)',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    marginBottom: '4px',
                  }}
                >
                  <Search
                    size={14}
                    color="var(--text-secondary)"
                    style={{ marginRight: '6px' }}
                  />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={versionSearch}
                    onChange={(e) => setVersionSearch(e.target.value)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-primary)',
                      outline: 'none',
                      width: '100%',
                      fontSize: '12px',
                    }}
                  />
                </div>
                {gameVersions
                  .filter((v) => v.includes(versionSearch))
                  .slice(0, showAllVersions ? undefined : 6)
                  .map((v) => {
                    const isActive = selectedVersions.includes(v);
                    return (
                      <button
                        key={v}
                        onClick={() => {
                          setMods([]);
                          setOffset(0);
                          if (isActive)
                            setSelectedVersions(
                              selectedVersions.filter((x) => x !== v),
                            );
                          else setSelectedVersions([...selectedVersions, v]);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          fontSize: '13px',
                          color: isActive ? 'white' : 'var(--text-secondary)',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '4px 0',
                          textAlign: 'left',
                        }}
                      >
                        <div
                          style={{
                            width: '16px',
                            height: '16px',
                            border: isActive
                              ? 'none'
                              : '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '4px',
                            background: isActive
                              ? 'var(--accent-primary)'
                              : 'rgba(0,0,0,0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {isActive && <CheckCircle size={12} color="white" />}
                        </div>
                        {v}
                      </button>
                    );
                  })}
                {gameVersions.filter((v) => v.includes(versionSearch)).length >
                  6 && (
                  <button
                    onClick={() => setShowAllVersions(!showAllVersions)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'white',
                      fontSize: '12px',
                      marginTop: '4px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <div
                      style={{
                        width: '16px',
                        height: '16px',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '4px',
                        background: 'rgba(0,0,0,0.2)',
                      }}
                    />
                    {showAllVersions
                      ? 'Show less versions'
                      : 'Show all versions'}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Loader */}
          <div>
            <h4
              onClick={() => toggleSection('loader')}
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: expandedSections.loader ? '12px' : '0',
                display: 'flex',
                justifyContent: 'space-between',
                paddingBottom: '8px',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                cursor: 'pointer',
              }}
            >
              Loader{' '}
              {expandedSections.loader ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </h4>
            {expandedSections.loader && (
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}
              >
                {['Fabric', 'Forge', 'NeoForge'].map((loader) => {
                  const isFabric = loader === 'Fabric';
                  return (
                    <div
                      key={loader}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '13px',
                        color: isFabric ? 'white' : 'var(--text-secondary)',
                        padding: '4px 0',
                        opacity: isFabric ? 1 : 0.5,
                      }}
                    >
                      <div
                        style={{
                          width: '16px',
                          height: '16px',
                          border: isFabric
                            ? 'none'
                            : '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '4px',
                          background: isFabric ? '#f29c38' : 'rgba(0,0,0,0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {isFabric && <CheckCircle size={12} color="white" />}
                      </div>
                      {loader}
                    </div>
                  );
                })}
                <div
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '12px',
                    marginTop: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <ChevronDown size={14} /> Show more
                </div>
              </div>
            )}
          </div>

          {/* Category */}
          <div>
            <h4
              onClick={() => toggleSection('category')}
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: expandedSections.category ? '12px' : '0',
                display: 'flex',
                justifyContent: 'space-between',
                paddingBottom: '8px',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                cursor: 'pointer',
              }}
            >
              Category{' '}
              {expandedSections.category ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </h4>
            {expandedSections.category && (
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}
              >
                {categoriesList
                  .slice(0, showMoreCategories ? undefined : 9)
                  .map((cat) => {
                    const isActive = selectedCategories.includes(cat);
                    return (
                      <button
                        key={cat}
                        onClick={() => toggleCategory(cat)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          fontSize: '13px',
                          color: isActive ? 'white' : 'var(--text-secondary)',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '4px 0',
                          textAlign: 'left',
                        }}
                      >
                        <div
                          style={{
                            width: '16px',
                            height: '16px',
                            border: isActive
                              ? 'none'
                              : '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '4px',
                            background: isActive
                              ? 'var(--accent-primary)'
                              : 'rgba(0,0,0,0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {isActive && <CheckCircle size={12} color="white" />}
                        </div>
                        {cat}
                      </button>
                    );
                  })}
                {categoriesList.length > 9 && (
                  <button
                    onClick={() => setShowMoreCategories(!showMoreCategories)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--accent-primary)',
                      fontSize: '12px',
                      marginTop: '8px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontWeight: 600,
                    }}
                  >
                    {showMoreCategories
                      ? '- View Less'
                      : `+ View ${categoriesList.length - 9} More`}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Environment */}
          <div>
            <h4
              onClick={() => toggleSection('environment')}
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: expandedSections.environment ? '12px' : '0',
                display: 'flex',
                justifyContent: 'space-between',
                paddingBottom: '8px',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                cursor: 'pointer',
              }}
            >
              Environment{' '}
              {expandedSections.environment ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </h4>
            {expandedSections.environment && (
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}
              >
                {['Client', 'Server'].map((env) => {
                  const isActive = selectedEnvironments.includes(env);
                  return (
                    <button
                      key={env}
                      onClick={() => {
                        setMods([]);
                        setOffset(0);
                        if (isActive)
                          setSelectedEnvironments(
                            selectedEnvironments.filter((e) => e !== env),
                          );
                        else
                          setSelectedEnvironments([
                            ...selectedEnvironments,
                            env,
                          ]);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '13px',
                        color: isActive ? 'white' : 'var(--text-secondary)',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px 0',
                        textAlign: 'left',
                      }}
                    >
                      <div
                        style={{
                          width: '16px',
                          height: '16px',
                          border: isActive
                            ? 'none'
                            : '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '4px',
                          background: isActive
                            ? 'var(--accent-primary)'
                            : 'rgba(0,0,0,0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {isActive && <CheckCircle size={12} color="white" />}
                      </div>
                      {env}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* License */}
          <div>
            <h4
              onClick={() => toggleSection('license')}
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: expandedSections.license ? '12px' : '0',
                display: 'flex',
                justifyContent: 'space-between',
                paddingBottom: '8px',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                cursor: 'pointer',
              }}
            >
              License{' '}
              {expandedSections.license ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </h4>
            {expandedSections.license && (
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}
              >
                <button
                  onClick={() => {
                    setMods([]);
                    setOffset(0);
                    setOpenSourceOnly(!openSourceOnly);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '13px',
                    color: openSourceOnly ? 'white' : 'var(--text-secondary)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px 0',
                    textAlign: 'left',
                  }}
                >
                  <div
                    style={{
                      width: '16px',
                      height: '16px',
                      border: openSourceOnly
                        ? 'none'
                        : '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '4px',
                      background: openSourceOnly
                        ? 'var(--accent-primary)'
                        : 'rgba(0,0,0,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {openSourceOnly && <CheckCircle size={12} color="white" />}
                  </div>
                  Open source
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {installingMod && (
        <InstallModal
          mod={installingMod}
          onInstall={handleInstall}
          close={() => setInstallingMod(null)}
        />
      )}
    </div>
  );
}
