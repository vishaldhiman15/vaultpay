import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Bitcoin, TrendingUp, ArrowUpRight, ArrowDownRight, Wallet, Activity, BrainCircuit, Bot } from 'lucide-react';
import { Spinner } from '../components/ui/Spinner';

const initialCryptoAssets = [
  { name: 'Bitcoin', symbol: 'BTC', price: '$64,230.00', change: '+2.4%', up: true, balance: '0.45 BTC', value: '$28,903.50', valueNum: 28903.50 },
  { name: 'Ethereum', symbol: 'ETH', price: '$3,450.20', change: '+1.8%', up: true, balance: '4.2 ETH', value: '$14,490.84', valueNum: 14490.84 },
  { name: 'Solana', symbol: 'SOL', price: '$142.50', change: '-2.5%', up: false, balance: '120 SOL', value: '$17,100.00', valueNum: 17100.00 },
];

export function CryptoPage() {
  const [cryptoAssets, setCryptoAssets] = React.useState(initialCryptoAssets);
  const [aiState, setAiState] = React.useState<'idle' | 'analyzing' | 'done'>('idle');

  const totalValue = cryptoAssets.reduce((acc, curr) => acc + curr.valueNum, 0);

  const handleAiAutoSell = () => {
    setAiState('analyzing');
    setTimeout(() => {
      // Simulate selling SOL because it's underperforming
      setCryptoAssets(prev => prev.filter(a => a.symbol !== 'SOL'));
      setAiState('done');
    }, 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
            <Bitcoin className="text-accent h-6 w-6" />
            Crypto
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage your digital assets.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-card border-white/10">
            Receive
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Buy / Sell
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-medium text-foreground flex items-center gap-2">
              <Wallet className="text-gray-400 h-5 w-5" />
              Total Portfolio Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-4">
              <h2 className="text-4xl font-semibold text-foreground">${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
              <span className="flex items-center text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <ArrowUpRight size={16} className="mr-1" /> +$1,240.50
              </span>
            </div>
            <div className="mt-8 h-48 w-full border rounded-xl bg-card border-white/5 flex items-center justify-center relative overflow-hidden">
              <svg className="w-full h-full text-accent opacity-20" preserveAspectRatio="none" viewBox="0 0 100 100">
                <path d="M0 100 C 20 80, 40 90, 60 50 S 80 40, 100 10" fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                <path d="M0 100 C 20 80, 40 90, 60 50 S 80 40, 100 10 L 100 100 L 0 100" fill="currentColor" fillOpacity="0.1" />
              </svg>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-medium text-foreground">Your Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cryptoAssets.map((asset) => (
                <div key={asset.symbol} className="flex items-center justify-between p-3 rounded-xl hover:bg-card border-white/5 transition-colors cursor-pointer border border-transparent">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-card border-white/10 hover:bg-white/5 flex items-center justify-center font-bold text-gray-300">
                      {asset.symbol[0]}
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{asset.name}</p>
                      <p className="text-xs text-muted-foreground">{asset.balance}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground text-sm">{asset.value}</p>
                    <p className={`text-xs flex items-center justify-end ${asset.up ? 'text-green-600' : 'text-red-500'}`}>
                      {asset.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                      {asset.change}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm col-span-1 md:col-span-3 lg:col-span-3 mt-2 bg-gradient-to-r from-card to-accent/5 border-accent/20">
          <CardHeader>
            <CardTitle className="text-base font-medium text-foreground flex items-center gap-2">
              <BrainCircuit className="text-accent h-5 w-5" />
              VaultPay AI Auto-Trader
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <p className="text-sm text-gray-300">
                  Allow our advanced AI to analyze live market sentiment and order books. The AI will automatically sell underperforming assets at the optimal market price to protect your wealth.
                </p>
                {aiState === 'done' && (
                  <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-md text-sm text-green-400 flex items-start gap-2">
                    <Bot className="h-5 w-5 shrink-0" />
                    <p>AI execution complete: Sold <strong>120 SOL</strong> at peak market price to prevent further losses. Funds have been secured in USD.</p>
                  </div>
                )}
              </div>
              <div className="shrink-0 w-full md:w-auto">
                <Button 
                  onClick={handleAiAutoSell} 
                  disabled={aiState !== 'idle'}
                  className="w-full md:w-auto bg-accent hover:bg-accent/90 text-white flex items-center gap-2"
                >
                  {aiState === 'idle' ? (
                    <>Enable AI Auto-Sell</>
                  ) : aiState === 'analyzing' ? (
                    <><Spinner size="sm" /> Analyzing Markets...</>
                  ) : (
                    <>Optimized</>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
