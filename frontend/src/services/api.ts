import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import type {
  User,
  UserLogin,
  UserRegister,
  AuthResponse,
  GameConfig,
  GameRequest,
  GameResult,
  GameRecord,
  GameStats,
  Transaction,
  TransactionHistoryResponse,
  DepositRequest,
  WithdrawRequest,
  LeaderboardEntry,
  UserLeaderboardPosition
} from '../types';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (data: UserLogin): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/users/login', data);
    return response.data;
  },

  register: async (data: UserRegister): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/users/register', data);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get<{ user: User }>('/users/profile');
    return response.data.user;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await api.put<{ user: User }>('/users/profile', data);
    return response.data.user;
  }
};

// Game API
export const gameApi = {
  getConfig: async (): Promise<GameConfig> => {
    const response = await api.get<{ config: GameConfig }>('/game/config');
    return response.data.config;
  },

  rollDice: async (data: GameRequest): Promise<{ result: GameResult; user: User }> => {
    const response = await api.post<{ result: GameResult; user: User }>('/game/roll', data);
    return response.data;
  },

  getHistory: async (limit?: number): Promise<GameRecord[]> => {
    const response = await api.get<{ records: GameRecord[] }>('/game/history', {
      params: { limit }
    });
    return response.data.records;
  },

  getStats: async (): Promise<GameStats> => {
    const response = await api.get<{ stats: GameStats }>('/game/stats');
    return response.data.stats;
  }
};

// Transaction API
export const transactionApi = {
  submitDeposit: async (data: DepositRequest): Promise<Transaction> => {
    const response = await api.post<{ transaction: Transaction }>('/transactions/deposit', data);
    return response.data.transaction;
  },

  submitWithdraw: async (data: WithdrawRequest): Promise<Transaction> => {
    const response = await api.post<{ transaction: Transaction }>('/transactions/withdraw', data);
    return response.data.transaction;
  },

  getHistory: async (params?: {
    type?: 'deposit' | 'withdraw';
    status?: 'pending' | 'completed' | 'rejected';
    page?: number;
    limit?: number;
  }): Promise<TransactionHistoryResponse> => {
    const response = await api.get<TransactionHistoryResponse>('/transactions/history', {
      params
    });
    return response.data;
  }
};

// Leaderboard API
export const leaderboardApi = {
  get24Hour: async (limit?: number): Promise<{ leaderboard: LeaderboardEntry[] }> => {
    const response = await api.get<{ leaderboard: LeaderboardEntry[] }>('/leaderboard/24h', {
      params: { limit }
    });
    return response.data;
  },

  getAllTime: async (limit?: number): Promise<{ leaderboard: LeaderboardEntry[] }> => {
    const response = await api.get<{ leaderboard: LeaderboardEntry[] }>('/leaderboard/all-time', {
      params: { limit }
    });
    return response.data;
  },

  getWinningStreak: async (limit?: number): Promise<{ leaderboard: LeaderboardEntry[] }> => {
    const response = await api.get<{ leaderboard: LeaderboardEntry[] }>('/leaderboard/winning-streak', {
      params: { limit }
    });
    return response.data;
  },

  getUserPosition: async (userId: string): Promise<UserLeaderboardPosition> => {
    const response = await api.get<UserLeaderboardPosition>(`/leaderboard/user/${userId}/position`);
    return response.data;
  }
};

// Admin API
export const adminApi = {
  getPendingDeposits: async (page?: number, limit?: number): Promise<{ deposits: any[]; pagination: any }> => {
    const response = await api.get('/transactions/admin/deposits/pending', {
      params: { page, limit }
    });
    return response.data;
  },

  processDeposit: async (transactionId: string, action: 'confirm' | 'reject', rejectionReason?: string, txHash?: string, adminAmount?: number): Promise<any> => {
    const response = await api.post('/transactions/admin/deposit/process', {
      transactionId,
      action,
      rejectionReason,
      txHash,
      adminAmount
    });
    return response.data;
  }
};

export default api;
