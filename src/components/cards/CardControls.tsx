import React, { useState } from 'react';
import { Card as CardType } from '@/types';
import { Card } from '../ui/Card';
import { Lock, Unlock, Wifi, Globe, Settings2 } from 'lucide-react';

interface CardControlsProps {
  card: CardType;
  onUpdate: (updates: Partial<CardType>) => void;
}

export function CardControls({ card, onUpdate }: CardControlsProps) {
  const [limit, setLimit] = useState(card.dailyLimit);

  const isFrozen = card.status === 'FROZEN';

  const toggleFreeze = () => {
    onUpdate({ status: isFrozen ? 'ACTIVE' : 'FROZEN' });
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setLimit(val);
  };

  const saveLimit = () => {
    onUpdate({ dailyLimit: limit });
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Card Controls</h3>
      
      <div className="space-y-6">
        {/* Freeze Control */}
        <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
          <div className="flex items-center gap-4">
            <div className={`p-2 rounded-lg ${isFrozen ? 'bg-red-500/20 text-red-500' : 'bg-primary/20 text-primary'}`}>
              {isFrozen ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
            </div>
            <div>
              <p className="text-sm font-medium text-white">{isFrozen ? 'Unfreeze Card' : 'Freeze Card'}</p>
              <p className="text-xs text-gray-400">Temporarily lock your card</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={isFrozen} onChange={toggleFreeze} />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-card after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
          </label>
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col p-4 bg-black/20 rounded-xl border border-white/5 gap-3">
            <div className="flex justify-between items-center">
              <Globe className="h-5 w-5 text-gray-400" />
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={card.onlineEnabled} onChange={() => onUpdate({ onlineEnabled: !card.onlineEnabled })} disabled={isFrozen} />
                <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-card after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary opacity-disabled"></div>
              </label>
            </div>
            <div>
              <p className="text-sm font-medium text-white">Online Usage</p>
            </div>
          </div>
          
          <div className="flex flex-col p-4 bg-black/20 rounded-xl border border-white/5 gap-3">
            <div className="flex justify-between items-center">
              <Wifi className="h-5 w-5 text-gray-400" />
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={card.contactlessEnabled} onChange={() => onUpdate({ contactlessEnabled: !card.contactlessEnabled })} disabled={isFrozen} />
                <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-card after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary opacity-disabled"></div>
              </label>
            </div>
            <div>
              <p className="text-sm font-medium text-white">Contactless</p>
            </div>
          </div>
        </div>

        {/* Limit Slider */}
        <div className="p-4 bg-black/20 rounded-xl border border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <Settings2 className="h-5 w-5 text-gray-400" />
            <p className="text-sm font-medium text-white">Daily Spend Limit</p>
          </div>
          <div className="flex justify-between text-sm text-white mb-2">
            <span>₹0</span>
            <span className="font-bold text-primary">₹{limit.toLocaleString()}</span>
            <span>₹5,00,000</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="500000" 
            step="5000" 
            value={limit} 
            onChange={handleLimitChange}
            onMouseUp={saveLimit}
            onTouchEnd={saveLimit}
            disabled={isFrozen}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>
      </div>
    </Card>
  );
}
