import React from 'react';
import { Card } from '../ui/Card';
import { formatCurrency, cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

interface BalanceCardProps {
  title: string;
  amount: number;
  trend?: number;
  className?: string;
  icon?: React.ElementType;
}

export function BalanceCard({ title, amount, trend, className, icon: Icon = Wallet }: BalanceCardProps) {
  return (
    <Card className={cn("relative overflow-hidden card-hover", className)}>
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Icon className="h-24 w-24" />
      </div>
      <div className="relative z-10 p-6 flex flex-col h-full justify-between">
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        <div className="mt-4">
          <p className="text-3xl font-bold text-white tracking-tight gradient-text animate-fade-in">
            {formatCurrency(amount)}
          </p>
          {trend !== undefined && (
            <div className="mt-2 flex items-center text-sm">
              {trend >= 0 ? (
                <TrendingUp className="mr-1 h-4 w-4 text-emerald-400" />
              ) : (
                <TrendingDown className="mr-1 h-4 w-4 text-red-400" />
              )}
              <span className={trend >= 0 ? "text-emerald-400" : "text-red-400"}>
                {Math.abs(trend)}%
              </span>
              <span className="ml-1 text-gray-500">vs last month</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
