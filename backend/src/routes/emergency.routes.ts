import { Router } from 'express';
import { getStatus, setupRecovery, activateEmergency, unlockEmergency, deactivateEmergency } from '../controllers/emergency.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Public route for unlocking via URL & PIN
router.post('/unlock', unlockEmergency);

// Protected routes
router.use(authenticate);
router.get('/status', getStatus);
router.post('/setup', setupRecovery);
router.post('/activate', activateEmergency);
router.post('/deactivate', deactivateEmergency);

export default router;
