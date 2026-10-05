export type User = {
  id: string;
  name: string;
  email: string;
  vpa: string;
  avatar?: string;
};

export type AccountType = 'CHECKING' | 'SAVINGS' | 'EMERGENCY';

export type Account = {
  id: string;
  userId: string;
  accountNumber: string;
  type: AccountType;
  balance: number;
  currency: string;
  ifsc: string;
  status: 'ACTIVE' | 'FROZEN' | 'CLOSED';
  createdAt: string;
};

export type TransactionType = 'CREDIT' | 'DEBIT';
export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REJECTED';

export type Transaction = {
  id: string;
  accountId: string;
  amount: number;
  currency: string;
  type: TransactionType;
  status: TransactionStatus;
  description: string;
  reference: string;
  timestamp: string;
  counterpartyName?: string;
  counterpartyAccount?: string;
  counterpartyVpa?: string;
};

export type CardType = 'VIRTUAL' | 'PHYSICAL' | 'BURNER';
export type CardStatus = 'ACTIVE' | 'FROZEN' | 'CANCELLED';

export type Card = {
  id: string;
  accountId: string;
  cardNumber: string;
  expiryMonth: number;
  expiryYear: number;
  cvv: string;
  type: CardType;
  status: CardStatus;
  dailyLimit: number;
  contactlessEnabled: boolean;
  onlineEnabled: boolean;
  network: 'VISA' | 'MASTERCARD' | 'RUPAY';
  expiresAt?: string; // For Burner cards
  merchantLocked?: string; // For Burner cards
};

export type AmlAlertSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type AmlAlert = {
  id: string;
  transactionId: string;
  userId: string;
  ruleTriggered: string;
  severity: AmlAlertSeverity;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'FALSE_POSITIVE';
  createdAt: string;
};

export type AuditLogAction = 'LOGIN' | 'TRANSFER' | 'CARD_FREEZE' | 'SETTINGS_CHANGE' | 'EMERGENCY_ACTIVATED';

export type AuditLog = {
  id: string;
  userId: string;
  action: AuditLogAction;
  details: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
};

export type EmergencyMode = {
  active: boolean;
  activatedAt?: string;
  recoveryUrl?: string;
  secondaryPinSet: boolean;
};
