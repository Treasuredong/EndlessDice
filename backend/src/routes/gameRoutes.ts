import express from 'express';
import { rollDice, getGameHistory, getGameStats, getGameConfig } from '../controllers/gameController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.get('/config', getGameConfig);

// Protected routes
router.post('/roll', authMiddleware, rollDice);
router.get('/history', authMiddleware, getGameHistory);
router.get('/stats', authMiddleware, getGameStats);

export default router;
