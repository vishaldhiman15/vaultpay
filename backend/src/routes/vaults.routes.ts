import { Router } from 'express';
import { getVaults, createVault, addMoney } from '../controllers/vaults.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getVaults);
router.post('/', createVault);
router.post('/:id/add', addMoney);

export default router;
