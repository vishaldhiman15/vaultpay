import React, { useState } from 'react';
import { BalanceCard } from '@/components/dashboard/BalanceCard';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { SpendingChart } from '@/components/dashboard/SpendingChart';
import { RewardsWidget } from '@/components/dashboard/RewardsWidget';
import { AIInsights } from '@/components/dashboard/AIInsights';
import { TimeTravelSlider } from '@/components/dashboard/TimeTravelSlider';
import { useAuth } from '@/hooks/useAuth';
import { useAccounts, useTransactions } from '@/hooks/useAccounts';
import { Spinner } from '@/components/ui/Spinner';

export function DashboardPage() {
  const { user } = useAuth();
  const { data: accounts, isLoading: accountsLoading } = useAccounts();
  const { data: transactions = [], isLoading: transactionsLoading } = useTransactions();
  const [timeOffset, setTimeOffset] = useState(0);

  if (accountsLoading) {
    return <div className="flex justify-center p-12"><Spinner size="lg" /></div>;
  }

  const primaryAccount = accounts?.[0];
  
  // Projection logic: Assume a net positive cashflow of 25,000 INR per month
  const projectedBalance = primaryAccount ? primaryAccount.balance + (timeOffset * 25000) : 0;
  // If time travel is active, we mock a higher trend
  const projectedTrend = timeOffset > 0 ? 15 + (timeOffset * 2) : 5.2;

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">Good morning, {user?.name?.split(' ')[0]}</h1>
        <p className="text-gray-400 mt-1">Here is your financial summary for today.</p>
      </header>

      <div className="stagger-1">
        <TimeTravelSlider offset={timeOffset} setOffset={setTimeOffset} />
      </div>

      {/* Top Row: Balance, Quick Actions, Rewards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-4 stagger-2">
          {primaryAccount && <BalanceCard title={`${primaryAccount.type} Account ${timeOffset > 0 ? '(Projected)' : ''}`} amount={projectedBalance} trend={projectedTrend} />}
        </div>
        <div className="md:col-span-4 stagger-3">
          <QuickActions />
        </div>
        <div className="md:col-span-4 stagger-4">
          <RewardsWidget />
        </div>
      </div>

      {/* Middle Row: AI Insights & Spending Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 stagger-5">
          <AIInsights />
        </div>
        <div className="lg:col-span-2 stagger-6">
          <SpendingChart />
        </div>
      </div>

      {/* Bottom Row: Transactions */}
      <div className="stagger-6">
        <RecentTransactions transactions={transactions} isLoading={transactionsLoading} />
      </div>
    </div>
  );
}
