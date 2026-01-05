"use client";

import { useState } from 'react';
import { logout } from '@/app/actions';
import { useRouter } from 'next/navigation';

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
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

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
      <div className="hidden md:block flex-1 max-w-xl mx-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i className="las la-search text-gray-400 text-xl"></i>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white transition-colors"
            placeholder="Buscar na intranet..."
          />
        </div>
      </div>

      {/* Search Bar - Mobile (Visible only when toggled) */}
      {isSearchOpen && (
        <div className="flex-1 mx-4 md:hidden animate-in fade-in zoom-in duration-200">
           <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="las la-search text-gray-400 text-xl"></i>
            </div>
            <input
                type="text"
                autoFocus
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white transition-colors"
                placeholder="Buscar..."
            />
           </div>
        </div>
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
            <button className="relative p-2 text-gray-500 hover:text-primary hover:bg-gray-50 rounded-full transition-colors">
            <i className="las la-bell text-2xl"></i>
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

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
                  src={process.env.NEXT_PUBLIC_BASE_URL + user.url_photo}
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
    </header>
  );
}
