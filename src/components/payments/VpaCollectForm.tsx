import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Spinner } from '../ui/Spinner';
import { CheckCircle2, Clock } from 'lucide-react';
import { api } from '@/services/api';

export function VpaCollectForm() {
  const [vpa, setVpa] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'pending'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vpa || !amount) return;

    setStatus('loading');
    try {
      await api.client.post('/upi/collect', { vpa, amount: Number(amount) });
      setStatus('pending');
    } catch (error) {
      console.error(error);
      alert('Failed to send request. Ensure the VPA exists.');
      setStatus('idle');
    }
  };

  if (status === 'pending') {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
          <Clock className="h-16 w-16 text-primary relative z-10 animate-bounce" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Request Sent Successfully</h3>
        <p className="text-gray-400 mb-6 max-w-sm">
          A collect request for ₹{amount} has been sent to {vpa}. Waiting for the user to approve the payment on their UPI app.
        </p>
        <Button variant="outline" onClick={() => { setStatus('idle'); setVpa(''); setAmount(''); setNote(''); }}>
          Send Another Request
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-slide-up">
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">Payer VPA (UPI ID)</label>
        <Input 
          placeholder="e.g. rahul@okicici" 
          value={vpa}
          onChange={(e) => setVpa(e.target.value)}
          required
        />
      </div>
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
        <label className="block text-sm font-medium text-gray-400 mb-1">Note (Optional)</label>
        <Input 
          placeholder="What is this for?" 
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>
      <Button 
        type="submit" 
        className="w-full mt-6" 
        size="lg"
        disabled={status === 'loading' || !vpa || !amount}
      >
        {status === 'loading' ? <Spinner size="sm" className="mr-2 text-white" /> : null}
        {status === 'loading' ? 'Sending Request...' : 'Request Money'}
      </Button>
    </form>
  );
}
