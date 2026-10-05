import { Router } from 'express';
import { issueCard, getCards, updateCard, createBurnerCard } from '../controllers/cards.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.post('/issue', issueCard);
router.get('/', getCards);
router.patch('/:id', updateCard);
router.post('/burner', createBurnerCard);

export default router;
