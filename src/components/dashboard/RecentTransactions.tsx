import React from 'react';
import { Card } from '../ui/Card';
import { Transaction } from '@/types';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';

interface RecentTransactionsProps {
  transactions: Transaction[];
  isLoading: boolean;
}

export function RecentTransactions({ transactions, isLoading }: RecentTransactionsProps) {
  if (isLoading) {
    return (
      <Card className="p-6 h-[400px] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <Clock className="h-8 w-8 text-gray-500 opacity-50" />
          <p className="text-gray-500">Loading transactions...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-0 overflow-hidden flex flex-col h-[400px]">
      <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/20">
        <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
        <button className="text-sm text-primary hover:text-primary/80 transition-colors">View All</button>
      </div>
      <div className="overflow-y-auto flex-1 p-2">
        {transactions.length === 0 ? (
          <div className="flex h-full items-center justify-center text-gray-500">
            No transactions found.
          </div>
        ) : (
          <div className="space-y-1">
            {transactions.slice(0, 10).map((txn, i) => (
              <div 
                key={txn.id} 
                className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors animate-slide-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    txn.type === 'CREDIT' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                  }`}>
                    {txn.type === 'CREDIT' ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{txn.description}</p>
                    <p className="text-xs text-gray-500">{formatDateTime(txn.timestamp)}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-sm font-semibold ${
                    txn.type === 'CREDIT' ? 'text-emerald-400' : 'text-white'
                  }`}>
                    {txn.type === 'CREDIT' ? '+' : '-'}{formatCurrency(txn.amount)}
                  </span>
                  <StatusBadge status={txn.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
