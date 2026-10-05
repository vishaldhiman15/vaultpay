import { Router } from 'express';
import { generateIntent, collect, setVpa, setPin, approveCollect, rejectCollect } from '../controllers/upi.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { z } from 'zod';

const router = Router();

router.use(authenticate);

const intentSchema = z.object({
  body: z.object({
    vpa: z.string(),
    amount: z.number().positive(),
    note: z.string().optional().default('UPI Transfer')
  })
});

const collectSchema = z.object({
  body: z.object({
    vpa: z.string(),
    amount: z.number().positive()
  })
});

router.post('/intent', validate(intentSchema), generateIntent);
router.post('/collect', validate(collectSchema), collect);

const vpaSchema = z.object({
  body: z.object({
    vpa: z.string().min(5).max(50).regex(/^[a-zA-Z0-9.\-_]+@[a-zA-Z]+$/)
  })
});

const pinSchema = z.object({
  body: z.object({
    pin: z.string().min(4).max(6).regex(/^\d+$/)
  })
});

router.post('/vpa', validate(vpaSchema), setVpa);
router.post('/pin', validate(pinSchema), setPin);
router.post('/approve', approveCollect);
router.post('/reject', rejectCollect);

export default router;
