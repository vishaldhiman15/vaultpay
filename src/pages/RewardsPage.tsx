import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Gift, Star, Trophy, ArrowRight, Zap, Target, CheckCircle2 } from 'lucide-react';
import { Spinner } from '../components/ui/Spinner';

export function RewardsPage() {
  const [points, setPoints] = React.useState(12450);
  const [redeemState, setRedeemState] = React.useState<'idle' | 'redeeming' | 'done'>('idle');

  const handleRedeem = () => {
    setRedeemState('redeeming');
    setTimeout(() => {
      setPoints(0);
      setRedeemState('done');
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
            <Gift className="text-accent h-6 w-6" />
            Rewards
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Redeem points for perks and cashback.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-3 lg:col-span-1 shadow-sm bg-card border-white/5 border-white/10 text-center flex flex-col items-center justify-center py-10">
          <div className="w-16 h-16 rounded-full bg-card shadow-sm flex items-center justify-center mb-4 border">
            <Star className="text-yellow-500 h-8 w-8 fill-yellow-500" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">Available Points</p>
          <h2 className="text-4xl font-bold text-foreground mt-1">
            {points.toLocaleString()} <span className="text-muted-foreground text-lg">VP</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-1">≈ ${(points / 100).toFixed(2)} Value</p>
          
          {redeemState === 'done' ? (
            <div className="mt-6 flex flex-col items-center">
              <CheckCircle2 className="text-green-500 h-8 w-8 mb-2" />
              <p className="text-sm font-medium text-green-400">Successfully credited to main account!</p>
            </div>
          ) : (
            <Button 
              className="w-3/4 bg-primary hover:bg-primary/90 text-primary-foreground mt-6"
              onClick={handleRedeem}
              disabled={points === 0 || redeemState === 'redeeming'}
            >
              {redeemState === 'redeeming' ? <Spinner size="sm" className="mr-2" /> : null}
              {redeemState === 'redeeming' ? 'Redeeming...' : 'Redeem Now'}
            </Button>
          )}
        </Card>

        <div className="col-span-3 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-medium text-foreground flex items-center gap-2">
                <Trophy className="text-yellow-500" size={18} />
                Current Tier: <span className="font-semibold">Gold</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Spend $2,550 more to unlock Platinum.</p>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500 w-3/4 rounded-full" />
              </div>
              <ul className="mt-6 space-y-3 text-sm text-foreground">
                <li className="flex items-center gap-2"><Zap size={14} className="text-accent" /> 2% Cashback</li>
                <li className="flex items-center gap-2"><Zap size={14} className="text-accent" /> Zero ATM fees</li>
                <li className="flex items-center gap-2"><Zap size={14} className="text-accent" /> Priority Support</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-medium text-foreground flex items-center gap-2">
                <Target className="text-accent" size={18} />
                Featured Offers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { brand: 'Uber', offer: '5% Cashback', points: 'Auto' },
                { brand: 'Spotify', offer: 'Free Month', points: '1,000 VP' },
                { brand: 'AirBnb', offer: '$50 Off', points: '4,500 VP' },
              ].map((perk, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-card border-white/5 border hover:bg-card border-white/10 hover:bg-white/5 cursor-pointer">
                  <div>
                    <p className="font-medium text-foreground text-sm">{perk.brand}</p>
                    <p className="text-xs text-muted-foreground">{perk.offer}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-foreground">{perk.points}</span>
                    <ArrowRight size={14} className="text-muted-foreground" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
