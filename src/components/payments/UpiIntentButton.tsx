import React, { useState } from 'react';
import { Smartphone, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { api } from '@/services/api';

interface UpiIntentButtonProps {
  vpa: string;
  amount: string;
  note: string;
  pin: string;
  payeeName?: string;
}

export function UpiIntentButton({ vpa, amount, note, pin, payeeName = 'VaultPay User' }: UpiIntentButtonProps) {
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  const handleIntent = async () => {
    // Clean the VPA
    const cleanVpa = vpa.replace(/\s+/g, '');
    
    if (!pin || pin.length < 4 || pin.length > 6) {
      alert("Invalid Security PIN");
      return;
    }

    setStatus('processing');
    try {
      // Because this is a demo, we will process this "UPI" payment internally using VaultPay's ledger
      await api.initiateTransfer({
        amount: Number(amount),
        to: cleanVpa,
        type: 'UPI_INTENT',
        description: note || 'UPI Payment',
        pin
      });
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error(error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  if (status === 'success') {
    return (
      <div className="w-full bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 text-emerald-400 flex flex-col items-center justify-center animate-fade-in">
        <CheckCircle2 className="h-6 w-6 mb-2" />
        <span className="font-medium text-sm">UPI Payment Successful!</span>
      </div>
    );
  }

  return (
    <Button 
      onClick={handleIntent}
      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/25 border-0"
      size="lg"
      disabled={!vpa || !amount || Number(amount) <= 0 || !pin || status === 'processing'}
    >
      <Smartphone className="mr-2 h-5 w-5" />
      {status === 'processing' ? 'Processing...' : status === 'error' ? 'Payment Failed' : 'Pay via VaultPay UPI'}
    </Button>
  );
}
