import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/services/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Smartphone, ShieldCheck, QrCode, Fingerprint } from 'lucide-react';
import { DynamicQrDisplay } from '@/components/payments/DynamicQrDisplay';

export function UpiPage() {
  const { user, getUser } = useAuth();
  
  const [vpa, setVpa] = useState(user?.vpa || '');
  const [vpaStatus, setVpaStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [vpaError, setVpaError] = useState('');

  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinStatus, setPinStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [pinError, setPinError] = useState('');

  const handleUpdateVpa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vpa || !vpa.includes('@')) {
      setVpaError('Invalid VPA format. Must include @');
      return;
    }
    setVpaStatus('loading');
    try {
      await api.setVpa(vpa);
      setVpaStatus('success');
      setVpaError('');
      // Update local user state
      await getUser();
      setTimeout(() => setVpaStatus('idle'), 3000);
    } catch (err: any) {
      setVpaStatus('error');
      setVpaError(err.response?.data?.error || 'VPA is already taken');
    }
  };

  const handleSetPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin !== confirmPin) {
      setPinError('PINs do not match');
      return;
    }
    if (pin.length < 4 || pin.length > 6) {
      setPinError('PIN must be 4 to 6 digits');
      return;
    }
    setPinStatus('loading');
    try {
      await api.setUpiPin(pin);
      setPinStatus('success');
      setPinError('');
      setPin('');
      setConfirmPin('');
      setTimeout(() => setPinStatus('idle'), 3000);
    } catch (err: any) {
      setPinStatus('error');
      setPinError(err.response?.data?.error || 'Failed to set PIN');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-xl">
          <Smartphone className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Classic UPI Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your unique VPA, security PIN, and QR code</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div className="space-y-8">
          <Card className="p-6 border-white/5 bg-gradient-to-br from-card to-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <ShieldCheck className="h-24 w-24" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-emerald-400" />
              Customize VPA (UPI ID)
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              Create a unique VaultPay address to easily receive payments from anyone in India.
            </p>
            <form onSubmit={handleUpdateVpa} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Your VPA</label>
                <Input 
                  value={vpa} 
                  onChange={e => { setVpa(e.target.value.toLowerCase()); setVpaStatus('idle'); }} 
                  placeholder="e.g. name@vaultpay"
                  className="bg-black/50"
                  required
                />
              </div>
              {vpaError && <p className="text-red-400 text-xs">{vpaError}</p>}
              <Button type="submit" disabled={vpaStatus === 'loading' || vpa === user?.vpa} className="w-full">
                {vpaStatus === 'loading' ? 'Checking...' : vpaStatus === 'success' ? 'VPA Updated!' : 'Claim Unique VPA'}
              </Button>
            </form>
          </Card>

          <Card className="p-6 border-white/5 bg-gradient-to-br from-card to-white/5 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
              <Fingerprint className="h-24 w-24" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Fingerprint className="h-5 w-5 text-blue-400" />
              UPI Security PIN
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              Set or reset your 4 to 6 digit UPI PIN. This PIN is required to authorize all outgoing transfers.
            </p>
            <form onSubmit={handleSetPin} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">New PIN</label>
                  <Input 
                    type="password"
                    maxLength={6}
                    value={pin} 
                    onChange={e => { setPin(e.target.value.replace(/\D/g, '')); setPinStatus('idle'); }} 
                    placeholder="****"
                    className="bg-black/50 text-center tracking-widest"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Confirm PIN</label>
                  <Input 
                    type="password"
                    maxLength={6}
                    value={confirmPin} 
                    onChange={e => { setConfirmPin(e.target.value.replace(/\D/g, '')); setPinStatus('idle'); }} 
                    placeholder="****"
                    className="bg-black/50 text-center tracking-widest"
                    required
                  />
                </div>
              </div>
              {pinError && <p className="text-red-400 text-xs">{pinError}</p>}
              <Button type="submit" variant="secondary" disabled={pinStatus === 'loading' || !pin || !confirmPin} className="w-full">
                {pinStatus === 'loading' ? 'Saving...' : pinStatus === 'success' ? 'PIN Set Securely!' : 'Set UPI PIN'}
              </Button>
            </form>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="p-6 border-primary/20 bg-primary/5 flex flex-col items-center text-center">
            <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
              <QrCode className="h-5 w-5 text-primary" />
              Your Personal QR
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              Show this to anyone to instantly receive payments to {user?.vpa || 'your VPA'}.
            </p>
            
            <div className="bg-white p-4 rounded-2xl w-full max-w-[280px]">
              <DynamicQrDisplay 
                vpa={user?.vpa || 'setup@vaultpay'} 
                amount="" 
                payeeName={user?.name} 
              />
            </div>
            
          </Card>
        </div>

      </div>
    </div>
  );
}
