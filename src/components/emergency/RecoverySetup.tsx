import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ShieldCheck, Copy, CheckCircle2 } from 'lucide-react';
import { EmergencyMode } from '@/types';
import { api } from '@/services/api';

interface RecoverySetupProps {
  status: EmergencyMode;
}

export function RecoverySetup({ status }: RecoverySetupProps) {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [alias, setAlias] = useState('');
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState('');

  const handleCopy = () => {
    if (status.recoveryUrl) {
      navigator.clipboard.writeText(status.recoveryUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (pin !== confirmPin || pin.length < 4 || !alias) return;
    setIsSettingUp(true);
    try {
      await api.setupEmergency(alias, pin);
      window.location.reload(); 
    } catch (err: any) {
      console.error("Full setup error:", err);
      let errMsg = err.response?.data?.error;
      if (!errMsg) {
        errMsg = err.message || 'Unknown network error occurred.';
      }
      setError(`Error: ${errMsg}`);
    } finally {
      setIsSettingUp(false);
    }
  };

  if (status.secondaryPinSet) {
    return (
      <Card className="p-6 border-emerald-500/30">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-emerald-500/20 text-emerald-500">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white">Recovery Configured</h3>
            <p className="text-sm text-gray-400 mt-1">Your secondary PIN is active. Keep this URL safe to access your emergency wallet if your primary device is lost.</p>
            
            <div className="mt-4 flex items-center gap-2">
              <a 
                href={`http://${status.recoveryUrl}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 bg-black/40 p-2 rounded-lg text-sm text-emerald-400 font-mono overflow-x-auto hover:text-emerald-300 hover:underline cursor-pointer"
              >
                {status.recoveryUrl}
              </a>
              <Button variant="outline" size="icon" onClick={handleCopy}>
                {isCopied ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            
            <div className="mt-6 flex gap-3">
              <Button variant="outline" className="text-sm">Change PIN</Button>
              <Button variant="danger" className="text-sm">Disable Recovery</Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-white mb-2">Setup Recovery Access</h3>
      <p className="text-sm text-gray-400 mb-6">Create a secondary PIN to access your emergency wallet from any device using a special recovery link.</p>
      
      <form onSubmit={handleSetup} className="space-y-4 max-w-sm">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Custom Alias</label>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <span className="hidden sm:inline-block bg-white/5 border border-white/10 border-r-0 rounded-l-md px-3 py-2 text-gray-500 text-sm whitespace-nowrap">
              localhost:5173/recover/
            </span>
            <div className="flex w-full">
              <span className="sm:hidden bg-white/5 border border-white/10 border-r-0 rounded-l-md px-3 py-2 text-gray-500 text-sm whitespace-nowrap">
                /recover/
              </span>
              <Input 
                type="text" 
                placeholder="e.g. secret-vault-88"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                className="rounded-l-none w-full"
                required
              />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Secondary PIN (4-6 digits)</label>
          <Input 
            type="password" 
            maxLength={6}
            pattern="[0-9]*"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Confirm PIN</label>
          <Input 
            type="password" 
            maxLength={6}
            pattern="[0-9]*"
            value={confirmPin}
            onChange={(e) => setConfirmPin(e.target.value)}
            required
          />
        </div>
        {pin && confirmPin && pin !== confirmPin && (
          <p className="text-xs text-red-400">PINs do not match.</p>
        )}
        {error && <p className="text-sm text-red-400">{error}</p>}
        <Button 
          type="submit" 
          className="w-full mt-2"
          disabled={!pin || pin !== confirmPin || isSettingUp}
        >
          {isSettingUp ? 'Configuring...' : 'Enable Recovery'}
        </Button>
      </form>
    </Card>
  );
}
