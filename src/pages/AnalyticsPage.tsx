import React from 'react';
import { Card } from '@/components/ui/Card';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { AIInsights } from '@/components/dashboard/AIInsights';
import { BrainCircuit, TrendingUp, TrendingDown, Coffee, ShoppingBag, Car, Home, Wallet } from 'lucide-react';

const spendingData = [
  { name: 'Housing', value: 35000, color: '#3B82F6', icon: Home },
  { name: 'Food & Dining', value: 12000, color: '#10B981', icon: Coffee },
  { name: 'Transport', value: 8000, color: '#F59E0B', icon: Car },
  { name: 'Shopping', value: 15000, color: '#8B5CF6', icon: ShoppingBag },
  { name: 'Bills', value: 5000, color: '#EF4444', icon: Wallet },
];

const monthlyTrend = [
  { month: 'Jan', spent: 65000, saved: 20000 },
  { month: 'Feb', spent: 72000, saved: 15000 },
  { month: 'Mar', spent: 68000, saved: 22000 },
  { month: 'Apr', spent: 59000, saved: 30000 },
  { month: 'May', spent: 75000, saved: 10000 },
  { month: 'Jun', spent: 61000, saved: 25000 },
];

export function AnalyticsPage() {
  const totalSpent = spendingData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Analytics & Insights</h1>
          <p className="text-gray-400 mt-1">AI-powered financial management</p>
        </div>
        <div className="flex items-center gap-2 bg-purple-500/10 text-purple-400 px-4 py-2 rounded-lg border border-purple-500/20">
          <BrainCircuit className="w-5 h-5" />
          <span className="font-semibold text-sm">Vault AI Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Charts */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Spending Breakdown */}
          <Card className="glass-card p-6">
            <h3 className="text-lg font-bold text-white mb-6">Spending Breakdown</h3>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-64 h-64 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={spendingData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {spendingData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-sm text-gray-400">Total Spent</span>
                  <span className="text-xl font-bold text-white">{formatCurrency(totalSpent)}</span>
                </div>
              </div>
              
              <div className="flex-1 w-full space-y-4">
                {spendingData.map((category) => {
                  const Icon = category.icon;
                  const percentage = ((category.value / totalSpent) * 100).toFixed(0);
                  
                  return (
                    <div key={category.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${category.color}20`, color: category.color }}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{category.name}</p>
                          <p className="text-xs text-gray-400">{percentage}% of total</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-white">{formatCurrency(category.value)}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </Card>

          {/* Monthly Trend */}
          <Card className="glass-card p-6">
            <h3 className="text-lg font-bold text-white mb-6">6-Month Trend</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value/1000}k`} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                    contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Bar dataKey="spent" name="Spent" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="saved" name="Saved" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Right Column: AI Insights & Alerts */}
        <div className="space-y-6">
          <AIInsights />
          
          <Card className="glass-card p-6">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider text-gray-400">Smart Suggestions</h3>
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex gap-3">
                <TrendingUp className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-white">Invest Your Savings</p>
                  <p className="text-xs text-gray-400 mt-1">You have ₹25,000 idle in checking. Move to Vault Earn for 6% APY.</p>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex gap-3">
                <TrendingDown className="w-5 h-5 text-blue-400 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-white">Optimize Subscriptions</p>
                  <p className="text-xs text-gray-400 mt-1">You are paying for 3 streaming services. Canceling one saves ₹8,400/yr.</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
