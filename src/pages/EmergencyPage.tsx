import React, { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { useAccounts } from '@/hooks/useAccounts';
import { EmergencyMode } from '@/types';
import { RecoverySetup } from '@/components/emergency/RecoverySetup';
import { EmergencyWallet } from '@/components/emergency/EmergencyWallet';
import { ShieldAlert, AlertTriangle, Lock, Unlock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function EmergencyPage() {
  const [status, setStatus] = useState<EmergencyMode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: accounts = [], refetch } = useAccounts();

  // Deactivation state
  const [showDeactivate, setShowDeactivate] = useState(false);
  const [deactivatePin, setDeactivatePin] = useState('');
  const [deactivateError, setDeactivateError] = useState('');
  const [isDeactivating, setIsDeactivating] = useState(false);

  const emergencyAccount = accounts.find(a => a.type === 'EMERGENCY');

  useEffect(() => {
    const fetchStatus = async () => {
      const data = await api.getEmergencyStatus();
      setStatus(data);
      setIsLoading(false);
    };
    fetchStatus();
  }, []);

  const handleActivate = async () => {
    if (window.confirm("⚠️ WARNING: This will freeze ALL your main accounts and cards immediately. Only your Emergency Wallet will remain accessible.\n\nAre you absolutely sure?")) {
      setIsLoading(true);
      const newStatus = await api.activateEmergencyMode();
      setStatus(newStatus);
      await refetch();
      setIsLoading(false);
    }
  };

  const handleDeactivate = async () => {
    if (!deactivatePin) return;
    setDeactivateError('');
    setIsDeactivating(true);
    try {
      const newStatus = await api.deactivateEmergencyMode(deactivatePin);
      setStatus(newStatus);
      await refetch();
      setShowDeactivate(false);
      setDeactivatePin('');
    } catch (err: any) {
      setDeactivateError(err.response?.data?.error || 'Failed to deactivate. Check your PIN.');
    } finally {
      setIsDeactivating(false);
    }
  };

  if (isLoading) {
    return <div className="animate-pulse h-32 bg-white/5 rounded-xl max-w-4xl mx-auto mt-8"></div>;
  }

  if (!status) return null;

  if (status.active && emergencyAccount) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <EmergencyWallet account={emergencyAccount} onDeactivate={() => setShowDeactivate(true)} />

        {/* Deactivation Modal */}
        {showDeactivate && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl border border-white/10 overflow-hidden animate-slide-up">
              <div className="p-6 bg-gradient-to-b from-green-500/10 to-transparent border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Unlock className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Deactivate Emergency Mode</h2>
                    <p className="text-sm text-gray-400">Enter your secondary PIN to restore full access</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-yellow-400">
                    This will unfreeze all your main accounts and cards. Make sure it is safe to do so before proceeding.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Secondary PIN</label>
                  <Input
                    type="password"
                    placeholder="Enter your secondary PIN"
                    value={deactivatePin}
                    onChange={(e) => setDeactivatePin(e.target.value)}
                    maxLength={6}
                  />
                </div>

                {deactivateError && (
                  <p className="text-sm text-red-400">{deactivateError}</p>
                )}
              </div>

              <div className="p-4 bg-white/5 border-t border-white/10 flex justify-end gap-3">
                <Button variant="ghost" onClick={() => { setShowDeactivate(false); setDeactivatePin(''); setDeactivateError(''); }}>
                  Cancel
                </Button>
                <Button
                  onClick={handleDeactivate}
                  disabled={!deactivatePin || isDeactivating}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {isDeactivating ? 'Verifying...' : 'Confirm Deactivation'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <ShieldAlert className="h-8 w-8 text-red-500" />
          Emergency Protocol
        </h1>
        <p className="text-gray-400 mt-2 max-w-2xl">
          If your device is lost or you suspect fraud, you can activate Emergency Mode. This will instantly freeze all your main accounts and cards, leaving only your Emergency Wallet accessible via a secondary PIN.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-slide-up stagger-1">
        <div className="space-y-6">
          <RecoverySetup status={status} />
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-xl border border-red-500/20 bg-red-500/5 flex flex-col items-center justify-center text-center h-full">
            <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Panic Button</h3>
            <p className="text-sm text-gray-400 mb-6">
              Instantly lock down your entire financial profile. Only use this in true emergencies.
            </p>
            <Button 
              variant="danger" 
              size="lg" 
              className="w-full font-bold tracking-wider"
              onClick={handleActivate}
              disabled={!status.secondaryPinSet}
            >
              ACTIVATE EMERGENCY MODE
            </Button>
            {!status.secondaryPinSet && (
              <p className="text-xs text-red-400 mt-3">You must configure a secondary PIN first.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
