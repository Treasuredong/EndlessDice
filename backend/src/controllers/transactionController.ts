import { Request, Response } from 'express';

interface TransactionRequest extends Request {
  user?: any;
}

// Transaction constants
const MIN_WITHDRAW = 10;
const DAILY_WITHDRAW_LIMIT = 1000;

/**
 * Submit a deposit request
 */
export const submitDeposit = async (req: TransactionRequest, res: Response) => {
  try {
    const { amount, blockchainAddress, txHash } = req.body;
    const userId = req.user?._id || '123456789';

    // Validate input
    if (!amount || !blockchainAddress || !txHash) {
      return res.status(400).json({ message: 'Amount, blockchain address and transaction hash are required' });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    // Validate blockchain address (simple validation for demonstration)
    if (!/^[a-zA-Z0-9]{32,44}$/.test(blockchainAddress)) {
      return res.status(400).json({ message: 'Invalid blockchain address' });
    }

    // Create mock deposit transaction
    const transaction = {
      _id: `tx-${Date.now()}`,
      userId,
      type: 'deposit',
      amount,
      blockchainAddress,
      status: 'pending',
      rejectionReason: '',
      txHash,
      processedBy: '',
      processedAt: null as Date | null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    res.status(201).json({
      message: 'Deposit request submitted successfully',
      transaction
    });
  } catch (error) {
    console.error('Submit deposit error:', error);
    res.status(500).json({ message: 'Failed to submit deposit request' });
  }
};

/**
 * Submit a withdrawal request
 */
export const submitWithdraw = async (req: TransactionRequest, res: Response) => {
  try {
    const { amount, blockchainAddress } = req.body;
    const userId = req.user?._id || '123456789';

    // Validate input
    if (!amount || !blockchainAddress) {
      return res.status(400).json({ message: 'Amount and blockchain address are required' });
    }

    if (amount < MIN_WITHDRAW) {
      return res.status(400).json({ message: `Minimum withdrawal amount is ${MIN_WITHDRAW} WEDS` });
    }

    // Validate blockchain address (simple validation for demonstration)
    if (!/^[a-zA-Z0-9]{32,44}$/.test(blockchainAddress)) {
      return res.status(400).json({ message: 'Invalid blockchain address' });
    }

    // Mock user data
    const user = {
      _id: userId,
      balance: 100
    };

    // Check if user has enough balance
    if (user.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Create mock withdrawal transaction
    const transaction = {
      _id: `tx-${Date.now()}`,
      userId,
      type: 'withdraw',
      amount,
      blockchainAddress,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    res.status(201).json({
      message: 'Withdrawal request submitted successfully',
      transaction
    });
  } catch (error) {
    console.error('Submit withdraw error:', error);
    res.status(500).json({ message: 'Failed to submit withdrawal request' });
  }
};

/**
 * Get transaction history for current user
 */
export const getTransactionHistory = async (req: TransactionRequest, res: Response) => {
  try {
    const userId = req.user?._id || '123456789';
    const { type, status, page = 1, limit = 20 } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    // Mock transactions
    const mockTransactions = Array.from({ length: limitNum }, (_, i) => ({
      _id: `tx-${Date.now()}-${i}`,
      userId,
      type: ['deposit', 'withdraw'][Math.floor(Math.random() * 2)],
      amount: Math.floor(Math.random() * 1000) + 1,
      blockchainAddress: '0x' + Math.random().toString(16).substring(2, 42),
      status: ['pending', 'completed', 'rejected'][Math.floor(Math.random() * 3)],
      createdAt: new Date(Date.now() - i * 3600000), // 1 hour apart
      updatedAt: new Date(Date.now() - i * 3600000)
    }));

    // Filter transactions
    const filteredTransactions = mockTransactions.filter(tx => {
      if (type && tx.type !== type) return false;
      if (status && tx.status !== status) return false;
      return true;
    });

    res.status(200).json({
      message: 'Transaction history retrieved successfully',
      transactions: filteredTransactions,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: 100, // Mock total
        totalPages: Math.ceil(100 / limitNum)
      }
    });
  } catch (error) {
    console.error('Get transaction history error:', error);
    res.status(500).json({ message: 'Failed to retrieve transaction history' });
  }
};

/**
 * Admin: Process a deposit (confirm/reject)
 */
export const processDeposit = async (req: Request, res: Response) => {
  try {
    const { transactionId, action, rejectionReason, txHash, adminAmount } = req.body;

    // Validate input
    if (!transactionId || !action) {
      return res.status(400).json({ message: 'Transaction ID and action are required' });
    }

    if (action !== 'confirm' && action !== 'reject') {
      return res.status(400).json({ message: 'Action must be either confirm or reject' });
    }

    if (action === 'reject' && !rejectionReason) {
      return res.status(400).json({ message: 'Rejection reason is required' });
    }

    if (action === 'confirm' && (!adminAmount || isNaN(adminAmount) || adminAmount <= 0)) {
      return res.status(400).json({ message: 'Valid admin amount is required for confirmation' });
    }

    // Mock transaction
    const transaction = {
      _id: transactionId,
      userId: 'user-12345',
      type: 'deposit',
      amount: Math.floor(Math.random() * 1000) + 1,
      blockchainAddress: '0x' + Math.random().toString(16).substring(2, 42),
      status: 'pending',
      rejectionReason: '',
      txHash: '',
      processedBy: '',
      processedAt: null as Date | null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (transaction.type !== 'deposit') {
      return res.status(400).json({ message: 'Only deposit transactions can be processed' });
    }

    if (transaction.status !== 'pending') {
      return res.status(400).json({ message: 'Transaction has already been processed' });
    }

    // Update transaction
    transaction.status = action === 'confirm' ? 'completed' : 'rejected';
    transaction.rejectionReason = rejectionReason;
    transaction.txHash = txHash;
    transaction.processedBy = 'admin';
    transaction.processedAt = new Date();
    
    // Use admin specified amount if confirming
    if (action === 'confirm') {
      transaction.amount = adminAmount;
    }

    res.status(200).json({
      message: `Deposit ${action}ed successfully`,
      transaction
    });
  } catch (error) {
    console.error('Process deposit error:', error);
    res.status(500).json({ message: 'Failed to process deposit' });
  }
};

/**
 * Admin: Process a withdrawal (confirm/reject)
 */
export const processWithdrawal = async (req: Request, res: Response) => {
  try {
    const { transactionId, action, rejectionReason, txHash } = req.body;

    // Validate input
    if (!transactionId || !action) {
      return res.status(400).json({ message: 'Transaction ID and action are required' });
    }

    if (action !== 'confirm' && action !== 'reject') {
      return res.status(400).json({ message: 'Action must be either confirm or reject' });
    }

    if (action === 'reject' && !rejectionReason) {
      return res.status(400).json({ message: 'Rejection reason is required' });
    }

    // Mock transaction
    const transaction = {
      _id: transactionId,
      userId: 'user-12345',
      type: 'withdraw',
      amount: Math.floor(Math.random() * 1000) + 1,
      blockchainAddress: '0x' + Math.random().toString(16).substring(2, 42),
      status: 'pending',
      rejectionReason: '',
      txHash: '',
      processedBy: '',
      processedAt: null as Date | null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (transaction.type !== 'withdraw') {
      return res.status(400).json({ message: 'Only withdrawal transactions can be processed' });
    }

    if (transaction.status !== 'pending') {
      return res.status(400).json({ message: 'Transaction has already been processed' });
    }

    // Update transaction
    transaction.status = action === 'confirm' ? 'completed' : 'rejected';
    transaction.rejectionReason = rejectionReason;
    transaction.txHash = txHash;
    transaction.processedBy = 'admin';
    transaction.processedAt = new Date();

    res.status(200).json({
      message: `Withdrawal ${action}ed successfully`,
      transaction
    });
  } catch (error) {
    console.error('Process withdrawal error:', error);
    res.status(500).json({ message: 'Failed to process withdrawal' });
  }
};

/**
 * Get all pending deposit requests (admin)
 */
export const getPendingDeposits = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    // Mock pending deposits
    const mockPendingDeposits = Array.from({ length: limitNum }, (_, i) => ({
      _id: `tx-${Date.now()}-${i}`,
      userId: `user-${Math.floor(Math.random() * 1000) + 1}`,
      username: `user_${Math.floor(Math.random() * 1000) + 1}`,
      type: 'deposit',
      amount: Math.floor(Math.random() * 1000) + 1,
      blockchainAddress: '0x' + Math.random().toString(16).substring(2, 42),
      txHash: 'tx_' + Math.random().toString(36).substring(2, 26),
      status: 'pending',
      createdAt: new Date(Date.now() - i * 3600000), // 1 hour apart
      updatedAt: new Date(Date.now() - i * 3600000)
    }));

    res.status(200).json({
      message: 'Pending deposits retrieved successfully',
      deposits: mockPendingDeposits,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: 100, // Mock total
        totalPages: Math.ceil(100 / limitNum)
      }
    });
  } catch (error) {
    console.error('Get pending deposits error:', error);
    res.status(500).json({ message: 'Failed to retrieve pending deposits' });
  }
};

/**
 * Get transaction statistics
 */
export const getTransactionStats = async (req: Request, res: Response) => {
  try {
    // Mock transaction statistics
    const stats = {
      pendingDeposits: Math.floor(Math.random() * 100) + 1,
      pendingWithdrawals: Math.floor(Math.random() * 50) + 1,
      totalDeposits: Math.floor(Math.random() * 100000) + 10000,
      totalWithdrawals: Math.floor(Math.random() * 50000) + 5000
    };

    res.status(200).json({
      message: 'Transaction statistics retrieved successfully',
      stats
    });
  } catch (error) {
    console.error('Get transaction stats error:', error);
    res.status(500).json({ message: 'Failed to retrieve transaction statistics' });
  }
};
