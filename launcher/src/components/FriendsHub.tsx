import { useState, useRef, useEffect } from 'react';
import { Users, Search, MessageSquare, MoreVertical, UserX, Ghost, CircleDot, UserPlus, Send, X, ArrowLeft } from 'lucide-react';
import { getPlayerAvatar } from './RightSidebar';

export default function FriendsHub() {
  const [activeTab, setActiveTab] = useState('Online');
  const [searchQuery, setSearchQuery] = useState('');
  const [addFriendInput, setAddFriendInput] = useState('');
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [dropdownMenuId, setDropdownMenuId] = useState<number | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{sender: string, text: string, time: string}[]>([
    { sender: 'them', text: 'Hey, want to play some bedwars?', time: '2:30 PM' },
    { sender: 'me', text: 'Sure, let me just finish this game first', time: '2:32 PM' },
    { sender: 'them', text: 'Awesome, invite me when you are ready.', time: '2:33 PM' },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeChat) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, activeChat]);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages([...chatMessages, { sender: 'me', text: chatInput, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setChatInput('');
  };

  const tabs = ['Online', 'All', 'Pending', 'Blocked'];

  const [friendsData, setFriendsData] = useState([
    { id: 1, name: 'xEradicator', tag: 'Playing Bedwars on Hypixel', status: 'online', avatar: getPlayerAvatar('xEradicator'), type: 'friend' },
    { id: 2, name: 'EC_Revamp', tag: 'Last seen 2h ago', status: 'offline', avatar: getPlayerAvatar('EC_Revamp'), type: 'friend' },
    { id: 3, name: 'Technoblade', tag: 'Playing Skyblock', status: 'online', avatar: getPlayerAvatar('Technoblade'), type: 'friend' },
    { id: 4, name: 'Notch', tag: 'Playing Minecraft 1.0', status: 'online', avatar: getPlayerAvatar('Notch'), type: 'friend' },
    { id: 5, name: 'Grian', tag: 'Building in Hermitcraft', status: 'online', avatar: getPlayerAvatar('Grian'), type: 'friend' },
    { id: 6, name: 'MumboJumbo', tag: 'Redstoning', status: 'offline', avatar: getPlayerAvatar('MumboJumbo'), type: 'friend' },
    { id: 7, name: 'AtyachariAlt', tag: 'Incoming Friend Request', status: 'offline', avatar: getPlayerAvatar('Atyachari'), type: 'pending' },
    { id: 8, name: 'Spammer123', tag: 'Blocked', status: 'offline', avatar: getPlayerAvatar('Steve'), type: 'blocked' }
  ]);

  const handleBlock = (id: number) => {
    setFriendsData(prev => prev.map(f => f.id === id ? { ...f, type: 'blocked' } : f));
    setDropdownMenuId(null);
  };

  const handleRemove = (id: number) => {
    setFriendsData(prev => prev.filter(f => f.id !== id));
    setDropdownMenuId(null);
  };

  let displayFriends = friendsData;
  if (activeTab === 'Online') {
    displayFriends = friendsData.filter(f => f.status === 'online' && f.type === 'friend');
  } else if (activeTab === 'All') {
    displayFriends = friendsData.filter(f => f.type === 'friend');
  } else if (activeTab === 'Pending') {
    displayFriends = friendsData.filter(f => f.type === 'pending');
  } else if (activeTab === 'Blocked') {
    displayFriends = friendsData.filter(f => f.type === 'blocked');
  }

  if (searchQuery) {
    displayFriends = displayFriends.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Top Navigation Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '24px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'white', fontWeight: 700, fontSize: '18px' }}>
            <Users size={24} /> Friends
          </div>

          <div style={{ width: '1px', height: '24px', background: 'var(--border-subtle)' }} />

          <div style={{ display: 'flex', gap: '8px' }}>
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setActiveChat(null); }}
                className="btn-lift"
                style={{
                  padding: '6px 16px',
                  borderRadius: '6px',
                  background: activeTab === tab ? 'rgba(255,255,255,0.1)' : 'transparent',
                  color: activeTab === tab ? 'white' : 'var(--text-secondary)',
                  border: 'none',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {tab}
              </button>
            ))}
            <button
              onClick={() => { setActiveTab('Add Friend'); setActiveChat(null); }}
              className="btn-primary btn-lift"
              style={{
                padding: '6px 16px',
                borderRadius: '6px',
                background: activeTab === 'Add Friend' ? 'transparent' : 'var(--accent-primary)',
                color: activeTab === 'Add Friend' ? 'var(--accent-primary)' : 'white',
                border: activeTab === 'Add Friend' ? '1px solid var(--accent-primary)' : 'none',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                marginLeft: '8px'
              }}
            >
              Add Friend
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {activeTab !== 'Add Friend' && !activeChat && (
          <div className="glass" style={{ display: 'flex', alignItems: 'center', padding: '0 12px', borderRadius: '8px', height: '36px', width: '240px', border: '1px solid var(--border-subtle)' }}>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '100%', fontSize: '13px' }}
            />
            <Search size={16} color="var(--text-secondary)" />
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '16px', position: 'relative' }}>
        {activeChat ? (
          <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', overflow: 'hidden' }}>
            {(() => {
              const friend = friendsData.find(f => f.id === activeChat);
              return friend && (
                <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button onClick={() => setActiveChat(null)} className="btn-lift" style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}>
                      <ArrowLeft size={20} />
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ position: 'relative' }}>
                        <img src={friend.avatar} alt={friend.name} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                        <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '12px', height: '12px', borderRadius: '50%', background: '#111215', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          <CircleDot size={8} color={friend.status === 'online' ? '#10b981' : '#6b7280'} fill={friend.status === 'online' ? '#10b981' : 'transparent'} />
                        </div>
                      </div>
                      <span style={{ fontWeight: 600, fontSize: '16px', color: 'white' }}>{friend.name}</span>
                    </div>
                  </div>
                </div>
              );
            })()}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {chatMessages.map((msg, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'me' ? 'flex-end' : 'flex-start' }}>
                  <div style={{ maxWidth: '70%', padding: '10px 16px', borderRadius: '16px', background: msg.sender === 'me' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)', color: 'white', fontSize: '14px', borderBottomRightRadius: msg.sender === 'me' ? '4px' : '16px', borderBottomLeftRadius: msg.sender === 'me' ? '16px' : '4px' }}>
                    {msg.text}
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px', margin: '4px 4px 0 4px' }}>{msg.time}</span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.01)' }}>
              <div className="glass" style={{ display: 'flex', alignItems: 'center', padding: '8px 16px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <input type="text" placeholder={`Message @${friendsData.find(f => f.id === activeChat)?.name}`} value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendMessage()} style={{ flex: 1, background: 'transparent', border: 'none', color: 'white', outline: 'none', fontSize: '14px' }} />
                <button onClick={handleSendMessage} className="btn-lift" style={{ background: 'var(--accent-primary)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: chatInput.trim() ? 'pointer' : 'not-allowed', opacity: chatInput.trim() ? 1 : 0.5 }}>
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        ) : activeTab === 'Add Friend' ? (
          <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '16px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'white' }}>Add Friend</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>You can add friends with their Minecraft username.</p>
            <div style={{ display: 'flex', gap: '12px', maxWidth: '600px' }}>
              <input
                type="text"
                placeholder="Enter a username#0000"
                value={addFriendInput}
                onChange={e => setAddFriendInput(e.target.value)}
                className="input-premium"
                style={{ flex: 1, fontSize: '15px' }}
              />
              <button
                className="btn-primary btn-lift"
                disabled={!addFriendInput.trim()}
                style={{ padding: '0 24px', borderRadius: '8px', opacity: addFriendInput.trim() ? 1 : 0.5, cursor: addFriendInput.trim() ? 'pointer' : 'not-allowed' }}
              >
                Send Friend Request
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '64px 0', opacity: 0.5 }}>
              <UserPlus size={64} style={{ marginBottom: '24px', color: 'var(--text-secondary)' }} />
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Wumpus is waiting on friends. You don't have to though!</p>
            </div>
          </div>
        ) : displayFriends.length > 0 ? (
          <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h3 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              {activeTab} — {displayFriends.length}
            </h3>
            {displayFriends.map(friend => (
              <div
                key={friend.id}
                className="glass"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.02)',
                  transition: 'background 0.2s', cursor: 'pointer'
                }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ position: 'relative' }}>
                    <img src={friend.avatar} alt={friend.name} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                    <div style={{
                      position: 'absolute', bottom: '-2px', right: '-2px', width: '14px', height: '14px',
                      borderRadius: '50%', background: '#111215', display: 'flex', justifyContent: 'center', alignItems: 'center'
                    }}>
                      <CircleDot size={10} color={friend.status === 'online' ? '#10b981' : '#6b7280'} fill={friend.status === 'online' ? '#10b981' : 'transparent'} />
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 600, fontSize: '15px', color: 'white' }}>{friend.name}</span>
                    </div>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{friend.tag}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  {activeTab === 'Pending' ? (
                    <>
                      <button className="btn-lift" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Accept">
                        <Send size={18} />
                      </button>
                      <button className="btn-lift" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Ignore">
                        <X size={18} />
                      </button>
                    </>
                  ) : activeTab === 'Blocked' ? (
                    <button className="btn-lift" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Unblock">
                      <UserX size={18} />
                    </button>
                  ) : (
                    <>
                      <button onClick={() => setActiveChat(friend.id)} className="btn-lift" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Message">
                        <MessageSquare size={18} />
                      </button>
                      <div style={{ position: 'relative' }}>
                        <button onClick={() => setDropdownMenuId(dropdownMenuId === friend.id ? null : friend.id)} className="btn-lift" style={{ width: '36px', height: '36px', borderRadius: '50%', background: dropdownMenuId === friend.id ? 'rgba(255,255,255,0.1)' : 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="More">
                          <MoreVertical size={18} />
                        </button>
                        
                        {dropdownMenuId === friend.id && (
                          <>
                            <div style={{ position: 'fixed', inset: 0, zIndex: 90 }} onClick={() => setDropdownMenuId(null)} />
                            <div className="glass animate-fade" style={{ position: 'absolute', right: 0, top: '44px', width: '200px', padding: '8px', borderRadius: '12px', background: 'rgba(20,21,26,0.95)', border: '1px solid rgba(255,255,255,0.1)', zIndex: 100, boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
                              <button onClick={() => handleRemove(friend.id)} className="btn-lift" style={{ width: '100%', textAlign: 'left', padding: '10px 12px', background: 'transparent', border: 'none', color: '#ef4444', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <UserX size={14} /> Remove Friend
                              </button>
                              <button onClick={() => handleBlock(friend.id)} className="btn-lift" style={{ width: '100%', textAlign: 'left', padding: '10px 12px', background: 'transparent', border: 'none', color: '#ef4444', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <MoreVertical size={14} /> Block
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60%', opacity: 0.5 }}>
            <Ghost size={64} style={{ marginBottom: '24px', color: 'var(--text-secondary)' }} />
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              {activeTab === 'Online' && "No one's around to play with Wumpus."}
              {activeTab === 'All' && "You don't have any friends yet."}
              {activeTab === 'Pending' && "There are no pending friend requests."}
              {activeTab === 'Blocked' && "You haven't blocked anyone."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
