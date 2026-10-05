import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Wallet, CreditCard, ShieldAlert, AlertTriangle, Send, PieChart, Bot, Bitcoin, Gift, TrendingUp, PiggyBank, Smartphone, X, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const navSections = [
  {
    title: 'Main',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
      { icon: Wallet, label: 'Accounts', path: '/accounts' },
      { icon: Send, label: 'Payments', path: '/payments' },
      { icon: CreditCard, label: 'Cards', path: '/cards' },
    ]
  },
  {
    title: 'Services',
    items: [
      { icon: Smartphone, label: 'UPI Settings', path: '/upi' },
      { icon: Bitcoin, label: 'Crypto', path: '/crypto' },
      { icon: TrendingUp, label: 'Wealth', path: '/wealth' },
      { icon: PiggyBank, label: 'Vaults', path: '/vaults' },
    ]
  },
  {
    title: 'More',
    items: [
      { icon: PieChart, label: 'Analytics', path: '/analytics' },
      { icon: Gift, label: 'Rewards', path: '/rewards' },
      { icon: Bot, label: 'AI Advisor', path: '/ai-advisor' },
      { icon: ShieldAlert, label: 'Compliance', path: '/compliance' },
      { icon: AlertTriangle, label: 'Emergency', path: '/emergency' },
    ]
  }
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r bg-sidebar transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-6 border-b shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-xl font-bold text-primary-foreground">V</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">VaultPay</span>
          </div>
          <button onClick={onClose} className="lg:hidden p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {navSections.map((section) => (
            <div key={section.title}>
              <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-500">{section.title}</p>
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        "group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                      )
                    }
                  >
                    <item.icon className="mr-3 h-4 w-4 flex-shrink-0" />
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="p-4 mt-auto shrink-0 space-y-3">
          <button 
            onClick={() => {
              localStorage.removeItem('vaultpay_user');
              window.location.href = '/';
            }}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 py-2.5 text-sm font-medium transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
