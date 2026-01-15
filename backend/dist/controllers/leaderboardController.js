"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserLeaderboardPosition = exports.getLeaderboardStats = exports.getWinningStreakLeaderboard = exports.getAllTimeLeaderboard = exports.get24HourLeaderboard = void 0;
// Leaderboard constants
const LEADERBOARD_LIMIT = 10;
/**
 * Get 24-hour profit leaderboard
 */
const get24HourLeaderboard = async (req, res) => {
    try {
        const { limit = LEADERBOARD_LIMIT } = req.query;
        const limitNum = parseInt(limit);
        // Mock 24-hour leaderboard data
        const leaderboard = Array.from({ length: limitNum }, (_, i) => ({
            userId: `user-${i + 1}`,
            username: `player${i + 1}`,
            profit24h: Math.floor(Math.random() * 10000) + 100,
            totalBets: Math.floor(Math.random() * 1000) + 10,
            winRate: parseFloat((Math.random() * 50 + 25).toFixed(2)),
            balance: Math.floor(Math.random() * 50000) + 1000
        })).sort((a, b) => b.profit24h - a.profit24h);
        res.status(200).json({
            message: '24-hour leaderboard retrieved successfully',
            leaderboard,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('Get 24-hour leaderboard error:', error);
        res.status(500).json({ message: 'Failed to retrieve 24-hour leaderboard' });
    }
};
exports.get24HourLeaderboard = get24HourLeaderboard;
/**
 * Get all-time profit leaderboard
 */
const getAllTimeLeaderboard = async (req, res) => {
    try {
        const { limit = LEADERBOARD_LIMIT } = req.query;
        const limitNum = parseInt(limit);
        // Mock all-time leaderboard data
        const leaderboard = Array.from({ length: limitNum }, (_, i) => ({
            userId: `user-${i + 1}`,
            username: `player${i + 1}`,
            totalProfit: Math.floor(Math.random() * 100000) + 1000,
            totalBets: Math.floor(Math.random() * 10000) + 100,
            winRate: parseFloat((Math.random() * 50 + 25).toFixed(2)),
            balance: Math.floor(Math.random() * 100000) + 5000
        })).sort((a, b) => b.totalProfit - a.totalProfit);
        res.status(200).json({
            message: 'All-time leaderboard retrieved successfully',
            leaderboard,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('Get all-time leaderboard error:', error);
        res.status(500).json({ message: 'Failed to retrieve all-time leaderboard' });
    }
};
exports.getAllTimeLeaderboard = getAllTimeLeaderboard;
/**
 * Get longest winning streak leaderboard
 */
const getWinningStreakLeaderboard = async (req, res) => {
    try {
        const { limit = LEADERBOARD_LIMIT } = req.query;
        const limitNum = parseInt(limit);
        // Mock winning streak leaderboard data
        const leaderboard = Array.from({ length: limitNum }, (_, i) => ({
            userId: `user-${i + 1}`,
            username: `player${i + 1}`,
            maxWinningStreak: Math.floor(Math.random() * 50) + 5,
            totalWins: Math.floor(Math.random() * 1000) + 100,
            totalBets: Math.floor(Math.random() * 2000) + 200,
            winRate: parseFloat((Math.random() * 50 + 25).toFixed(2)),
            totalProfit: Math.floor(Math.random() * 50000) + 500
        })).sort((a, b) => b.maxWinningStreak - a.maxWinningStreak);
        res.status(200).json({
            message: 'Winning streak leaderboard retrieved successfully',
            leaderboard,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('Get winning streak leaderboard error:', error);
        res.status(500).json({ message: 'Failed to retrieve winning streak leaderboard' });
    }
};
exports.getWinningStreakLeaderboard = getWinningStreakLeaderboard;
/**
 * Get leaderboard statistics
 */
const getLeaderboardStats = async (req, res) => {
    try {
        // Mock leaderboard statistics
        const stats = {
            totalUsers: Math.floor(Math.random() * 1000) + 100,
            totalBets: Math.floor(Math.random() * 100000) + 10000,
            totalProfit: Math.floor(Math.random() * 1000000) - 500000,
            platformProfit: Math.floor(Math.random() * 100000) + 10000,
            averageWinRate: parseFloat((Math.random() * 10 + 45).toFixed(2))
        };
        res.status(200).json({
            message: 'Leaderboard statistics retrieved successfully',
            stats,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('Get leaderboard stats error:', error);
        res.status(500).json({ message: 'Failed to retrieve leaderboard statistics' });
    }
};
exports.getLeaderboardStats = getLeaderboardStats;
/**
 * Get user's position in leaderboard
 */
const getUserLeaderboardPosition = async (req, res) => {
    try {
        const { userId } = req.params;
        // Mock user data
        const user = {
            userId,
            username: `player${Math.floor(Math.random() * 1000)}`,
            totalProfit: Math.floor(Math.random() * 50000) + 5000,
            profit24h: Math.floor(Math.random() * 10000) + 1000,
            totalBets: Math.floor(Math.random() * 1000) + 100,
            winRate: parseFloat((Math.random() * 20 + 30).toFixed(2))
        };
        // Mock positions
        const positions = {
            profit24h: Math.floor(Math.random() * 100) + 1,
            allTime: Math.floor(Math.random() * 500) + 1
        };
        res.status(200).json({
            message: 'User leaderboard position retrieved successfully',
            user,
            positions
        });
    }
    catch (error) {
        console.error('Get user leaderboard position error:', error);
        res.status(500).json({ message: 'Failed to retrieve user leaderboard position' });
    }
};
exports.getUserLeaderboardPosition = getUserLeaderboardPosition;
//# sourceMappingURL=leaderboardController.js.map