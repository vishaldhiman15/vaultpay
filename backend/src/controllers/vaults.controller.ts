import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export const getVaults = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const vaults = await prisma.savingsVault.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ vaults });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get savings vaults' });
  }
};

export const createVault = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const { name, targetAmount, targetDate } = req.body;

    const vault = await prisma.savingsVault.create({
      data: {
        userId,
        name,
        targetAmount,
        targetDate: targetDate ? new Date(targetDate) : null,
      }
    });

    res.json({ vault });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create savings vault' });
  }
};

export const addMoney = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const { id } = req.params;
    const { amount } = req.body;

    const vaultId = id as string;
    const vault = await prisma.savingsVault.findUnique({ where: { id: vaultId } });
    if (!vault || vault.userId !== userId) {
      res.status(404).json({ error: 'Vault not found' });
      return;
    }

    const updatedVault = await prisma.savingsVault.update({
      where: { id: vaultId },
      data: { savedAmount: vault.savedAmount + Number(amount) }
    });

    res.json({ vault: updatedVault });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add money' });
  }
};
