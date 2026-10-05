import React from 'react';
import { Bell, Search, LogOut, Menu } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '../ui/Button';

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-14 lg:h-16 items-center justify-between border-b border-white/10 bg-background/50 px-4 lg:px-8 backdrop-blur-md sticky top-0 z-10 shrink-0">
      <div className="flex items-center gap-3 flex-1">
        {/* Mobile hamburger */}
        <button 
          onClick={onMenuToggle}
          className="lg:hidden p-2 -ml-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Search — hidden on very small screens */}
        <div className="relative w-full max-w-md hidden sm:block">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-500" />
          </div>
          <input
            type="text"
            className="block w-full rounded-full border border-white/10 bg-black/20 py-1.5 pl-10 pr-3 text-sm text-gray-300 placeholder:text-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Search transactions, accounts..."
          />
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        <button className="relative rounded-full p-2 text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-red-500"></span>
        </button>

        <div className="h-6 w-px bg-white/10 hidden sm:block"></div>

        <div className="flex items-center gap-2 lg:gap-3">
          <div className="flex-col items-end hidden sm:flex">
            <span className="text-sm font-medium text-white">{user?.name}</span>
            <span className="text-xs text-gray-500">{user?.vpa}</span>
          </div>
          <div className="flex h-8 w-8 lg:h-9 lg:w-9 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-accent text-white font-bold shadow-lg text-sm">
            {user?.name?.charAt(0)}
          </div>
          <Button variant="ghost" size="icon" onClick={logout} title="Log out" className="hidden sm:flex">
            <LogOut className="h-4 w-4 text-gray-400" />
          </Button>
        </div>
      </div>
    </header>
  );
}
