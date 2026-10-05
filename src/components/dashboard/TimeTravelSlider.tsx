import React from 'react';
import { Card } from '../ui/Card';
import { FastForward, Clock } from 'lucide-react';

interface TimeTravelSliderProps {
  offset: number;
  setOffset: (val: number) => void;
}

export function TimeTravelSlider({ offset, setOffset }: TimeTravelSliderProps) {
  return (
    <Card className="p-4 mb-6 border-accent/20 bg-gradient-to-r from-card to-accent/5 overflow-hidden relative">
      <div className="absolute -right-10 -top-10 opacity-10 pointer-events-none">
        <FastForward size={140} />
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FastForward className="text-accent w-5 h-5" />
            Financial Time Travel
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            Slide to project your future wealth based on your current savings and spending velocity.
          </p>
        </div>
        
        <div className="flex-1 w-full max-w-md">
          <div className="flex justify-between text-xs font-mono text-gray-500 mb-2">
            <span>Today</span>
            <span className="text-accent font-bold">+{offset} Months</span>
            <span>+12 Months</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="12" 
            value={offset} 
            onChange={(e) => setOffset(Number(e.target.value))}
            className="w-full h-2 bg-black/40 rounded-lg appearance-none cursor-pointer accent-accent"
          />
          <div className="mt-2 text-xs text-right text-gray-400 flex items-center justify-end gap-1">
            <Clock size={12} /> Projected Date: 
            <span className="text-white font-medium">
              {new Date(Date.now() + offset * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
