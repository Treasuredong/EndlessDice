// User types
export interface User {
  _id: string;
  username: string;
  balance: number;
  totalBets: number;
  totalWins: number;
  totalLosses: number;
  totalProfit: number;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'frozen';
}

export interface UserLogin {
  username: string;
  password: string;
}

export interface UserRegister extends UserLogin {
  confirmPassword: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

// Game types
export interface GameConfig {
  odds: {
    smallLarge: number;
    exactNumber: number;
  };
  limits: {
    minBet: number;
    maxBet: number;
    maxMultiplier: number;
  };
}

export type BetOption = 'small' | 'large' | number;

export interface GameRequest {
  betAmount: number;
  betOption: BetOption;
  multiplier: number;
}

export interface GameResult {
  diceResult: number;
  win: boolean;
  profit: number;
  balanceBefore: number;
  balanceAfter: number;
  betAmount: number;
  betOption: BetOption;
  multiplier: number;
  odds: number;
  potentialWin: number;
}

export interface GameRecord {
  _id: string;
  userId: string;
  betAmount: number;
  betOption: BetOption;
  multiplier: number;
  odds: number;
  diceResult: number;
  win: boolean;
  profit: number;
  balanceBefore: number;
  balanceAfter: number;
  createdAt: string;
}

export interface GameStats {
  totalBets: number;
  totalWins: number;
  totalLosses: number;
  winRate: number;
  totalProfit: number;
  balance: number;
}

// Transaction types
export interface Transaction {
  _id: string;
  userId: string;
  type: 'deposit' | 'withdraw';
  amount: number;
  status: 'pending' | 'completed' | 'rejected';
  blockchainAddress?: string;
  txHash?: string;
  rejectionReason?: string;
  processedBy?: string;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionHistoryResponse {
  message: string;
  transactions: Transaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DepositRequest {
  amount: number;
  blockchainAddress: string;
  txHash: string;
}

export interface WithdrawRequest {
  amount: number;
  blockchainAddress: string;
}

// Leaderboard types
export interface LeaderboardEntry {
  userId: string;
  username: string;
  profit24h?: number;
  totalProfit?: number;
  maxWinningStreak?: number;
  totalBets: number;
  winRate: number;
  balance: number;
  totalWins?: number;
}

export interface UserLeaderboardPosition {
  user: {
    userId: string;
    username: string;
    totalProfit: number;
    profit24h: number;
    totalBets: number;
    winRate: number;
  };
  positions: {
    profit24h: number;
    allTime: number;
  };
}

// API response types
export interface ApiResponse {
  message: string;
  [key: string]: any;
}

export interface PaginatedResponse<T> {
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
