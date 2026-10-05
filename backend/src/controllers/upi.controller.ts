import { Request, Response } from 'express';
import { UpiService } from '../services/upi.service.js';
import { LedgerService } from '../services/ledger.service.js';
import { AuditLog } from '../models/AuditLog.model.js';
import { prisma } from '../lib/prisma.js';

export const generateIntent = async (req: Request, res: Response) => {
  const { vpa, amount, note } = req.body;
  try {
    const result = await UpiService.generateIntentOrQr(vpa, amount, note);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: 'Failed to generate UPI Intent' });
  }
};

export const collect = async (req: Request, res: Response) => {
  const { vpa, amount } = req.body;
  const userId = req.user.id;
  try {
    const transaction = await UpiService.initiateCollect(userId, vpa, amount);
    await AuditLog.create({ action: 'UPI_COLLECT_INITIATED', userId, resourceId: transaction.id, details: { vpa, amount } }).catch(() => {});
    res.json({ transaction });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to initiate collect' });
  }
};

export const approveCollect = async (req: Request, res: Response) => {
  const { transactionId, pin } = req.body;
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

    const transaction = await prisma.transaction.findUnique({ where: { id: transactionId } });
    if (!transaction || transaction.status !== 'PENDING' || transaction.type !== 'UPI_COLLECT') {
      return res.status(400).json({ error: 'Invalid or already processed request' });
    }

    // Ensure the current user is the one being asked to pay
    const senderAcc = await prisma.account.findUnique({ where: { id: transaction.senderAccId! } });
    if (!senderAcc || senderAcc.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized to approve this request' });
    }

    await LedgerService.recordTransfer(
      transaction.id, 
      transaction.senderAccId!, 
      transaction.receiverAccId!, 
      transaction.amount, 
      transaction.description || 'UPI Collect Approved'
    );
    
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: { status: 'COMPLETED', completedAt: new Date() }
    });

    res.json({ message: 'Request approved successfully' });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to approve request' });
  }
};

export const rejectCollect = async (req: Request, res: Response) => {
  const { transactionId } = req.body;
  const userId = req.user.id;
  try {
    const transaction = await prisma.transaction.findUnique({ where: { id: transactionId } });
    if (!transaction || transaction.status !== 'PENDING') {
      return res.status(400).json({ error: 'Invalid or already processed request' });
    }
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: { status: 'REJECTED' }
    });
    res.json({ message: 'Request rejected' });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to reject request' });
  }
};

export const setVpa = async (req: Request, res: Response) => {
  const { vpa } = req.body;
  const userId = req.user.id;
  try {
    const existing = await prisma.userVpa.findUnique({ where: { vpa } });
    if (existing && existing.userId !== userId) {
      return res.status(400).json({ error: 'VPA is already taken' });
    }
    
    // Validate VPA format loosely
    if (!vpa.includes('@')) {
      return res.status(400).json({ error: 'Invalid VPA format' });
    }

    let updated;
    const existingVpaForUser = await prisma.userVpa.findFirst({ where: { userId } });
    if (existingVpaForUser) {
      updated = await prisma.userVpa.update({ where: { id: existingVpaForUser.id }, data: { vpa } });
    } else {
      updated = await prisma.userVpa.create({ data: { userId, vpa } });
    }

    await prisma.user.update({ where: { id: userId }, data: { updatedAt: new Date() } }); // trigger session update
    await AuditLog.create({ action: 'VPA_UPDATED', userId, details: { vpa } }).catch(() => {});
    
    res.json({ message: 'VPA updated successfully', vpa });
  } catch (error) {
    res.status(400).json({ error: 'Failed to set VPA' });
  }
};

export const setPin = async (req: Request, res: Response) => {
  const { pin } = req.body;
  const userId = req.user.id;
  try {
    if (pin.length < 4 || pin.length > 6) {
      return res.status(400).json({ error: 'PIN must be 4 to 6 digits' });
    }

    const bcrypt = await import('bcryptjs');
    const upiPinHash = await bcrypt.default.hash(pin, 10);
    
    const userVpas = await prisma.userVpa.findMany({ where: { userId } });
    if (userVpas.length === 0) {
      return res.status(400).json({ error: 'Please set a VPA first' });
    }

    await prisma.userVpa.update({
      where: { id: userVpas[0].id },
      data: { upiPinHash }
    });

    await AuditLog.create({ action: 'UPI_PIN_SET', userId, details: {} }).catch(() => {});
    
    res.json({ message: 'UPI PIN set successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to set UPI PIN' });
  }
};
