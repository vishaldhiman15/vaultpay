import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { TrendingUp, PieChart as PieChartIcon, ArrowUpRight, BarChart3, ShieldCheck, FileText, Download, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export function WealthPage() {
  const [showCertificate, setShowCertificate] = React.useState(false);
  const { user } = useAuth();
  
  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
            <TrendingUp className="text-accent h-6 w-6" />
            Wealth
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Automated portfolio tracking.</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="border-white/20 text-foreground flex items-center gap-2"
            onClick={() => setShowCertificate(true)}
          >
            <FileText size={16} />
            Proof of Wealth
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Deposit
          </Button>
        </div>
      </div>

      {showCertificate && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-2xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden animate-slide-up">
            <div className="p-8 bg-gradient-to-b from-primary/10 to-transparent border-b border-white/5">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Official Financial Statement</h2>
                  <p className="text-muted-foreground mt-1 text-sm">Issued by VaultPay Private Wealth Management</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
              </div>
            </div>
            
            <div className="p-4 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                <div>
                  <p className="text-sm text-muted-foreground">Account Holder</p>
                  <p className="text-lg font-semibold text-foreground mt-1">{user?.name || 'Valued Client'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Statement Date</p>
                  <p className="text-lg font-semibold text-foreground mt-1">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="py-6 border-y border-white/5">
                <p className="text-sm text-muted-foreground mb-4">Total Assets Under Management</p>
                <div className="flex items-end gap-3 flex-wrap">
                  <h3 className="text-4xl sm:text-5xl font-bold text-foreground">$142,850.00</h3>
                  <span className="text-lg font-medium text-green-500 mb-1">USD</span>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-muted-foreground mb-4">Asset Breakdown</p>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground">Liquid Cash</span>
                  <span className="font-medium">$12,450.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground">Equities & ETFs</span>
                  <span className="font-medium">$114,280.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground">Cryptocurrency</span>
                  <span className="font-medium">$16,120.00</span>
                </div>
              </div>

              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-start gap-3 mt-6">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                <p className="text-sm text-green-400">
                  This document serves as proof of funds and financial standing. It is electronically verified by VaultPay for the purposes of property acquisition and premium credit applications.
                </p>
              </div>
            </div>

            <div className="p-4 bg-white/5 border-t border-white/10 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setShowCertificate(false)}>Close</Button>
              <Button className="flex items-center gap-2">
                <Download size={16} />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-medium text-foreground flex items-center gap-2">
              <BarChart3 className="text-gray-400" size={18} />
              Performance
            </CardTitle>
            <div className="flex gap-1">
              {['1W', '1M', '3M', 'YTD', 'ALL'].map((time, i) => (
                <button key={time} className={`text-xs px-2 py-1 rounded-md ${i === 3 ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-card border-white/10 hover:bg-white/5'}`}>
                  {time}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <h2 className="text-4xl font-semibold text-foreground">$142,850.00</h2>
              <p className="text-sm text-green-600 flex items-center mt-1 font-medium">
                <ArrowUpRight size={16} className="mr-1" />
                +$12,450.20 (9.5%) This Year
              </p>
            </div>
            <div className="h-56 w-full rounded-xl bg-card border-white/5 border flex items-center justify-center relative overflow-hidden">
              <svg className="w-full h-full text-accent opacity-20" preserveAspectRatio="none" viewBox="0 0 100 100">
                <path d="M0 80 Q 10 70, 20 85 T 40 60 T 60 70 T 80 40 T 100 20" fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                <path d="M0 80 Q 10 70, 20 85 T 40 60 T 60 70 T 80 40 T 100 20 L 100 100 L 0 100" fill="currentColor" fillOpacity="0.2" />
              </svg>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-medium text-foreground flex items-center gap-2">
                <PieChartIcon className="text-accent" size={18} />
                Allocation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: 'U.S. Stocks (VTI)', value: '55%', color: 'bg-black' },
                  { label: 'Intl Stocks (VXUS)', value: '25%', color: 'bg-white/40' },
                  { label: 'Bonds (BND)', value: '15%', color: 'bg-white/20' },
                  { label: 'Crypto (BTC/ETH)', value: '5%', color: 'bg-accent' },
                ].map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-foreground font-medium">{item.label}</span>
                      <span className="text-muted-foreground font-medium">{item.value}</span>
                    </div>
                    <div className="h-1.5 w-full bg-card border-white/10 hover:bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: item.value }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm bg-card border-white/5 border-white/10">
            <CardContent className="p-4 flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-card border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <ShieldCheck className="text-foreground h-4 w-4" />
              </div>
              <div>
                <h3 className="font-medium text-foreground text-sm">Aggressive Growth</h3>
                <p className="text-xs text-muted-foreground mt-1">Targeting long-term returns with auto-rebalancing.</p>
                <Button variant="outline" className="w-full mt-3 text-xs bg-card border-white/10">
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
