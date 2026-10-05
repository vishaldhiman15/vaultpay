import React, { useState } from 'react';
import { Card as CardType } from '@/types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { api } from '@/services/api';
import { useQueryClient } from '@tanstack/react-query';
import { Flame, Clock, Lock, Trash2 } from 'lucide-react';
import { formatCurrency, maskCardNumber } from '@/lib/utils';
import { Spinner } from '../ui/Spinner';

export function BurnerCardsSection({ cards }: { cards: CardType[] }) {
  const burnerCards = cards.filter(c => c.type === 'BURNER' && c.status !== 'CANCELLED');
  const queryClient = useQueryClient();
  const [duration, setDuration] = useState('1');
  const [merchant, setMerchant] = useState('');
  const [limit, setLimit] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [revealedCards, setRevealedCards] = useState<Record<string, boolean>>({});

  const handleCreateBurner = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      await api.createBurnerCard(Number(duration), merchant || undefined, limit ? Number(limit) : undefined);
      queryClient.invalidateQueries({ queryKey: ['cards'] });
      setDuration('1');
      setMerchant('');
      setLimit('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancelBurner = async (id: string) => {
    try {
      await api.updateCard(id, { status: 'CANCELLED' });
      queryClient.invalidateQueries({ queryKey: ['cards'] });
    } catch (err) {
      console.error(err);
    }
  };

  const getTimeLeft = (expiresAt?: string, createdAt?: string) => {
    if (!expiresAt) {
      // Fallback for older mock cards without expiresAt: assume 24 hours from creation
      if (createdAt) {
        expiresAt = new Date(new Date(createdAt).getTime() + 24 * 3600 * 1000).toISOString();
      } else {
        return 'Unknown time left';
      }
    }
    
    const diff = new Date(expiresAt).getTime() - Date.now();
    if (diff <= 0 || isNaN(diff)) return 'Expired';
    const hours = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    return `${hours}h ${mins}m left`;
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 border-red-500/20 bg-gradient-to-br from-card to-red-950/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Flame size={120} />
        </div>
        <div className="relative z-10">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
            <Flame className="text-red-500" />
            Burn Mode Cards
          </h2>
          <p className="text-sm text-gray-400 mb-6 max-w-lg">
            Create temporary virtual cards that self-destruct after a set time, or lock them to a specific merchant. Perfect for free trials or sketchy websites!
          </p>

          <form onSubmit={handleCreateBurner} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-black/20 p-4 rounded-xl border border-white/5">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Duration (Hours)</label>
              <select 
                className="w-full bg-card border border-white/10 rounded-md p-2 text-white text-sm focus:outline-none focus:border-primary"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              >
                <option value="1">1 Hour (Quick Trial)</option>
                <option value="24">24 Hours (Daily Use)</option>
                <option value="168">7 Days (Weekly Trial)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Merchant Lock (Optional)</label>
              <Input 
                placeholder="e.g. Netflix, Amazon" 
                value={merchant}
                onChange={e => setMerchant(e.target.value)}
                className="h-[38px]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Spend Limit ($)</label>
              <Input 
                type="number"
                placeholder="e.g. 50" 
                value={limit}
                onChange={e => setLimit(e.target.value)}
                className="h-[38px]"
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" disabled={isCreating} className="w-full h-[38px] bg-red-600 hover:bg-red-700 text-white border-none">
                {isCreating ? <Spinner size="sm" className="mr-2" /> : <Flame className="w-4 h-4 mr-2" />}
                Generate Burner
              </Button>
            </div>
          </form>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white mb-2">Active Burner Cards</h3>
            {burnerCards.length === 0 ? (
              <div className="text-center py-6 text-gray-500 text-sm border border-dashed border-white/10 rounded-xl">
                No active burner cards.
              </div>
            ) : (
              burnerCards.map(card => {
                const isExpired = card.expiresAt && new Date(card.expiresAt).getTime() < Date.now();
                const isCancelled = card.status === 'CANCELLED';
                const inactive = isExpired || isCancelled;

                return (
                  <div key={card.id} className={`flex flex-col p-4 rounded-xl border ${inactive ? 'bg-card/50 border-white/5 opacity-50' : 'bg-card border-red-500/20 hover:border-red-500/40 transition-colors'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${inactive ? 'bg-gray-800 text-gray-500' : 'bg-red-500/10 text-red-500'}`}>
                          {inactive ? <Lock size={18} /> : <Flame size={18} />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-white font-mono">
                              {revealedCards[card.id] ? card.cardNumber : maskCardNumber(card.cardNumber)}
                            </p>
                            {!inactive && (
                              <button 
                                onClick={() => setRevealedCards(prev => ({...prev, [card.id]: !prev[card.id]}))}
                                className="text-xs text-gray-400 hover:text-white"
                              >
                                {revealedCards[card.id] ? 'Hide' : 'Show'}
                              </button>
                            )}
                            {card.merchantLocked && (
                              <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-gray-300 flex items-center gap-1">
                                <Lock size={10} /> {card.merchantLocked}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            {inactive ? (isCancelled ? 'Cancelled' : 'Expired') : (
                              <span className="flex items-center gap-1 text-amber-400">
                                <Clock size={12} /> {getTimeLeft(card.expiresAt, card.createdAt)}
                                {card.dailyLimit !== 50000 && ` • Limit: $${card.dailyLimit}`}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      
                      {!inactive && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          onClick={() => handleCancelBurner(card.id)}
                        >
                          <Trash2 size={16} className="mr-2" />
                          Burn Now
                        </Button>
                      )}
                    </div>
                    {revealedCards[card.id] && !inactive && (
                      <div className="mt-4 pt-3 border-t border-white/5 flex gap-6 text-sm text-gray-400 font-mono">
                        <div><span className="text-gray-500 text-xs">CVV:</span> {card.cvv || '***'}</div>
                        <div><span className="text-gray-500 text-xs">EXP:</span> {card.expiry || `${String(card.expiryMonth).padStart(2,'0')}/${card.expiryYear}`}</div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
