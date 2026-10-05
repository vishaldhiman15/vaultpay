import React, { useState } from 'react';
import { Card as CardType } from '@/types';
import { Wifi, Copy, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface VirtualCardDisplayProps {
  card: CardType | any; // allow mocked cards
}

export function VirtualCardDisplay({ card }: VirtualCardDisplayProps) {
  const { user } = useAuth();
  const [showDetails, setShowDetails] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const displayCardNumber = showDetails 
    ? card.cardNumber.replace(/(.{4})/g, '$1 ').trim()
    : `•••• •••• •••• ${card.cardNumber.slice(-4)}`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    // would show a toast here in real app
  };

  return (
    <div className="card-3d w-[400px] h-[250px] mx-auto cursor-pointer perspective-1000" onClick={() => setIsFlipped(!isFlipped)}>
      <div className={`card-3d-inner w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        
        {/* Front */}
        <div className="card-3d-front absolute w-full h-full backface-hidden rounded-2xl p-6 bg-gradient-to-tr from-gray-900 via-primary/80 to-accent shadow-2xl flex flex-col justify-between overflow-hidden border border-white/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          
          <div className="flex justify-between items-start relative z-10">
            <div className="text-white font-bold text-xl tracking-widest">VaultPay</div>
            <div className="flex gap-2 text-white/80">
              {card.contactlessEnabled && <Wifi className="h-6 w-6 rotate-90" />}
            </div>
          </div>

          <div className="relative z-10 mt-8">
            <div className="flex items-center gap-4">
              <p className="text-white text-2xl font-mono tracking-widest">{displayCardNumber}</p>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowDetails(!showDetails); }}
                className="text-white/50 hover:text-white transition-colors"
              >
                {showDetails ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            
            <div className="flex justify-between mt-6 text-white/80">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider opacity-70">Cardholder</span>
                <span className="font-medium tracking-wide">{card.nameOnCard || user?.name?.toUpperCase() || 'VAULTPAY USER'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider opacity-70">Valid Thru</span>
                <span className="font-medium tracking-wide font-mono">
                  {card.expiry ? card.expiry : `${String(card.expiryMonth).padStart(2, '0')}/${card.expiryYear}`}
                </span>
              </div>
              <div className="flex flex-col items-end justify-center">
                <div className="text-xl font-bold italic tracking-tighter">VISA</div>
              </div>
            </div>
          </div>
        </div>

        {/* Back */}
        <div className="card-3d-back absolute w-full h-full backface-hidden rounded-2xl bg-gradient-to-bl from-gray-800 to-black shadow-2xl rotate-y-180 border border-white/20 flex flex-col">
          <div className="w-full h-12 bg-black mt-6"></div>
          <div className="px-6 flex flex-col mt-4 gap-2">
            <div className="flex justify-end w-full">
              <div className="bg-white text-black h-8 w-2/3 flex items-center justify-end px-3 font-mono text-sm relative">
                <div className="absolute left-0 w-full h-full bg-repeating-linear-gradient-45 from-transparent to-transparent via-gray-300/20 bg-[length:10px_10px]"></div>
                <span className="relative z-10 flex items-center gap-2">
                  <span className="text-xs text-gray-500">CVV</span> 
                  {showDetails ? card.cvv : '•••'}
                </span>
              </div>
            </div>
            <p className="text-white/40 text-[8px] mt-4 leading-tight">
              This card is issued by VaultPay Bank pursuant to a license from Visa U.S.A. Inc. Use of this card is subject to the terms and conditions of the VaultPay Cardholder Agreement. If found, please return to VaultPay Bank.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
