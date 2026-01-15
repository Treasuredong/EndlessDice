import express from 'express';
import { 
  submitDeposit, 
  submitWithdraw, 
  getTransactionHistory, 
  processDeposit, 
  processWithdrawal, 
  getTransactionStats,
  getPendingDeposits
} from '../controllers/transactionController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// User routes
router.post('/deposit', authMiddleware, submitDeposit);
router.post('/withdraw', authMiddleware, submitWithdraw);
router.get('/history', authMiddleware, getTransactionHistory);

// Admin routes (in a real app, these would be protected by admin middleware)
router.get('/admin/deposits/pending', getPendingDeposits);
router.post('/admin/deposit/process', processDeposit);
router.post('/admin/withdraw/process', processWithdrawal);
router.get('/admin/stats', getTransactionStats);

export default router;
