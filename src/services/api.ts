import { User, Account, Transaction, Card, AmlAlert, AuditLog, EmergencyMode } from '../types';
import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:5001/api/v1',
  withCredentials: true,
});

// Intercept 401 responses to clear stale sessions
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('vaultpay_user');
      window.location.href = '/'; // Redirect to login
    }
    return Promise.reject(error);
  }
);

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const mockUser: User = {
  id: 'usr_123',
  name: 'Rahul Sharma',
  email: 'rahul@example.com',
  vpa: 'rahul@vaultpay'
};

const mockAccounts: Account[] = [
  {
    id: 'acc_1',
    userId: 'usr_123',
    accountNumber: '4019001000000001',
    type: 'CHECKING',
    balance: 145000.50,
    currency: 'INR',
    ifsc: 'VLTP0000001',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'acc_2',
    userId: 'usr_123',
    accountNumber: '4019001000000002',
    type: 'SAVINGS',
    balance: 550000.00,
    currency: 'INR',
    ifsc: 'VLTP0000001',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 300 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'acc_3',
    userId: 'usr_123',
    accountNumber: '4019001000000003',
    type: 'EMERGENCY',
    balance: 20000.00,
    currency: 'INR',
    ifsc: 'VLTP0000001',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const mockTransactions: Transaction[] = [
  {
    id: 'txn_1',
    accountId: 'acc_1',
    amount: 150000,
    currency: 'INR',
    type: 'CREDIT',
    status: 'COMPLETED',
    description: 'Salary Credit',
    reference: 'SALARY/FEB/2026',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    counterpartyName: 'TechCorp India Pvt Ltd'
  },
  {
    id: 'txn_2',
    accountId: 'acc_1',
    amount: 25000,
    currency: 'INR',
    type: 'DEBIT',
    status: 'COMPLETED',
    description: 'Rent Payment',
    reference: 'RENT/MARCH',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    counterpartyName: 'Priya Patel',
    counterpartyVpa: 'priya@vaultpay'
  },
  {
    id: 'txn_3',
    accountId: 'acc_1',
    amount: 1250,
    currency: 'INR',
    type: 'DEBIT',
    status: 'COMPLETED',
    description: 'Electricity Bill',
    reference: 'BILL/ELEC/001',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    counterpartyName: 'BESCOM'
  },
  {
    id: 'txn_4',
    accountId: 'acc_1',
    amount: 450,
    currency: 'INR',
    type: 'DEBIT',
    status: 'COMPLETED',
    description: 'Uber Ride',
    reference: 'UBER/RIDE/123',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 - 3600000).toISOString(),
    counterpartyName: 'Uber India'
  },
  {
    id: 'txn_5',
    accountId: 'acc_1',
    amount: 850,
    currency: 'INR',
    type: 'DEBIT',
    status: 'PENDING',
    description: 'Swiggy Order',
    reference: 'SWIGGY/ORD/456',
    timestamp: new Date().toISOString(),
    counterpartyName: 'Swiggy'
  }
];

const mockCards: Card[] = [
  {
    id: 'card_1',
    accountId: 'acc_1',
    cardNumber: '4532112399887766',
    expiryMonth: 12,
    expiryYear: 28,
    cvv: '345',
    type: 'VIRTUAL',
    status: 'ACTIVE',
    dailyLimit: 50000,
    contactlessEnabled: true,
    onlineEnabled: true,
    network: 'VISA'
  }
];

const mockAmlAlerts: AmlAlert[] = [
  {
    id: 'alert_1',
    transactionId: 'txn_99',
    userId: 'usr_123',
    ruleTriggered: 'Unusual High Velocity Transfers',
    severity: 'HIGH',
    status: 'OPEN',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'alert_2',
    transactionId: 'txn_98',
    userId: 'usr_123',
    ruleTriggered: 'Cross-Border Transfer from High Risk Jurisdiction',
    severity: 'CRITICAL',
    status: 'INVESTIGATING',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  }
];

const mockAuditLogs: AuditLog[] = [
  {
    id: 'log_1',
    userId: 'usr_123',
    action: 'LOGIN',
    details: 'Successful login',
    ipAddress: '122.164.10.15',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString()
  },
  {
    id: 'log_2',
    userId: 'usr_123',
    action: 'TRANSFER',
    details: 'Initiated transfer of 25000 INR to priya@vaultpay',
    ipAddress: '122.164.10.15',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const mockEmergencyMode: EmergencyMode = {
  active: false,
  secondaryPinSet: true,
  recoveryUrl: 'vaultpay.com/recover/xyz-123'
};

export const api = {
  client,
  // Auth
  login: async (credentials: any) => {
    const res = await client.post('/auth/login', credentials);
    return res.data;
  },
  register: async (userData: any) => {
    const res = await client.post('/auth/register', userData);
    return res.data;
  },
  getUser: async (): Promise<User> => {
    const res = await client.get('/auth/me'); // We need to ensure backend has /auth/me
    return res.data.user;
  },

  // UPI Settings
  setVpa: async (vpa: string) => {
    const res = await client.post('/upi/vpa', { vpa });
    return res.data;
  },
  setUpiPin: async (pin: string) => {
    const res = await client.post('/upi/pin', { pin });
    return res.data;
  },

  getAccounts: async (): Promise<Account[]> => {
    const res = await client.get('/accounts');
    return res.data.accounts;
  },
  
  // Transactions
  getTransactions: async (accountId?: string): Promise<Transaction[]> => {
    const res = await client.get('/transactions');
    let transactions = res.data.transactions;
    if (accountId) {
      transactions = transactions.filter((t: Transaction) => t.accountId === accountId);
    }
    return transactions;
  },
  
  // Cards
  getCards: async (): Promise<Card[]> => {
    const res = await client.get('/cards');
    return res.data.cards;
  },
  updateCard: async (cardId: string, updates: Partial<Card>): Promise<Card> => {
    const res = await client.patch(`/cards/${cardId}`, updates);
    return res.data.card;
  },
  issueVirtualCard: async (accountId?: string): Promise<Card> => {
    const res = await client.post('/cards/issue', { accountId });
    return res.data.card;
  },
  createBurnerCard: async (durationHours: number, merchantLocked?: string, limit?: number): Promise<Card> => {
    const res = await client.post('/cards/burner', { durationHours, merchantLocked, limit });
    return res.data.card;
  },

  // QR Intents
  createQrIntent: async (data: { payeeVpa: string; payeeName?: string; amount: string; note?: string }) => {
    const res = await client.post('/transactions/qr-intent', data);
    return res.data.intent;
  },
  scanQrIntent: async () => {
    const res = await client.get('/transactions/qr-intent/scan');
    return res.data.intent;
  },

  // Payments
  initiateTransfer: async (data: { amount: number; to: string; type: string; description: string; fromAccountId?: string; pin?: string }): Promise<Transaction> => {
    // If fromAccountId is not provided, fetch accounts and use the first one
    let fromAccId = data.fromAccountId;
    if (!fromAccId) {
      const accounts = await api.getAccounts();
      if (accounts.length > 0) fromAccId = accounts[0].id;
    }
    const res = await client.post('/transactions/transfer', {
      ...data,
      fromAccountId: fromAccId
    });
    return res.data.transaction;
  },

  // Compliance
  getAmlAlerts: async (): Promise<AmlAlert[]> => {
    const res = await client.get('/compliance/alerts');
    return res.data.alerts;
  },
  getAuditLogs: async (): Promise<AuditLog[]> => {
    const res = await client.get('/compliance/audit-logs');
    return res.data.logs;
  },

  // Emergency
  getEmergencyStatus: async (): Promise<EmergencyMode> => {
    const res = await client.get('/emergency/status');
    return res.data.status;
  },
  setupEmergency: async (alias: string, pin: string): Promise<EmergencyMode> => {
    const res = await client.post('/emergency/setup', { alias, pin });
    return res.data.status;
  },
  activateEmergencyMode: async (): Promise<EmergencyMode> => {
    const res = await client.post('/emergency/activate');
    return res.data.status;
  },
  unlockEmergency: async (alias: string, pin: string): Promise<any> => {
    const res = await client.post('/emergency/unlock', { alias, pin });
    return res.data;
  },
  deactivateEmergencyMode: async (pin: string): Promise<EmergencyMode> => {
    const res = await client.post('/emergency/deactivate', { pin });
    return res.data.status;
  }
};
