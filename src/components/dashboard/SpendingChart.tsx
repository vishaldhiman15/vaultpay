import React from 'react';
import { Card } from '../ui/Card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { formatCurrency } from '@/lib/utils';

const data = [
  { name: 'Mon', amount: 4000 },
  { name: 'Tue', amount: 3000 },
  { name: 'Wed', amount: 2000 },
  { name: 'Thu', amount: 2780 },
  { name: 'Fri', amount: 1890 },
  { name: 'Sat', amount: 2390 },
  { name: 'Sun', amount: 3490 },
];

export function SpendingChart() {
  return (
    <Card className="p-6 h-[400px] flex flex-col">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-white">Spending Analytics</h3>
          <p className="text-sm text-gray-400">Last 7 days</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white">{formatCurrency(19550)}</p>
          <p className="text-sm text-red-400">+12% vs previous week</p>
        </div>
      </div>
      <div className="flex-1 w-full animate-fade-in stagger-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9CA3AF', fontSize: 12 }} 
              dy={10}
            />
            <YAxis 
              hide 
              domain={['dataMin - 1000', 'dataMax + 1000']} 
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: '#111827', 
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#fff'
              }}
              itemStyle={{ color: '#fff' }}
              formatter={(value: number) => [formatCurrency(value), 'Spent']}
            />
            <Area 
              type="monotone" 
              dataKey="amount" 
              stroke="#3B82F6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorAmount)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
