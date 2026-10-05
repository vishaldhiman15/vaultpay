import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { formatCurrency } from '@/lib/utils';
import { Card } from '../ui/Card';
import { api } from '@/services/api';

interface DynamicQrDisplayProps {
  vpa: string;
  amount: string;
  payeeName?: string;
}

export function DynamicQrDisplay({ vpa, amount: initialAmount, payeeName = 'VaultPay User' }: DynamicQrDisplayProps) {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [currentAmount, setCurrentAmount] = useState(initialAmount);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Sync to MongoDB
  useEffect(() => {
    const saveToDb = async () => {
      try {
        await api.createQrIntent({
          payeeVpa: vpa,
          payeeName,
          amount: currentAmount,
          note: 'QR Payment'
        });
      } catch (err) {
        console.error('Failed to sync QR to DB', err);
      }
    };
    
    // Debounce the save to prevent spamming while typing
    const timeout = setTimeout(saveToDb, 1000);
    return () => clearTimeout(timeout);
  }, [currentAmount, vpa, payeeName]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  // Create a web intent URL so native phone cameras open the VaultPay web app directly
  const webIntentUrl = `${window.location.origin}/payments?tab=send&pa=${encodeURIComponent(vpa)}&pn=${encodeURIComponent(payeeName)}&am=${currentAmount}`;

  return (
    <Card className="flex flex-col items-center justify-center p-8 bg-gradient-to-b from-card to-background border-primary/20">
      <div className="mb-6 text-center w-full">
        <p className="text-sm text-gray-400 mb-2">Scan to pay</p>
        <div className="flex justify-center items-center gap-2 max-w-xs mx-auto">
          <span className="text-2xl text-white font-semibold">₹</span>
          <input
            type="number"
            value={currentAmount}
            onChange={(e) => {
              setCurrentAmount(e.target.value);
              setTimeLeft(300); // Reset timer on amount change
            }}
            className="bg-transparent text-3xl font-bold text-white w-full border-b-2 border-primary/30 focus:border-primary focus:outline-none text-center"
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-xl relative animate-scale-in">
        {timeLeft <= 0 && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl z-10">
            <p className="text-red-500 font-bold mb-2">QR Code Expired</p>
            <button 
              className="text-sm text-primary hover:underline"
              onClick={() => setTimeLeft(300)}
            >
              Generate New
            </button>
          </div>
        )}
        <QRCodeSVG 
          value={webIntentUrl} 
          size={220}
          level="H"
          includeMargin={false}
          fgColor="#0A0E1A"
        />
      </div>

      <div className="mt-8 text-center flex flex-col items-center gap-2">
        <p className="text-sm font-medium text-white bg-black/40 px-4 py-2 rounded-full border border-white/10">
          VPA: <span className="text-primary">{vpa}</span>
        </p>
        <p className={`text-sm mt-2 font-mono ${timeLeft < 60 ? 'text-red-400 animate-pulse' : 'text-gray-400'}`}>
          Expires in {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </p>
      </div>
    </Card>
  );
}
