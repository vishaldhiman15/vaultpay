import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { getFamilyStatus, createChildCard, sendAllowance, handleRequest, purchasePremium, cancelPremium } from '../controllers/family.controller.js';

const router = Router();

router.use(authenticate);

router.get('/status', getFamilyStatus);
router.post('/premium/purchase', purchasePremium);
router.post('/premium/cancel', cancelPremium);
router.post('/child-card', createChildCard);
router.post('/allowance', sendAllowance);
router.post('/requests/:id', handleRequest);

export default router;
