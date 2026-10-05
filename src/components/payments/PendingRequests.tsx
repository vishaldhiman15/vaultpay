import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Transaction } from '@/types';
import { Clock, Check, X } from 'lucide-react';
import { api } from '@/services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function PendingRequests() {
  const queryClient = useQueryClient();
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => api.getTransactions()
  });

  // A pending request to ME is one where I am the DEBIT party (so type is DEBIT) 
  // and status is PENDING and transactionType is UPI_COLLECT.
  const pendingRequests = transactions?.filter(t => 
    t.status === 'PENDING' && 
    (t as any).transactionType === 'UPI_COLLECT' && 
    t.type === 'DEBIT'
  ) || [];

  const handleApprove = async (id: string) => {
    const pin = window.prompt(`Enter your 4-6 digit UPI PIN to approve this request:`);
    if (!pin) return;
    if (pin.length < 4 || pin.length > 6) {
      alert('Invalid PIN length.');
      return;
    }
    
    setProcessingId(id);
    try {
      await api.client.post('/upi/approve', { transactionId: id, pin });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to approve request. Ensure you have sufficient balance and correct PIN.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    setProcessingId(id);
    try {
      await api.client.post('/upi/reject', { transactionId: id });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading) {
    return <div className="text-gray-400 p-4">Loading requests...</div>;
  }

  if (pendingRequests.length === 0) {
    return (
      <Card className="p-8 flex flex-col items-center justify-center text-center bg-black/20 border-dashed border-white/10">
        <Clock className="h-12 w-12 text-gray-500 mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">No Pending Requests</h3>
        <p className="text-sm text-gray-400">You don't have any pending money requests from anyone.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {pendingRequests.map(request => (
        <Card key={request.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 border-l-amber-400">
          <div>
            <div className="text-sm text-gray-400 mb-1">
              Request from <span className="font-semibold text-white">{request.counterpartyName}</span>
            </div>
            <div className="text-2xl font-bold text-white">₹{request.amount.toLocaleString('en-IN')}</div>
            <div className="text-xs text-gray-500 mt-1">{new Date(request.timestamp).toLocaleString()}</div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline"
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 border-red-500/20"
              onClick={() => handleReject(request.id)}
              disabled={processingId === request.id}
            >
              <X className="h-4 w-4 mr-1" />
              Decline
            </Button>
            <Button 
              className="bg-amber-500 hover:bg-amber-400 text-black border-0"
              onClick={() => handleApprove(request.id)}
              disabled={processingId === request.id}
            >
              <Check className="h-4 w-4 mr-1" />
              {processingId === request.id ? 'Processing...' : 'Pay Now'}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
