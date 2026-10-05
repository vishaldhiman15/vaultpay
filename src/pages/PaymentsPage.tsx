import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/Card';
import { Tabs } from '@/components/ui/Tabs';
import { TransferForm } from '@/components/payments/TransferForm';
import { UpiIntentButton } from '@/components/payments/UpiIntentButton';
import { DynamicQrDisplay } from '@/components/payments/DynamicQrDisplay';
import { VpaCollectForm } from '@/components/payments/VpaCollectForm';
import { PendingRequests } from '@/components/payments/PendingRequests';
import { useAccounts } from '@/hooks/useAccounts';
import { useState } from 'react';
import { api } from '@/services/api';

export function PaymentsPage() {
  const { user } = useAuth();
  const { data: accounts } = useAccounts();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'send';
  
  const [upiIntentVpa, setUpiIntentVpa] = useState(searchParams.get('pa') || '');
  const [upiIntentAmount, setUpiIntentAmount] = useState(searchParams.get('am') || '');
  const [upiIntentNote, setUpiIntentNote] = useState(searchParams.get('pn') || '');
  const [upiIntentPin, setUpiIntentPin] = useState('');
  const [intentError, setIntentError] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const primaryAccount = accounts?.find(a => a.type === 'CHECKING' || a.type === 'SAVINGS');

  const validateIntent = () => {
    setIntentError('');
    if (!upiIntentVpa || !upiIntentAmount || !upiIntentPin) {
      setIntentError('Please fill all required fields including PIN');
      return false;
    }
    const amt = Number(upiIntentAmount);
    if (primaryAccount && amt > primaryAccount.balance) {
      setIntentError('Insufficient balance in your primary account');
      return false;
    }
    return true;
  };

  const upiTabs = [
    {
      id: 'send',
      label: 'Send (UPI Intent)',
      content: (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Pay via UPI App</h3>
          <p className="text-sm text-gray-400 mb-6">Enter details and select your preferred UPI app on your device to complete the payment.</p>
          <div className="space-y-4 max-w-sm">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Payee VPA</label>
              <input 
                type="text" 
                value={upiIntentVpa}
                onChange={e => { setUpiIntentVpa(e.target.value); setIntentError(''); }}
                className="w-full bg-black/20 border border-white/10 rounded-md p-2 text-white focus:outline-none focus:border-primary" 
                placeholder="e.g. friend@upi" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Amount (INR)</label>
              <input 
                type="number" 
                value={upiIntentAmount}
                onChange={e => { setUpiIntentAmount(e.target.value); setIntentError(''); }}
                className="w-full bg-black/20 border border-white/10 rounded-md p-2 text-white focus:outline-none focus:border-primary" 
                placeholder="0.00" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Message (Optional)</label>
              <input 
                type="text" 
                value={upiIntentNote}
                onChange={e => setUpiIntentNote(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-md p-2 text-white focus:outline-none focus:border-primary" 
                placeholder="What is this for?" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Security PIN</label>
              <input 
                type="password" 
                maxLength={6}
                value={upiIntentPin}
                onChange={e => { setUpiIntentPin(e.target.value); setIntentError(''); }}
                className="w-full bg-black/20 border border-white/10 rounded-md p-2 text-white focus:outline-none focus:border-primary text-center tracking-widest font-mono" 
                placeholder="••••" 
              />
            </div>
            {intentError && <p className="text-red-400 text-sm">{intentError}</p>}
            <div className="pt-4" onClick={(e) => {
              if (!validateIntent()) {
                e.preventDefault();
                e.stopPropagation();
              }
            }}>
              <UpiIntentButton 
                vpa={upiIntentVpa || 'merchant@upi'} 
                amount={upiIntentAmount || '0'} 
                note={upiIntentNote} 
                pin={upiIntentPin} 
              />
            </div>
          </div>
        </Card>
      )
    },
    {
      id: 'qr',
      label: 'Scan & Pay (QR)',
      content: (
        <div className="max-w-md mx-auto space-y-6">
          <Card className="p-6 bg-black/40 border border-primary/20 text-center">
            <h3 className="text-lg font-semibold text-white mb-2">Scan to Pay</h3>
            <p className="text-sm text-gray-400 mb-4">Use your device camera to scan any UPI QR code.</p>
            <button 
              onClick={async () => {
                setIsScanning(true);
                try {
                  const intent = await api.scanQrIntent();
                  if (intent) {
                    setTimeout(() => {
                      window.location.href = `/payments?tab=send&pa=${encodeURIComponent(intent.payeeVpa)}&pn=${encodeURIComponent(intent.payeeName)}&am=${intent.amount}`;
                    }, 1000);
                  }
                } catch (err) {
                  alert('No active QR code found in database. Try viewing the QR tab on another device!');
                  setIsScanning(false);
                }
              }}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2"
              disabled={isScanning}
            >
              {isScanning ? (
                <div className="animate-pulse flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Scanning...
                </div>
              ) : (
                'Open Camera / Mock Scan'
              )}
            </button>
          </Card>
          <DynamicQrDisplay vpa={user?.vpa || 'merchant@vaultpay'} amount="2500" payeeName={user?.name} />
        </div>
      )
    },
    {
      id: 'collect',
      label: 'Collect Request',
      content: (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Request Money via UPI</h3>
          <p className="text-sm text-gray-400 mb-6">Send a collect request to any UPI ID. The user will receive a notification to approve the payment.</p>
          <VpaCollectForm />
        </Card>
      )
    },
    {
      id: 'requests',
      label: 'Pending Requests',
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Action Required</h3>
          <p className="text-sm text-gray-400">Review and approve money requests sent to you.</p>
          <PendingRequests />
        </div>
      )
    },
    {
      id: 'bank',
      label: 'Bank Transfer',
      content: (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">NEFT / IMPS Transfer</h3>
          <TransferForm />
        </Card>
      )
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-white tracking-tight">Payments & Transfers</h1>
        <p className="text-gray-400 mt-1">Send money, request payments, or generate QR codes.</p>
      </div>

      <div className="animate-slide-up stagger-1">
        <Tabs tabs={upiTabs} defaultTab={defaultTab} />
      </div>
    </div>
  );
}
