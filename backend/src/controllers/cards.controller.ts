import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { AuditLog } from '../models/AuditLog.model.js';
import bcrypt from 'bcryptjs';

export const issueCard = async (req: Request, res: Response) => {
  const { accountId } = req.body;
  const userId = req.user.id;
  try {
    const cardNumber = '4532' + Math.floor(100000000000 + Math.random() * 900000000000).toString();
    const cvv = Math.floor(100 + Math.random() * 900).toString();
    const cvvHash = await bcrypt.hash(cvv, 10);
    const cardNumberHash = await bcrypt.hash(cardNumber, 10);

    const card = await prisma.card.create({
      data: {
        userId,
        accountId,
        cardNumber, // In production, never store raw card numbers. We store it for demo.
        cardNumberHash,
        last4: cardNumber.slice(-4),
        expiryMonth: new Date().getMonth() + 1,
        expiryYear: (new Date().getFullYear() % 100) + 3,
        cvvHash,
        cardType: 'VIRTUAL_DEBIT',
        status: 'ACTIVE',
      }
    });

    await AuditLog.create({ action: 'CARD_ISSUED', userId, resourceId: card.id, details: { accountId } }).catch(() => {});
    res.status(201).json({ card });
  } catch (error) {
    res.status(400).json({ error: 'Failed to issue card' });
  }
};

export const getCards = async (req: Request, res: Response) => {
  const userId = req.user.id;
  try {
    const cards = await prisma.card.findMany({ where: { userId } });
    
    // Map to frontend expected format
    const formatted = cards.map(c => ({
      id: c.id,
      accountId: c.accountId,
      cardNumber: c.cardNumber, // Raw stored for demo purposes
      expiryMonth: c.expiryMonth,
      expiryYear: c.expiryYear,
      cvv: '***',
      type: c.cardType,
      status: c.isFrozen ? 'FROZEN' : c.status,
      dailyLimit: c.dailyLimit,
      contactlessEnabled: c.isContactless,
      onlineEnabled: c.isOnlineEnabled,
      network: 'VISA'
    }));

    res.json({ cards: formatted });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cards' });
  }
};

export const updateCard = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  const userId = req.user.id;
  
  try {
    const cardId = id as string;
    const card = await prisma.card.findFirst({ where: { id: cardId, userId } });
    if (!card) return res.status(404).json({ error: 'Card not found' });

    const updated = await prisma.card.update({
      where: { id: cardId },
      data: {
        isFrozen: updates.isFrozen !== undefined ? updates.isFrozen : undefined,
        isContactless: updates.contactlessEnabled !== undefined ? updates.contactlessEnabled : undefined,
        isOnlineEnabled: updates.onlineEnabled !== undefined ? updates.onlineEnabled : undefined,
        dailyLimit: updates.dailyLimit !== undefined ? updates.dailyLimit : undefined,
        status: updates.status !== undefined ? updates.status : undefined,
      }
    });

    res.json({ 
      card: {
        id: updated.id,
        accountId: updated.accountId,
        cardNumber: updated.cardNumber,
        expiryMonth: updated.expiryMonth,
        expiryYear: updated.expiryYear,
        cvv: '***',
        type: updated.cardType,
        status: updated.isFrozen ? 'FROZEN' : updated.status,
        dailyLimit: updated.dailyLimit,
        contactlessEnabled: updated.isContactless,
        onlineEnabled: updated.isOnlineEnabled,
        network: 'VISA'
      } 
    });
  } catch (error) {
    res.status(400).json({ error: 'Failed to update card' });
  }
};

export const createBurnerCard = async (req: Request, res: Response) => {
  const { durationHours = 24, merchantLocked, limit } = req.body;
  const userId = req.user.id;
  
  try {
    const accounts = await prisma.account.findMany({ where: { userId } });
    if (accounts.length === 0) return res.status(400).json({ error: 'No account found to link card' });
    
    const accountId = accounts[0].id;

    const cardNumber = '4532' + Math.floor(100000000000 + Math.random() * 900000000000).toString();
    const cvv = Math.floor(100 + Math.random() * 900).toString();
    const cvvHash = await bcrypt.hash(cvv, 10);
    const cardNumberHash = await bcrypt.hash(cardNumber, 10);

    const card = await prisma.card.create({
      data: {
        userId,
        accountId,
        cardNumber,
        cardNumberHash,
        last4: cardNumber.slice(-4),
        expiryMonth: new Date().getMonth() + 1,
        expiryYear: (new Date().getFullYear() % 100) + 1,
        cvvHash,
        cardType: 'BURNER',
        status: 'ACTIVE',
        expiresAt: new Date(Date.now() + durationHours * 3600000),
        merchantLocked: merchantLocked || null,
        dailyLimit: limit ? Number(limit) : 50000
      }
    });

    res.json({ 
      card: {
        id: card.id,
        accountId: card.accountId,
        cardNumber: card.cardNumber,
        expiryMonth: card.expiryMonth,
        expiryYear: card.expiryYear,
        cvv: cvv, // Return real CVV only once on creation
        type: card.cardType,
        status: card.status,
        dailyLimit: 10000,
        contactlessEnabled: false,
        onlineEnabled: true,
        network: 'VISA',
        expiresAt: card.expiresAt,
        merchantLocked: card.merchantLocked
      }
    });
  } catch (error) {
    res.status(400).json({ error: 'Failed to create burner card' });
  }
};
