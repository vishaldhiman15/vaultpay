import React from 'react';
import { Card } from '../ui/Card';
import { BrainCircuit, TrendingDown, AlertTriangle, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Link } from 'react-router-dom';

export function AIInsights() {
  return (
    <Card className="glass-card relative overflow-hidden group">
      {/* Aurora glow specific to this card */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-purple-500/20 rounded-full blur-[40px] pointer-events-none transition-all duration-500 group-hover:scale-150 group-hover:bg-purple-500/30" />
      
      <div className="p-6 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-bold text-white">Vault AI Insights</h3>
          </div>
          <span className="text-xs font-mono px-2 py-1 bg-purple-500/20 text-purple-300 rounded border border-purple-500/30">
            LIVE
          </span>
        </div>

        <div className="space-y-4">
          {/* Insight 1 */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 mt-0.5">
                <TrendingDown className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white mb-1">Great job on Dining!</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  You've spent {formatCurrency(4500)} less on dining out compared to last month. This puts you on track to save {formatCurrency(12000)} this quarter.
                </p>
              </div>
            </div>
          </div>

          {/* Insight 2 */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 mt-0.5">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white mb-1">Upcoming Renewals</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  We noticed 3 subscription renewals coming up next week totaling {formatCurrency(2450)}. Ensure your checking account has sufficient balance.
                </p>
              </div>
            </div>
          </div>
        </div>

        <Link to="/analytics" className="mt-6 flex items-center justify-center gap-2 py-3 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-300 text-sm font-medium transition-colors w-full">
          Open Full Analytics
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </Card>
  );
}
