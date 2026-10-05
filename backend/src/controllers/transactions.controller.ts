import { Request, Response } from 'express';
import { TransferService } from '../services/transfer.service.js';
import { AmlService } from '../services/aml.service.js';
import { AuditLog } from '../models/AuditLog.model.js';
import { prisma } from '../lib/prisma.js';

export const transfer = async (req: Request, res: Response) => {
  const { fromAccountId, to, amount, description, type, pin } = req.body;
  const userId = req.user.id;
  try {
    if (!pin) {
      return res.status(400).json({ error: 'UPI PIN is required' });
    }

    const userVpas = await prisma.userVpa.findMany({ where: { userId } });
    if (userVpas.length === 0 || !userVpas[0].upiPinHash) {
      return res.status(400).json({ error: 'Please set your UPI PIN in settings first' });
    }

    const bcrypt = await import('bcryptjs');
    const isValidPin = await bcrypt.default.compare(pin, userVpas[0].upiPinHash);
    if (!isValidPin) {
      return res.status(401).json({ error: 'Incorrect UPI PIN' });
    }
    let toAccountId = null;
    let counterpartyName = to;

    // Resolve 'to' (VPA, Email, or Account Number)
    if (to.includes('@')) {
      // Try resolving as VPA
      const userVpa = await prisma.userVpa.findUnique({ where: { vpa: to }, include: { user: { include: { accounts: true } } } });
      if (userVpa && userVpa.user.accounts.length > 0) {
        toAccountId = userVpa.user.accounts[0].id;
        counterpartyName = `${userVpa.user.firstName} ${userVpa.user.lastName}`.trim();
      } else {
        // Try resolving as Email
        const targetUser = await prisma.user.findUnique({ where: { email: to }, include: { accounts: true } });
        if (targetUser && targetUser.accounts.length > 0) {
          toAccountId = targetUser.accounts[0].id;
          counterpartyName = `${targetUser.firstName} ${targetUser.lastName}`.trim();
        }
      }
    } else {
      // Try resolving as Account Number
      const targetAccount = await prisma.account.findUnique({ where: { accountNumber: to }, include: { user: true } });
      if (targetAccount) {
        toAccountId = targetAccount.id;
        counterpartyName = `${targetAccount.user.firstName} ${targetAccount.user.lastName}`.trim();
      }
    }

    if (!toAccountId) {
      if (type === 'INTERNAL') {
        return res.status(404).json({ error: 'VaultPay user not found with that VPA or Email' });
      }
      // For IMPS/NEFT, we might allow sending to external accounts if we supported it, 
      // but for this demo, we'll just simulate success for external numbers by creating a dummy transaction.
    }

    if (toAccountId) {
      const transaction = await TransferService.initiateInternalTransfer(fromAccountId, toAccountId, amount, description || 'Internal Transfer');
      AmlService.monitorTransaction(transaction.id).catch(console.error);
      await AuditLog.create({ action: 'TRANSFER_INITIATED', userId, resourceId: transaction.id, details: { amount, fromAccountId, toAccountId } }).catch(() => {});
      
      // Update transaction counterparty name for frontend display
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: { description: counterpartyName } 
      });
      
      return res.json({ transaction });
    } else {
      // Simulate external transfer
      const senderAcc = await prisma.account.findUnique({ where: { id: fromAccountId } });
      if (!senderAcc || senderAcc.currentBalance < amount) {
        return res.status(400).json({ error: 'Insufficient funds' });
      }
      // Deduct from sender
      await prisma.account.update({
        where: { id: fromAccountId },
        data: { currentBalance: { decrement: amount }, availBalance: { decrement: amount } }
      });
      // Create transaction
      const transaction = await prisma.transaction.create({
        data: {
          referenceId: `TRF${Date.now()}`,
          senderAccId: fromAccountId,
          amount,
          type: type || 'IMPS',
          channel: 'BANK',
          status: 'COMPLETED',
          description: counterpartyName,
          completedAt: new Date()
        }
      });
      return res.json({ transaction });
    }
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Transfer failed' });
  }
};

export const simulateInbound = async (req: Request, res: Response) => {
  const { toAccountId, amount, sourceName } = req.body;
  const userId = req.user.id;
  try {
    const account = await prisma.account.findFirst({ where: { id: toAccountId, userId } });
    if (!account) return res.status(404).json({ error: 'Account not found' });

    await prisma.account.update({
      where: { id: toAccountId },
      data: { currentBalance: { increment: amount }, availBalance: { increment: amount } }
    });

    const transaction = await prisma.transaction.create({
      data: {
        referenceId: `SIM${Date.now()}`,
        receiverAccId: toAccountId,
        amount,
        type: 'UPI',
        channel: 'BANK',
        status: 'COMPLETED',
        description: sourceName || 'External Transfer',
        completedAt: new Date()
      }
    });
    return res.json({ transaction });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to simulate transfer' });
  }
};

export const getTransactions = async (req: Request, res: Response) => {
  const userId = req.user.id;
  try {
    // Find accounts for this user
    const accounts = await prisma.account.findMany({ where: { userId }, select: { id: true } });
    const accountIds = accounts.map(a => a.id);
    
    // Find all transactions where sender or receiver is one of user's accounts
    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [
          { senderAccId: { in: accountIds } },
          { receiverAccId: { in: accountIds } }
        ]
      },
      orderBy: { initiatedAt: 'desc' }
    });
    
    // Map to frontend expected format
    const formatted = transactions.map(t => {
      const isDebit = accountIds.includes(t.senderAccId || '');
      return {
        id: t.id,
        accountId: isDebit ? t.senderAccId : t.receiverAccId,
        amount: t.amount,
        currency: t.currency,
        type: isDebit ? 'DEBIT' : 'CREDIT',
        status: t.status,
        transactionType: t.type,
        description: t.description || 'Transfer',
        reference: t.referenceId,
        timestamp: t.initiatedAt,
        counterpartyName: t.description || 'External User'
      };
    });
    
    res.json({ transactions: formatted });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

export const createQrIntent = async (req: Request, res: Response) => {
  try {
    const { payeeVpa, payeeName, amount, note } = req.body;
    const intent = await prisma.qrIntent.create({
      data: {
        payeeVpa,
        payeeName: payeeName || 'VaultPay User',
        amount: Number(amount),
        note
      }
    });
    res.json({ intent });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create QR intent' });
  }
};

export const scanQrIntent = async (req: Request, res: Response) => {
  try {
    // Just find the latest active intent for demo purposes
    const intent = await prisma.qrIntent.findFirst({
      where: { status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' }
    });
    
    if (!intent) {
      return res.status(404).json({ error: 'No active QR intents found' });
    }
    
    res.json({ intent });
  } catch (error) {
    res.status(500).json({ error: 'Failed to scan QR intent' });
  }
};
