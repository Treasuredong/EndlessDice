import React, { createContext, useState, useEffect, useContext } from 'react';
import type { ReactNode } from 'react';
import type { GameConfig, GameResult, GameRecord, GameStats, BetOption, GameRequest } from '../types';
import { gameApi } from '../services/api';
import { useAuth } from './AuthContext';

interface GameContextType {
  config: GameConfig | null;
  loading: boolean;
  error: string | null;
  recentGames: GameRecord[];
  gameStats: GameStats | null;
  currentBet: {
    amount: number;
    option: BetOption;
    multiplier: number;
  };
  setBetAmount: (amount: number) => void;
  setBetOption: (option: BetOption) => void;
  setMultiplier: (multiplier: number) => void;
  resetBet: () => void;
  rollDice: () => Promise<GameResult>;
  refreshGameData: () => Promise<void>;
  calculatePotentialWin: () => number;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, updateUser } = useAuth();
  const [config, setConfig] = useState<GameConfig | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [recentGames, setRecentGames] = useState<GameRecord[]>([]);
  const [gameStats, setGameStats] = useState<GameStats | null>(null);
  const [currentBet, setCurrentBet] = useState<{
    amount: number;
    option: BetOption;
    multiplier: number;
  }>({
    amount: 1,
    option: 'small',
    multiplier: 1
  });

  // Load game config on initial render
  useEffect(() => {
    fetchGameConfig();
  }, []);

  // Load game data when user changes
  useEffect(() => {
    if (user) {
      refreshGameData();
    }
  }, [user]);

  const fetchGameConfig = async () => {
    try {
      setLoading(true);
      setError(null);
      const configData = await gameApi.getConfig();
      setConfig(configData);
    } catch (err: any) {
      console.error('Failed to fetch game config:', err);
      setError(err.response?.data?.message || 'Failed to load game configuration');
    } finally {
      setLoading(false);
    }
  };

  const fetchGameStats = async () => {
    if (!user) return;
    
    try {
      const stats = await gameApi.getStats();
      setGameStats(stats);
    } catch (err: any) {
      console.error('Failed to fetch game stats:', err);
      setError(err.response?.data?.message || 'Failed to load game statistics');
    }
  };

  const fetchRecentGames = async () => {
    if (!user) return;
    
    try {
      const games = await gameApi.getHistory(5);
      setRecentGames(games);
    } catch (err: any) {
      console.error('Failed to fetch recent games:', err);
      setError(err.response?.data?.message || 'Failed to load recent games');
    }
  };

  const refreshGameData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      await Promise.all([fetchGameStats(), fetchRecentGames()]);
    } catch (err) {
      console.error('Failed to refresh game data:', err);
    } finally {
      setLoading(false);
    }
  };

  const setBetAmount = (amount: number) => {
    if (!config) return;
    
    // Ensure amount is within limits
    const minBet = config.limits.minBet;
    const maxBet = Math.min(config.limits.maxBet, user?.balance || minBet);
    const newAmount = Math.max(minBet, Math.min(maxBet, amount));
    
    setCurrentBet(prev => ({ ...prev, amount: newAmount }));
  };

  const setBetOption = (option: BetOption) => {
    setCurrentBet(prev => ({ ...prev, option }));
  };

  const setMultiplier = (multiplier: number) => {
    if (!config) return;
    
    // Ensure multiplier is within limits
    const minMultiplier = 1;
    const maxMultiplier = config.limits.maxMultiplier;
    const newMultiplier = Math.max(minMultiplier, Math.min(maxMultiplier, multiplier));
    
    setCurrentBet(prev => ({ ...prev, multiplier: newMultiplier }));
  };

  const resetBet = () => {
    setCurrentBet({
      amount: config?.limits.minBet || 1,
      option: 'small',
      multiplier: 1
    });
  };

  const calculatePotentialWin = () => {
    if (!config) return 0;
    
    const odds = typeof currentBet.option === 'string' 
      ? config.odds.smallLarge 
      : config.odds.exactNumber;
    
    return currentBet.amount * odds * currentBet.multiplier;
  };

  const rollDice = async (): Promise<GameResult> => {
    if (!user || !config) {
      throw new Error('Game configuration not loaded');
    }

    try {
      setLoading(true);
      setError(null);
      
      const request: GameRequest = {
        betAmount: currentBet.amount,
        betOption: currentBet.option,
        multiplier: currentBet.multiplier
      };

      const response = await gameApi.rollDice(request);
      
      // Update user balance
      updateUser(response.user);
      
      // Add new game to recent games
      const newGameRecord: GameRecord = {
        _id: `temp-${Date.now()}`, // Temporary ID until we get the real one from server
        userId: user._id,
        betAmount: request.betAmount,
        betOption: request.betOption,
        multiplier: request.multiplier,
        odds: typeof request.betOption === 'string' 
          ? config.odds.smallLarge 
          : config.odds.exactNumber,
        diceResult: response.result.diceResult,
        win: response.result.win,
        profit: response.result.profit,
        balanceBefore: response.result.balanceBefore,
        balanceAfter: response.result.balanceAfter,
        createdAt: new Date().toISOString()
      };
      
      setRecentGames(prev => [newGameRecord, ...prev.slice(0, 4)]);
      
      // Reset bet after roll
      resetBet();
      
      return response.result;
    } catch (err: any) {
      console.error('Dice roll failed:', err);
      setError(err.response?.data?.message || 'Game failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    config,
    loading,
    error,
    recentGames,
    gameStats,
    currentBet,
    setBetAmount,
    setBetOption,
    setMultiplier,
    resetBet,
    rollDice,
    refreshGameData,
    calculatePotentialWin
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
