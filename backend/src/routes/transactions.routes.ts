import { Router } from 'express';
import { transfer, getTransactions, createQrIntent, scanQrIntent, simulateInbound } from '../controllers/transactions.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { z } from 'zod';

const router = Router();

router.use(authenticate);

const transferSchema = z.object({
  body: z.object({
    fromAccountId: z.string(),
    to: z.string(),
    amount: z.number().positive(),
    description: z.string().max(255).optional(),
    type: z.string().optional()
  })
});

router.post('/transfer', validate(transferSchema), transfer);
router.post('/simulate-inbound', simulateInbound);
router.get('/', getTransactions);

router.post('/qr-intent', createQrIntent);
router.get('/qr-intent/scan', scanQrIntent);

export default router;
