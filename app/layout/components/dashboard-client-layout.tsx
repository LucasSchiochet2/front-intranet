"use client";

import { useState, useEffect } from 'react';
import { Header } from './header';
import { SidebarClient } from './sidebar-client';
import { Breadcrumb } from './breadcrumb';
import { MenuItem } from '../../interfaces';

interface User {
  id: number;
  name: string;
  email: string;
  position?: string | null;
  department?: string | null;
}

interface DashboardClientLayoutProps {
  children: React.ReactNode;
  menuItems: MenuItem[];
  user?: User | null;
}

export function DashboardClientLayout({ children, menuItems, user }: DashboardClientLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    // Função para verificar o tamanho da tela
    const checkScreenSize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    // Verifica no carregamento inicial
    checkScreenSize();

    // Adiciona listener para mudança de tamanho
    window.addEventListener('resize', checkScreenSize);

    // Limpa o listener
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} user={user} />
      
      {/* Overlay para mobile quando a sidebar estiver aberta */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex pt-16">
        <SidebarClient menuItems={menuItems} isOpen={isSidebarOpen} />
        <main 
          className={`
            flex-1 p-6 transition-all duration-300 ease-in-out
            ${isSidebarOpen ? 'md:ml-64' : 'ml-0'}
          `}
        >
          <Breadcrumb />
          {children}
        </main>
      </div>
    </div>
  );
}
