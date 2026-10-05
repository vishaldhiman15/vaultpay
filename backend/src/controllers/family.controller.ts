import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

const generateFakeCardNumber = () => '4242' + Math.floor(100000000000 + Math.random() * 900000000000).toString();

export const getFamilyStatus = async (req: Request, res: Response) => {
  try {
    const childCard = await prisma.card.findFirst({
      where: { userId: req.user!.id, cardType: 'CHILD_DEBIT' }
    });
    const requests = await prisma.familyRequest.findMany({
      where: { parentId: req.user!.id },
      orderBy: { createdAt: 'desc' },
      take: 10
    });
    
    res.json({
      childCard,
      requests
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch family status' });
  }
};

export const createChildCard = async (req: Request, res: Response) => {
  try {
    const existing = await prisma.card.findFirst({
      where: { userId: req.user!.id, cardType: 'CHILD_DEBIT' }
    });
    if (existing) return res.status(400).json({ error: 'Child card already exists' });

    // Find checking account
    const account = await prisma.account.findFirst({
      where: { userId: req.user!.id, accountType: 'CHECKING' }
    });
    if (!account) return res.status(404).json({ error: 'Account not found' });

    const card = await prisma.card.create({
      data: {
        userId: req.user!.id,
        accountId: account.id,
        cardNumber: generateFakeCardNumber(),
        cardNumberHash: 'mock-hash',
        last4: '1234',
        expiryMonth: 12,
        expiryYear: 28,
        cvvHash: 'mock-cvv',
        cardType: 'CHILD_DEBIT',
        dailyLimit: 50,
        status: 'ACTIVE'
      }
    });
    
    // Add mock request for demo purposes
    await prisma.familyRequest.create({
      data: {
        parentId: req.user!.id,
        childName: 'Timmy',
        type: 'MONEY_REQUEST',
        amount: 15,
        status: 'PENDING'
      }
    });

    res.json(card);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create child card' });
  }
};

export const sendAllowance = async (req: Request, res: Response) => {
  try {
    await prisma.familyRequest.create({
      data: {
        parentId: req.user!.id,
        childName: 'Timmy',
        type: 'ALLOWANCE_SENT',
        amount: Number(req.body.amount || 50),
        status: 'COMPLETED'
      }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send allowance' });
  }
};

export const handleRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'APPROVE' or 'DENY'
    
    const request = await prisma.familyRequest.findUnique({ where: { id: id as string } });
    if (!request || request.parentId !== req.user!.id) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const updated = await prisma.familyRequest.update({
      where: { id: id as string },
      data: { status: action === 'APPROVE' ? 'APPROVED' : 'DENIED' }
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to handle request' });
  }
};
