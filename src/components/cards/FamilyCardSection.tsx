import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Crown, Baby, ShieldAlert, Activity, Send, CheckCircle2 } from 'lucide-react';
import { VirtualCardDisplay } from './VirtualCardDisplay';

export function FamilyCardSection() {
  const [isPremium, setIsPremium] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [childCardCreated, setChildCardCreated] = useState(false);
  
  const mockChildCard = {
    id: 'child-123',
    userId: 'mock',
    accountId: 'mock',
    cardNumber: '4242424242421234', // Continuous string for the formatter
    nameOnCard: 'TIMMY',
    expiry: '12/28',
    cvv: '999',
    type: 'VIRTUAL',
    isFrozen: false,
    dailyLimit: 50,
    monthlyLimit: 500,
    createdAt: new Date().toISOString()
  };

  const handlePayPremium = () => {
    setIsPaying(true);
    setTimeout(() => {
      setIsPremium(true);
      setIsPaying(false);
    }, 2000);
  };

  const handleCreateChild = () => {
    setChildCardCreated(true);
  };

  if (!isPremium) {
    return (
      <Card className="border border-yellow-500/20 bg-gradient-to-r from-yellow-500/10 to-transparent relative overflow-hidden">
        <div className="absolute -right-10 -top-10 opacity-10">
          <Crown className="w-64 h-64 text-yellow-500" />
        </div>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-500">
            <Crown size={20} />
            VaultPay Family Premium
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-300 max-w-xl">
            Upgrade to Premium for $9.99/mo to unlock Family Banking. Create dedicated child accounts and cards, monitor their spending in real-time, and set strict daily limits to teach them financial responsibility safely.
          </p>
          <Button 
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold flex items-center gap-2"
            onClick={handlePayPremium}
            disabled={isPaying}
          >
            {isPaying ? 'Processing Payment...' : 'Upgrade Now for $9.99/mo'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!childCardCreated) {
    return (
      <Card className="border border-primary/20 bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Baby size={20} />
            Family Banking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="text-primary w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Create a Teen/Child Space</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Give your child their own independent card and account space. You can review all their requests and control limits from here.
            </p>
            <Button onClick={handleCreateChild} className="bg-primary hover:bg-primary/90">
              Issue Child Card & Account
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white flex items-center gap-2">
        <Baby className="text-primary" />
        Family Controls
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-medium">Child's Card (Timmy)</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <VirtualCardDisplay card={mockChildCard as any} />
            <div className="mt-6 flex gap-3 w-full">
              <Button variant="outline" className="flex-1 text-red-400 border-red-500/20 hover:bg-red-500/10">Freeze Card</Button>
              <Button variant="outline" className="flex-1">Adjust Limits</Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-sm border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex justify-between items-center">
                <span>Timmy's Balance</span>
                <span className="text-2xl font-bold text-white">$45.50</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                <span>Daily Limit: $50.00</span>
                <span>Remaining: $32.00</span>
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2">
                <Send size={16} /> Send Allowance
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Activity size={16} className="text-primary" />
                Recent Activity & Requests
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/5">
                <div>
                  <p className="text-sm text-white font-medium">Roblox Premium</p>
                  <p className="text-xs text-gray-500">Today, 2:45 PM</p>
                </div>
                <span className="text-red-400 text-sm font-medium">-$9.99</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div>
                  <p className="text-sm text-yellow-500 font-medium flex items-center gap-1">Money Request <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse ml-1" /></p>
                  <p className="text-xs text-yellow-500/70">"Dad I need lunch money"</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="h-7 text-xs border-white/10 hover:bg-white/10">Deny</Button>
                  <Button size="sm" className="h-7 text-xs bg-yellow-500 text-black hover:bg-yellow-600">Send $15</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
