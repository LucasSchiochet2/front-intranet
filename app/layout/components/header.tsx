"use client";

import { useState, useEffect, useRef } from 'react';
import { logout, getCollaboratorMessagesAction, markMessageAsReadAction } from '@/app/actions';
import { useRouter } from 'next/navigation';
import { Message } from '@/app/interfaces';

interface User {
  id: number;
  name: string;
  email: string;
  position?: string | null;
  department?: string | null;
  birth_date?: string | null;
  url_photo?: string | null;
}

interface HeaderProps {
  onToggleSidebar: () => void;
  user?: User | null;
}

export function Header({ onToggleSidebar, user }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (user?.id) {
      getCollaboratorMessagesAction(user.id).then((result) => {
        if (result.success && result.data) {
          setMessages(result.data);
        }
      });
    }
  }, [user?.id]);

  const unreadCount = messages.filter((m) => m.is_read === 0).length;

  const handleMarkAsRead = async (msg: Message) => {
    setSelectedMessage(msg);
    setIsNotificationsOpen(false); 
    if (msg.is_read === 0) {
        await markMessageAsReadAction(msg.id);
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, is_read: 1 } : m))
        );
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
      setIsSearchOpen(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const photoSrc = user?.url_photo
    ? `${(process.env.NEXT_PUBLIC_BASE_URL || '').replace(/\/$/, '')}/${user.url_photo.replace(/^\/+/, '')}`
    : undefined;

  return (
    <header className="h-24 bg-white border-b border-gray-200 flex items-center justify-between px-6 fixed top-0 w-full z-50">
      {/* Logo Area - Hide on mobile when search is open */}
      <div className={`flex items-center gap-4 ${isSearchOpen ? 'hidden md:flex' : 'flex'}`}>
        <button 
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
        >
          <i className="las la-bars text-2xl"></i>
        </button>
        <div className="text-2xl font-bold text-primary">
          <span className="flex items-center gap-2">
            <i className="las la-cube"></i>
            Logo
          </span>
        </div>
      </div>

      {/* Search Bar - Desktop (Visible on md and up) */}
      <form onSubmit={handleSearchSubmit} className="hidden md:block flex-1 max-w-xl mx-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i className="las la-search text-gray-400 text-xl"></i>
          </div>
          <input
            name="q"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white transition-colors"
            placeholder="Buscar na intranet..."
          />
        </div>
      </form>

      {/* Search Bar - Mobile (Visible only when toggled) */}
      {isSearchOpen && (
        <form onSubmit={handleSearchSubmit} className="flex-1 mx-4 md:hidden animate-in fade-in zoom-in duration-200">
           <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="las la-search text-gray-400 text-xl"></i>
            </div>
            <input
                name="q"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white transition-colors"
                placeholder="Buscar..."
            />
           </div>
        </form>
      )}

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Mobile Search Toggle */}
        <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="md:hidden p-2 text-gray-500 hover:text-primary hover:bg-gray-50 rounded-full transition-colors"
        >
            <i className={`las ${isSearchOpen ? 'la-times' : 'la-search'} text-2xl`}></i>
        </button>

        {/* Notifications & Profile - Hide on mobile when search is open */}
        <div className={`flex items-center gap-4 ${isSearchOpen ? 'hidden md:flex' : 'flex'}`}>
            <div className="relative">
              <button 
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="relative p-2 text-gray-500 hover:text-primary hover:bg-gray-50 rounded-full transition-colors"
              >
                  <i className="las la-bell text-2xl"></i>
                  {unreadCount > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>}
              </button>
              
              {isNotificationsOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsNotificationsOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-1 border border-gray-100 z-50 animate-in fade-in zoom-in-95 duration-100 max-h-96 overflow-y-auto">
                    <div className="px-4 py-2 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900">Notificações</h3>
                    </div>
                    {messages.length === 0 ? (
                        <div className="p-4 text-center text-gray-500 text-sm">
                            Nenhuma notificação
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {messages.map((msg) => (
                                <div 
                                    key={msg.id} 
                                    className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${msg.is_read === 0 ? 'bg-blue-50/50' : ''}`}
                                    onClick={() => handleMarkAsRead(msg)}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="flex items-center gap-2">
                                            {msg.is_read === 0 && <span className="w-2 h-2 bg-red-500 rounded-full"></span>}
                                            <span className="font-medium text-sm text-gray-900">{msg.title}</span>
                                        </div>
                                        <span className="text-xs text-gray-500">{msg.created_at ? new Date(msg.created_at).toLocaleDateString() : ''}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 line-clamp-2">{msg.content}</p>
                                    <p className="text-xs text-gray-400 mt-2">De: {msg.sender}</p>
                                </div>
                            ))}
                        </div>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-700">{user?.name || 'Visitante'}</p>
                <p className="text-xs text-gray-500">{user?.position || user?.email || ''}</p>
            </div>
            <div className="relative">
              {user?.url_photo && (
                <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
              >
                <img
                  src={photoSrc}
                  alt={user.name || 'User Photo'}
                  className="w-12 h-12 rounded-full object-cover"
                />
                </button>
              )}
              {!user?.url_photo && (
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
              >
                  <span className="font-semibold">{user?.name ? getInitials(user.name) : 'V'}</span>
              </button> 
            )}

              {isProfileOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsProfileOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-100 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-4 py-2 border-b border-gray-100 sm:hidden">
                      <p className="text-sm font-medium text-gray-900">{user?.name || 'Visitante'}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                    >
                      <i className="las la-sign-out-alt text-lg"></i>
                      Sair
                    </button>
                  </div>
                </>
              )}
            </div>
            </div>
        </div>
      </div>
      
      {/* Message Details Popup */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden relative animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900">{selectedMessage.title}</h2>
                <button 
                  onClick={() => setSelectedMessage(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <i className="las la-times text-2xl"></i>
                </button>
              </div>
              
              <div className="mb-6 flex items-center gap-3 text-sm text-gray-500 border-b border-gray-100 pb-4">
                <span className="flex items-center gap-1">
                  <i className="las la-user"></i>
                  {selectedMessage.sender}
                </span>
                <span className="flex items-center gap-1">
                  <i className="las la-calendar"></i>
                  {selectedMessage.created_at ? new Date(selectedMessage.created_at).toLocaleString() : ''}
                </span>
              </div>

              <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                {selectedMessage.content}
              </div>

              {selectedMessage.attachment && (
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <a 
                    href={selectedMessage.attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                  >
                    <i className="las la-paperclip text-xl"></i>
                    Ver anexo
                  </a>
                </div>
              )}
            </div>
            
            <div className="bg-gray-50 px-6 py-4 flex justify-end">
              <button
                onClick={() => setSelectedMessage(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors font-medium"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
