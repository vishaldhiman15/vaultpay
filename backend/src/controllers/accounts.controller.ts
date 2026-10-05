import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { AuditLog } from '../models/AuditLog.model.js';

export const createAccount = async (req: Request, res: Response) => {
  const { type } = req.body;
  const userId = req.user.id;
  try {
    const account = await prisma.account.create({
      data: { 
        userId, 
        accountNumber: Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString(),
        accountType: type, 
        status: 'ACTIVE', 
        currentBalance: 0,
        availBalance: 0,
        currency: 'INR'
      }
    });
    await AuditLog.create({ action: 'ACCOUNT_CREATED', userId, resourceId: account.id, details: { type } }).catch(() => {});
    res.status(201).json({ account });
  } catch (error) {
    res.status(400).json({ error: 'Account creation failed' });
  }
};

export const getAccounts = async (req: Request, res: Response) => {
  const userId = req.user.id;
  try {
    const accounts = await prisma.account.findMany({ where: { userId } });
    
    // Map to frontend expected format
    const formattedAccounts = accounts.map(a => ({
      id: a.id,
      userId: a.userId,
      accountNumber: a.accountNumber,
      type: a.accountType,
      balance: a.currentBalance,
      currency: a.currency,
      ifsc: 'VLTP0000001', // Mock IFSC for VaultPay
      status: a.status,
      createdAt: a.createdAt
    }));
    
    res.json({ accounts: formattedAccounts });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch accounts' });
  }
};
