import { Router } from 'express';
import { createAccount, getAccounts } from '../controllers/accounts.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { z } from 'zod';

const router = Router();

router.use(authenticate);

const createAccountSchema = z.object({
  body: z.object({
    type: z.enum(['SAVINGS', 'CURRENT'])
  })
});

router.post('/', validate(createAccountSchema), createAccount);
router.get('/', getAccounts);

export default router;
