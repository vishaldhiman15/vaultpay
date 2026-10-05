import React from 'react';
import { Card } from '../ui/Card';
import { Account } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { ShieldAlert, AlertTriangle, ArrowRight, Send } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { api } from '@/services/api';
import { useTransactions } from '@/hooks/useAccounts';
import { useQueryClient } from '@tanstack/react-query';

interface EmergencyWalletProps {
  account: Account;
  onDeactivate: () => void;
}

export function EmergencyWallet({ account, onDeactivate }: EmergencyWalletProps) {
  const queryClient = useQueryClient();
  const { data: transactions = [] } = useTransactions(account.id);
  const [showTransfer, setShowTransfer] = React.useState(false);
  const [showReceive, setShowReceive] = React.useState(false);
  const [payee, setPayee] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [receiveAmount, setReceiveAmount] = React.useState('');
  const [receiveSource, setReceiveSource] = React.useState('');
  const [status, setStatus] = React.useState('');
  const [receiveStatus, setReceiveStatus] = React.useState('');

  const handleEmergencyTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('processing');
    try {
      await api.initiateTransfer({
        amount: Number(amount),
        to: payee,
        type: 'INTERNAL',
        description: 'Emergency Transfer',
        fromAccountId: account.id
      });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      setStatus('success');
      setPayee('');
      setAmount('');
      // wait 2 sec then reset
      setTimeout(() => setStatus(''), 2000);
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus(''), 2000);
    }
  };

  const handleSimulateReceive = async (e: React.FormEvent) => {
    e.preventDefault();
    setReceiveStatus('processing');
    try {
      await api.simulateInbound({
        toAccountId: account.id,
        amount: Number(receiveAmount),
        sourceName: receiveSource || 'External Transfer'
      });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      setReceiveStatus('success');
      setReceiveAmount('');
      setReceiveSource('');
      setTimeout(() => setReceiveStatus(''), 2000);
    } catch (error) {
      setReceiveStatus('error');
      setTimeout(() => setReceiveStatus(''), 2000);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 flex items-start gap-4">
        <ShieldAlert className="h-8 w-8 text-red-500 shrink-0" />
        <div>
          <h2 className="text-xl font-bold text-red-500">Emergency Mode Active</h2>
          <p className="text-gray-300 mt-1">
            Your main accounts and cards have been frozen. Only this emergency wallet is accessible.
          </p>
          <Button variant="outline" className="mt-4 border-red-500/50 text-red-400 hover:bg-red-500/10" onClick={onDeactivate}>
            Deactivate Emergency Mode
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 border-red-500/30 bg-gradient-to-br from-card to-red-900/10">
          <h3 className="text-sm font-medium text-gray-400">Emergency Balance</h3>
          <p className="text-4xl font-bold text-white mt-2">{formatCurrency(account.balance)}</p>
          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-400"><span className="text-gray-500">A/c:</span> {account.accountNumber}</p>
            <p className="text-sm text-gray-400"><span className="text-gray-500">IFSC:</span> {account.ifsc || 'VLTP0000001'}</p>
            <p className="text-sm text-gray-400"><span className="text-gray-500">Emergency UPI VPA:</span> emergency.{account.accountNumber.slice(-4)}@vaultpay</p>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Emergency Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3 text-white">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <span>Contact Support</span>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-500" />
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3 text-white">
                <ShieldAlert className="h-5 w-5 text-red-400" />
                <span>Report Fraud</span>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-500" />
            </button>
            <button 
              onClick={() => { setShowReceive(!showReceive); setShowTransfer(false); }}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-3 text-white">
                <ArrowRight className="h-5 w-5 text-blue-400 rotate-180" />
                <span>Receive Funds</span>
              </div>
              <ArrowRight className={`h-4 w-4 text-gray-500 transition-transform ${showReceive ? 'rotate-90' : ''}`} />
            </button>
            {showReceive && (
              <div className="p-4 bg-black/40 rounded-lg border border-white/5 animate-slide-up text-sm text-gray-300">
                <p className="mb-3">To receive emergency funds, provide the sender with your Emergency VPA or Account Details:</p>
                <div className="space-y-1 mb-4">
                  <p><strong className="text-white">VPA:</strong> emergency.{account.accountNumber.slice(-4)}@vaultpay</p>
                  <p><strong className="text-white">A/c Number:</strong> {account.accountNumber}</p>
                  <p><strong className="text-white">IFSC:</strong> {account.ifsc || 'VLTP0000001'}</p>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                    <Send className="h-4 w-4 rotate-180" /> Simulate Inbound Transfer
                  </h4>
                  <form onSubmit={handleSimulateReceive} className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Source (e.g. My HDFC Account, John Doe)</label>
                      <Input value={receiveSource} onChange={e => setReceiveSource(e.target.value)} placeholder="External Bank" required />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Amount to Add</label>
                      <Input value={receiveAmount} onChange={e => setReceiveAmount(e.target.value)} type="number" required placeholder="0.00" />
                    </div>
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={receiveStatus === 'processing'}>
                      {receiveStatus === 'processing' ? 'Processing...' : receiveStatus === 'success' ? 'Funds Received!' : receiveStatus === 'error' ? 'Failed' : 'Simulate Transfer'}
                    </Button>
                  </form>
                </div>
              </div>
            )}

            <button 
              onClick={() => { setShowTransfer(!showTransfer); setShowReceive(false); }}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-3 text-white">
                <ArrowRight className="h-5 w-5 text-emerald-400" />
                <span>Transfer Funds (Emergency)</span>
              </div>
              <ArrowRight className={`h-4 w-4 text-gray-500 transition-transform ${showTransfer ? 'rotate-90' : ''}`} />
            </button>
            {showTransfer && (
              <form onSubmit={handleEmergencyTransfer} className="p-4 bg-black/40 rounded-lg space-y-4 border border-white/5 animate-slide-up">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Payee VPA or Email</label>
                  <Input value={payee} onChange={e => setPayee(e.target.value)} required placeholder="e.g. friend@vaultpay" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Amount</label>
                  <Input value={amount} onChange={e => setAmount(e.target.value)} type="number" required placeholder="0.00" />
                </div>
                <Button type="submit" className="w-full" disabled={status === 'processing'}>
                  {status === 'processing' ? 'Processing...' : status === 'success' ? 'Sent!' : status === 'error' ? 'Failed' : 'Send Safely'}
                </Button>
              </form>
            )}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Emergency Activity</h3>
        <div className="space-y-4">
          {transactions.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No recent activity on this emergency wallet.</p>
          ) : (
            transactions.slice(0, 5).map((t: any) => (
              <div key={t.id} className="flex justify-between items-center p-3 bg-black/20 rounded-lg border border-white/5">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${t.type === 'CREDIT' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-white/5 text-gray-400'}`}>
                    <ArrowRight className={`h-4 w-4 ${t.type === 'CREDIT' ? 'rotate-90' : '-rotate-45'}`} />
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium">{t.counterpartyName}</p>
                    <p className="text-xs text-gray-500">{new Date(t.timestamp).toLocaleString()}</p>
                  </div>
                </div>
                <div className={`text-sm font-medium ${t.type === 'CREDIT' ? 'text-emerald-400' : 'text-white'}`}>
                  {t.type === 'CREDIT' ? '+' : '-'}{formatCurrency(t.amount)}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
