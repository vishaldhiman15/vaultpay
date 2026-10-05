import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { AuditLog } from '../models/AuditLog.model.js';

export const getAmlReport = async (req: Request, res: Response) => {
  try {
    const largeTransactions = await prisma.transaction.findMany({
      where: { amount: { gt: 100000 } },
      orderBy: { initiatedAt: 'desc' },
      take: 50
    });
    res.json({ report: largeTransactions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate AML report' });
  }
};

export const uploadKycDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!(req as any).file) {
      res.status(400).json({ error: 'No document uploaded' });
      return;
    }

    // req.file.path contains the Cloudinary URL because of multer-storage-cloudinary
    const documentUrl = (req as any).file.path;

    await prisma.user.update({
      where: { id: userId },
      data: {
        kycStatus: 'SUBMITTED',
        kycDocumentId: documentUrl,
      },
    });

    res.json({ message: 'KYC document uploaded successfully', documentUrl });
  } catch (error) {
    console.error('Error uploading KYC document:', error);
    res.status(500).json({ error: 'Failed to upload document' });
  }
};

export const getAuditLogs = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const logs = await AuditLog.find({ userId }).sort({ timestamp: -1 }).limit(50);
    
    // Map to frontend expected format
    const formatted = logs.map(l => ({
      id: l._id.toString(),
      userId: l.userId,
      action: l.action,
      details: JSON.stringify(l.details),
      ipAddress: l.details?.ip || 'N/A',
      userAgent: 'VaultPay Browser',
      timestamp: l.timestamp.toISOString()
    }));
    
    res.json({ logs: formatted });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
};

export const getAmlAlerts = async (req: Request, res: Response) => {
  try {
    // Demo endpoint returning an empty array since AML Alerts aren't stored in DB yet
    res.json({ alerts: [] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch AML alerts' });
  }
};
