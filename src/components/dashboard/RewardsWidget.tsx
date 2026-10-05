import React from 'react';
import { Card } from '../ui/Card';
import { Trophy, ChevronRight, Star } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export function RewardsWidget() {
  const points = 24500;
  const nextTierPoints = 50000;
  const progress = (points / nextTierPoints) * 100;

  return (
    <Card className="glass-card relative overflow-hidden group">
      {/* Aurora glow specific to this card */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-yellow-500/20 rounded-full blur-[40px] pointer-events-none transition-all duration-500 group-hover:scale-150 group-hover:bg-yellow-500/30" />
      
      <div className="p-6 relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <h3 className="text-lg font-bold text-white">Vault Rewards</h3>
            </div>
            <p className="text-sm text-gray-400">Current Tier: <span className="bg-metallic-gold text-transparent bg-clip-text font-bold">Obsidian</span></p>
          </div>
          <div className="bg-yellow-500/10 p-2 rounded-full border border-yellow-500/20">
            <Star className="w-6 h-6 text-yellow-500" />
          </div>
        </div>

        <div className="mb-6">
          <div className="text-3xl font-black text-white tracking-tight flex items-baseline gap-1">
            {points.toLocaleString()} <span className="text-sm font-medium text-gray-500">Pts</span>
          </div>
          <p className="text-xs text-emerald-400 mt-1 font-medium">+1,240 points this month</p>
        </div>

        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-xs text-gray-400 font-medium">
            <span>Progress to Vault Elite</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
            <div 
              className="h-full bg-metallic-gold rounded-full relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>
        </div>

        <button className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium transition-colors">
          Redeem Points
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </Card>
  );
}
