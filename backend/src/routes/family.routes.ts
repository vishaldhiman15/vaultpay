import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { getFamilyStatus, createChildCard, sendAllowance, handleRequest } from '../controllers/family.controller.js';

const router = Router();

router.use(authenticate);

router.get('/status', getFamilyStatus);
router.post('/child-card', createChildCard);
router.post('/allowance', sendAllowance);
router.post('/requests/:id', handleRequest);

export default router;
