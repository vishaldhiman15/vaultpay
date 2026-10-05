import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { hashPassword, verifyPassword, generateToken } from '../utils/crypto.js';
import { AuditLog } from '../models/AuditLog.model.js';

export const getStatus = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const profile = await prisma.recoveryProfile.findUnique({ where: { userId } });
    
    // Check if main accounts are frozen
    const mainAccounts = await prisma.account.findMany({ 
      where: { userId, accountType: { in: ['CHECKING', 'SAVINGS'] } } 
    });
    
    const isFrozen = mainAccounts.length > 0 && mainAccounts.every(a => a.status === 'FROZEN');
    
    res.json({
      status: {
        active: isFrozen,
        secondaryPinSet: !!profile,
        recoveryUrl: profile ? `localhost:5173/recover/${profile.aliasUrl}` : undefined
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch emergency status' });
  }
};

export const setupRecovery = async (req: Request, res: Response) => {
  try {
    const { alias, pin } = req.body;
    const userId = req.user.id;

    // Check if alias is taken
    const existing = await prisma.recoveryProfile.findUnique({ where: { aliasUrl: alias } });
    if (existing && existing.userId !== userId) {
      return res.status(400).json({ error: 'Alias is already taken' });
    }

    const hashedPin = await hashPassword(pin);

    // Create an Emergency Wallet if doesn't exist
    let emergencyAcc = await prisma.account.findFirst({ where: { userId, accountType: 'EMERGENCY' } });
    if (!emergencyAcc) {
      emergencyAcc = await prisma.account.create({
        data: {
          userId,
          accountNumber: Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString(),
          accountType: 'EMERGENCY',
          status: 'ACTIVE',
          currentBalance: 50000.00, // Pre-funded emergency balance for demo
          availBalance: 50000.00,
          currency: 'INR'
        }
      });
    }

    const updatedProfile = await prisma.recoveryProfile.upsert({
      where: { userId },
      update: { aliasUrl: alias, hashedPin, emergencyAccId: emergencyAcc.id },
      create: { userId, aliasUrl: alias, hashedPin, emergencyAccId: emergencyAcc.id }
    });

    await AuditLog.create({ action: 'RECOVERY_SETUP', userId, details: { alias } }).catch(() => {});

    res.json({
      status: {
        active: false,
        secondaryPinSet: true,
        recoveryUrl: `localhost:5173/recover/${alias}`
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to setup recovery' });
  }
};

export const activateEmergency = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    
    // Freeze all CHECKING / SAVINGS accounts
    await prisma.account.updateMany({
      where: { userId, accountType: { in: ['CHECKING', 'SAVINGS'] } },
      data: { status: 'FROZEN' }
    });
    
    // Freeze all cards
    await prisma.card.updateMany({
      where: { userId },
      data: { isFrozen: true }
    });

    await AuditLog.create({ action: 'EMERGENCY_ACTIVATED', userId, details: { source: 'User Request' } }).catch(() => {});

    res.json({
      status: {
        active: true,
        secondaryPinSet: true
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to activate emergency mode' });
  }
};

export const unlockEmergency = async (req: Request, res: Response) => {
  try {
    const { alias, pin } = req.body;
    
    const profile = await prisma.recoveryProfile.findUnique({ where: { aliasUrl: alias }, include: { user: true } });
    if (!profile || !(await verifyPassword(pin, profile.hashedPin))) {
      return res.status(401).json({ error: 'Invalid PIN or Recovery URL' });
    }

    // Freeze main accounts instantly upon emergency login just in case
    await prisma.account.updateMany({
      where: { userId: profile.userId, accountType: { in: ['CHECKING', 'SAVINGS'] } },
      data: { status: 'FROZEN' }
    });

    const token = generateToken({ id: profile.user.id, role: profile.user.role });
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    await AuditLog.create({ action: 'EMERGENCY_LOGIN', userId: profile.userId, details: { ip: req.ip } }).catch(() => {});

    res.json({ message: 'Emergency unlocked' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to unlock emergency mode' });
  }
};

export const deactivateEmergency = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { pin } = req.body;

    // Verify secondary PIN
    const profile = await prisma.recoveryProfile.findUnique({ where: { userId } });
    if (!profile) {
      return res.status(400).json({ error: 'No recovery profile found' });
    }
    if (!pin || !(await verifyPassword(pin, profile.hashedPin))) {
      return res.status(401).json({ error: 'Invalid secondary PIN' });
    }

    // Unfreeze all CHECKING / SAVINGS accounts
    await prisma.account.updateMany({
      where: { userId, accountType: { in: ['CHECKING', 'SAVINGS'] } },
      data: { status: 'ACTIVE' }
    });

    // Unfreeze all cards
    await prisma.card.updateMany({
      where: { userId },
      data: { isFrozen: false }
    });

    await AuditLog.create({ action: 'EMERGENCY_DEACTIVATED', userId, details: { source: 'User PIN Verification' } }).catch(() => {});

    res.json({
      status: {
        active: false,
        secondaryPinSet: true,
        recoveryUrl: `localhost:5173/recover/${profile.aliasUrl}`
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to deactivate emergency mode' });
  }
};
