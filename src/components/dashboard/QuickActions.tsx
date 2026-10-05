import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, QrCode, Download, Plus } from 'lucide-react';
import { Card } from '../ui/Card';

const actions = [
  { icon: Send, label: 'Send Money', color: 'bg-blue-500/20 text-blue-400', path: '/payments?tab=send' },
  { icon: QrCode, label: 'Scan & Pay', color: 'bg-purple-500/20 text-purple-400', path: '/payments?tab=qr' },
  { icon: Download, label: 'Request', color: 'bg-emerald-500/20 text-emerald-400', path: '/payments?tab=collect' },
  { icon: Plus, label: 'Add Money', color: 'bg-orange-500/20 text-orange-400', path: '/accounts' },
];

export function QuickActions() {
  const navigate = useNavigate();
  return (
    <Card className="p-6">
      <h3 className="mb-4 text-lg font-semibold text-white">Quick Actions</h3>
      <div className="grid grid-cols-4 gap-4">
        {actions.map((action, i) => (
          <button
            key={action.label}
            onClick={() => navigate(action.path)}
            className="flex flex-col items-center justify-center gap-3 rounded-xl border border-white/5 bg-black/20 p-4 transition-all hover:bg-white/5 hover:scale-105 active:scale-95 animate-fade-in"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className={`flex h-12 w-12 items-center justify-center rounded-full ${action.color}`}>
              <action.icon className="h-6 w-6" />
            </div>
            <span className="text-xs font-medium text-gray-300">{action.label}</span>
          </button>
        ))}
      </div>
    </Card>
  );
}
