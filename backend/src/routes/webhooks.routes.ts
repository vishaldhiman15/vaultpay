import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { prisma } from '../lib/prisma.js';

const router = Router();

router.post('/upi', async (req: Request, res: Response) => {
  const signature = req.headers['x-signature'] as string;
  const payload = JSON.stringify(req.body);
  
  const secret = process.env.PSP_WEBHOOK_SECRET || 'secret';
  const expectedSignature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  
  if (signature !== expectedSignature) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const { transactionId, status, npciTxnId, bankRrn } = req.body;

  try {
    await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        status,
        metadata: JSON.stringify({
          npciTxnId,
          bankRrn
        })
      }
    });
    res.json({ received: true });
  } catch (error) {
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

export default router;
