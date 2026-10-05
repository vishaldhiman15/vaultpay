import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Crown, Baby, ShieldAlert, Activity, Send } from 'lucide-react';
import { VirtualCardDisplay } from './VirtualCardDisplay';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

export function FamilyCardSection() {
  const queryClient = useQueryClient();
  const [isPaying, setIsPaying] = useState(false);
  const [allowanceAmount, setAllowanceAmount] = useState('50');

  const { data: familyStatus, isLoading } = useQuery({
    queryKey: ['familyStatus'],
    queryFn: async () => {
      const res = await api.client.get('/family/status');
      return res.data;
    }
  });

  const createChildCardMutation = useMutation({
    mutationFn: () => api.client.post('/family/child-card'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['familyStatus'] })
  });

  const sendAllowanceMutation = useMutation({
    mutationFn: (amount: number) => api.client.post('/family/allowance', { amount }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['familyStatus'] })
  });

  const handleRequestMutation = useMutation({
    mutationFn: ({ id, action }: { id: string, action: 'APPROVE' | 'DENY' }) => 
      api.client.post(`/family/requests/${id}`, { action }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['familyStatus'] })
  });

  const purchaseMutation = useMutation({
    mutationFn: () => api.purchaseFamilyPremium(),
    onMutate: () => setIsPaying(true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['familyStatus'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] }); // Update balance
    },
    onSettled: () => setIsPaying(false),
    onError: (err: any) => {
      alert(err?.response?.data?.error || 'Failed to purchase premium');
    }
  });

  const cancelMutation = useMutation({
    mutationFn: () => api.cancelFamilyPremium(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['familyStatus'] });
    },
    onError: (err: any) => {
      alert(err?.response?.data?.error || 'Failed to cancel premium');
    }
  });

  const handlePayPremium = () => {
    purchaseMutation.mutate();
  };

  const childCard = familyStatus?.childCard;
  const requests = familyStatus?.requests || [];
  const isPremium = familyStatus?.isPremium || false;

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

  if (!childCard && !isLoading) {
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
            <Button 
              onClick={() => createChildCardMutation.mutate()} 
              className="bg-primary hover:bg-primary/90"
              disabled={createChildCardMutation.isPending}
            >
              {createChildCardMutation.isPending ? 'Issuing Card...' : 'Issue Child Card & Account'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) return <div>Loading family space...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          <Baby className="text-primary" />
          Family Controls
        </h3>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-red-400 border-red-500/20 hover:bg-red-500/10 text-xs"
          onClick={() => {
            if (confirm('Are you sure you want to cancel your VaultPay Family Premium subscription? You will lose access immediately.')) {
              cancelMutation.mutate();
            }
          }}
          disabled={cancelMutation.isPending}
        >
          {cancelMutation.isPending ? 'Canceling...' : 'Cancel Subscription'}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-medium">Child's Card (Timmy)</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <VirtualCardDisplay card={{...childCard, nameOnCard: 'TIMMY'} as any} />
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
                <span>Daily Limit: ${childCard?.dailyLimit || 50}.00</span>
                <span>Remaining: $32.00</span>
              </div>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  value={allowanceAmount} 
                  onChange={(e) => setAllowanceAmount(e.target.value)}
                  className="bg-black/50 border border-zinc-800 rounded px-3 py-2 w-24 text-white"
                  placeholder="Amount"
                />
                <Button 
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center gap-2"
                  onClick={() => sendAllowanceMutation.mutate(Number(allowanceAmount))}
                  disabled={sendAllowanceMutation.isPending}
                >
                  <Send size={16} /> {sendAllowanceMutation.isPending ? 'Sending...' : 'Send Allowance'}
                </Button>
              </div>
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
              {requests.map((req: any) => (
                <div key={req.id} className={`flex items-center justify-between p-3 rounded-lg border ${req.type === 'MONEY_REQUEST' ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-black/20 border-white/5'}`}>
                  <div>
                    <p className={`text-sm font-medium flex items-center gap-1 ${req.type === 'MONEY_REQUEST' ? 'text-yellow-500' : 'text-white'}`}>
                      {req.type === 'MONEY_REQUEST' ? 'Money Request' : 'Allowance Sent'}
                      {req.status === 'PENDING' && <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse ml-1" />}
                    </p>
                    <p className={`text-xs ${req.type === 'MONEY_REQUEST' ? 'text-yellow-500/70' : 'text-gray-500'}`}>
                      {req.status} • ${req.amount}
                    </p>
                  </div>
                  {req.status === 'PENDING' && req.type === 'MONEY_REQUEST' ? (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="h-7 text-xs border-white/10 hover:bg-white/10"
                        onClick={() => handleRequestMutation.mutate({ id: req.id, action: 'DENY' })}
                        disabled={handleRequestMutation.isPending}
                      >Deny</Button>
                      <Button size="sm" className="h-7 text-xs bg-yellow-500 text-black hover:bg-yellow-600"
                        onClick={() => handleRequestMutation.mutate({ id: req.id, action: 'APPROVE' })}
                        disabled={handleRequestMutation.isPending}
                      >Send ${req.amount}</Button>
                    </div>
                  ) : (
                    <span className={req.type === 'MONEY_REQUEST' && req.status === 'APPROVED' ? 'text-red-400 text-sm font-medium' : 'text-green-400 text-sm font-medium'}>
                      {req.type === 'MONEY_REQUEST' && req.status === 'APPROVED' ? `-$${req.amount}` : req.type === 'ALLOWANCE_SENT' ? `-$${req.amount}` : ''}
                    </span>
                  )}
                </div>
              ))}
              {requests.length === 0 && (
                <p className="text-gray-500 text-sm text-center">No recent activity</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
