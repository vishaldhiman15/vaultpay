import React, { useState } from 'react';
import { useAccounts } from '@/hooks/useAccounts';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency, maskAccountNumber } from '@/lib/utils';
import { Plus, Wallet, PiggyBank, ShieldAlert, Download, FileText } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';

export function AccountsPage() {
  const { data: accounts = [], isLoading } = useAccounts();
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

  const handleOpenAccount = () => {
    alert("Your request for a new Savings Account has been submitted and is pending KYC verification.");
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'CHECKING': return Wallet;
      case 'SAVINGS': return PiggyBank;
      case 'EMERGENCY': return ShieldAlert;
      default: return Wallet;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Accounts</h1>
          <p className="text-gray-400 mt-1">Manage your checking, savings, and emergency accounts.</p>
        </div>
        <Button onClick={handleOpenAccount}>
          <Plus className="h-4 w-4 mr-2" />
          Open New Account
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4 animate-slide-up stagger-1">
          {isLoading ? (
            <div className="h-40 bg-white/5 rounded-xl animate-pulse"></div>
          ) : (
            accounts.map((account) => {
              const Icon = getIcon(account.type);
              return (
                <Card 
                  key={account.id} 
                  className={`p-6 cursor-pointer transition-all hover:bg-white/5 ${selectedAccount === account.id ? 'border-primary ring-1 ring-primary/50' : ''}`}
                  onClick={() => setSelectedAccount(account.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-black/20 rounded-xl">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white capitalize">{account.type.toLowerCase()} Account</h3>
                        <p className="text-sm text-gray-400 font-mono mt-1">{maskAccountNumber(account.accountNumber)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-white">{formatCurrency(account.balance)}</p>
                      <div className="mt-2">
                        <StatusBadge status={account.status} />
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })
          )}
        </div>

        <div className="space-y-6 animate-slide-up stagger-2">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Account Services</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 rounded-lg bg-black/20 hover:bg-white/10 transition-colors text-white">
                <div className="flex items-center gap-3">
                  <Download className="h-5 w-5 text-gray-400" />
                  <span>Download Statement</span>
                </div>
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-lg bg-black/20 hover:bg-white/10 transition-colors text-white">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <span>Tax Certificates</span>
                </div>
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
