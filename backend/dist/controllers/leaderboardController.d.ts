import { Request, Response } from 'express';
/**
 * Get 24-hour profit leaderboard
 */
export declare const get24HourLeaderboard: (req: Request, res: Response) => Promise<void>;
/**
 * Get all-time profit leaderboard
 */
export declare const getAllTimeLeaderboard: (req: Request, res: Response) => Promise<void>;
/**
 * Get longest winning streak leaderboard
 */
export declare const getWinningStreakLeaderboard: (req: Request, res: Response) => Promise<void>;
/**
 * Get leaderboard statistics
 */
export declare const getLeaderboardStats: (req: Request, res: Response) => Promise<void>;
/**
 * Get user's position in leaderboard
 */
export declare const getUserLeaderboardPosition: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=leaderboardController.d.ts.map