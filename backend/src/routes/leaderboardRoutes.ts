import express from 'express';
import { 
  get24HourLeaderboard, 
  getAllTimeLeaderboard, 
  getWinningStreakLeaderboard, 
  getLeaderboardStats, 
  getUserLeaderboardPosition 
} from '../controllers/leaderboardController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Public leaderboard routes
router.get('/24h', get24HourLeaderboard);
router.get('/all-time', getAllTimeLeaderboard);
router.get('/winning-streak', getWinningStreakLeaderboard);
router.get('/stats', getLeaderboardStats);

// Protected user-specific leaderboard routes
router.get('/user/:userId/position', authMiddleware, getUserLeaderboardPosition);

export default router;
