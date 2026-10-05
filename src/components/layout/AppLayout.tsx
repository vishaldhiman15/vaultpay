import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex flex-1 flex-col overflow-hidden relative w-full">
        {/* Background effects */}
        <div className="absolute inset-0 bg-grid pointer-events-none opacity-5" />
        
        <Header onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 relative z-0 scroll-smooth">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
