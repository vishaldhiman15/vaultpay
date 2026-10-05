import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  className?: string;
}

export function Tabs({ tabs, defaultTab, className }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0].id);

  return (
    <div className={cn("w-full", className)}>
      <div className="flex space-x-1 rounded-xl bg-black/40 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
              activeTab === tab.id
                ? "bg-card text-white shadow"
                : "text-gray-400 hover:bg-white/[0.12] hover:text-white"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={cn(
              "rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              activeTab === tab.id ? "block animate-fade-in" : "hidden"
            )}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}
