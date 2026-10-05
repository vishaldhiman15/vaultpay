import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldAlert, Key } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { api } from '@/services/api';

export function RecoveryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRecover = async () => {
    if (pin.length < 4) {
      setError('PIN must be at least 4 digits');
      return;
    }
    setError('');
    
    try {
      await api.unlockEmergency(id || '', pin);
      const userData = await api.getUser();
      localStorage.setItem('vaultpay_user', JSON.stringify(userData));
      
      setSuccess(true);
      setTimeout(() => {
        window.location.href = '/emergency';
      }, 2000);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Invalid PIN or Recovery URL');
      setPin('');
    }
  };

  if (success) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-background">
        <ShieldAlert className="h-16 w-16 text-green-500 mb-4 animate-bounce" />
        <h1 className="text-2xl font-bold text-white">Emergency Access Granted</h1>
        <p className="text-gray-400 mt-2">Redirecting to your secure Emergency Wallet...</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="max-w-md w-full bg-card p-8 rounded-2xl border border-white/10 shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-red-500/10 rounded-full">
            <ShieldAlert className="h-10 w-10 text-red-500" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white text-center mb-2">Emergency Recovery</h1>
        <p className="text-sm text-gray-400 text-center mb-8">
          You are attempting to access Emergency Mode using recovery link <span className="font-mono text-primary">{id}</span>.
        </p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Enter Secondary PIN</label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                type="password"
                maxLength={6}
                value={pin}
                onChange={e => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-center tracking-[1em] font-mono focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                placeholder="••••"
              />
            </div>
            {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
          </div>

          <Button 
            variant="danger" 
            className="w-full py-6 text-lg font-bold tracking-wider"
            onClick={handleRecover}
          >
            UNLOCK EMERGENCY WALLET
          </Button>
        </div>
      </div>
    </div>
  );
}
