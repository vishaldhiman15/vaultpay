import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export function useAccounts() {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: () => api.getAccounts(),
  });
}

export function useTransactions(accountId?: string) {
  return useQuery({
    queryKey: ['transactions', accountId],
    queryFn: () => api.getTransactions(accountId),
  });
}

export function useCards() {
  return useQuery({
    queryKey: ['cards'],
    queryFn: () => api.getCards(),
  });
}
