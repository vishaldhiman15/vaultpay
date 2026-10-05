import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Spinner } from '../ui/Spinner';
import { api } from '@/services/api';
import { CheckCircle2 } from 'lucide-react';
import { useAccounts } from '@/hooks/useAccounts';

export function TransferForm() {
  const { data: accounts } = useAccounts();
  const primaryAccount = accounts?.find(a => a.type === 'CHECKING' || a.type === 'SAVINGS');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('INTERNAL');
  const [pin, setPin] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    if (type !== 'INTERNAL' && (!accountNumber || !ifsc)) return;
    if (type === 'INTERNAL' && !accountNumber) return;
    
    if (primaryAccount && Number(amount) > primaryAccount.balance) {
      setError('Insufficient balance in your primary account.');
      return;
    }

    if (pin.length < 4 || pin.length > 6) {
      setError('Invalid PIN. Must be 4 to 6 digits.');
      return;
    }
    setError('');

    setStatus('loading');
    try {
      await api.initiateTransfer({
        amount: Number(amount),
        to: accountNumber,
        type,
        description: message || `Bank Transfer - ${type}`,
        pin
      });
      setStatus('success');
    } catch (error: any) {
      console.error(error);
      setError(error.response?.data?.error || 'Transfer failed');
      setStatus('idle');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center animate-scale-in">
        <CheckCircle2 className="h-16 w-16 text-emerald-500 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Transfer Successful</h3>
        <p className="text-gray-400 mb-6">Your {type} transfer of ₹{amount} has been initiated successfully.</p>
        <Button variant="outline" onClick={() => { setStatus('idle'); setAccountNumber(''); setIfsc(''); setAmount(''); }}>
          Make Another Transfer
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-slide-up">
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">Transfer Type</label>
        <div className="flex bg-black/40 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setType('INTERNAL')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${type === 'INTERNAL' ? 'bg-card text-white shadow' : 'text-gray-400 hover:text-white'}`}
          >
            VaultPay (Free)
          </button>
          <button
            type="button"
            onClick={() => setType('IMPS')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${type === 'IMPS' ? 'bg-card text-white shadow' : 'text-gray-400 hover:text-white'}`}
          >
            IMPS (Bank)
          </button>
          <button
            type="button"
            onClick={() => setType('NEFT')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${type === 'NEFT' ? 'bg-card text-white shadow' : 'text-gray-400 hover:text-white'}`}
          >
            NEFT (Bank)
          </button>
        </div>
      </div>
      
      {type === 'INTERNAL' ? (
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Payee VPA or Email</label>
          <Input 
            placeholder="e.g. rahul@vaultpay" 
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            required
          />
        </div>
      ) : (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Account Number</label>
            <Input 
              placeholder="Beneficiary Account Number" 
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">IFSC Code</label>
            <Input 
              placeholder="e.g. HDFC0001234" 
              value={ifsc}
              onChange={(e) => setIfsc(e.target.value.toUpperCase())}
              required
              maxLength={11}
            />
          </div>
        </>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">Amount (INR)</label>
        <div className="relative">
          <span className="absolute left-3 top-2 text-gray-500">₹</span>
          <Input 
            type="number" 
            className="pl-8" 
            placeholder="0.00" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="1"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">Message (Optional)</label>
        <Input 
          placeholder="What is this for?" 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">Security PIN</label>
        <Input 
          type="password" 
          placeholder="••••" 
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          required
          maxLength={6}
          className="text-center tracking-[1em] font-mono text-xl"
        />
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}
      <Button 
        type="submit" 
        className="w-full mt-6" 
        size="lg"
        disabled={status === 'loading' || !accountNumber || !amount || !pin || (type !== 'INTERNAL' && !ifsc)}
      >
        {status === 'loading' ? <Spinner size="sm" className="mr-2 text-white" /> : null}
        {status === 'loading' ? 'Processing...' : 'Send Money'}
      </Button>
    </form>
  );
}
