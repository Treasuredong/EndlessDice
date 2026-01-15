"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGameConfig = exports.getGameStats = exports.getGameHistory = exports.rollDice = void 0;
// Game constants
const ODDS_1_3 = parseFloat(process.env.ODDS_1_3 || '1.95');
const ODDS_EXACT = parseFloat(process.env.ODDS_EXACT || '5.8');
const MIN_BET = parseFloat(process.env.MIN_BET || '1');
const MAX_BET = parseFloat(process.env.MAX_BET || '10000');
const MAX_MULTIPLIER = 100;
/**
 * Roll a single 6-sided die
 * @returns Random number between 1 and 6
 */
const rollDie = () => {
    return Math.floor(Math.random() * 6) + 1;
};
/**
 * Calculate odds based on bet option
 * @param betOption 'small', 'large', or specific number (1-6)
 * @returns Odds multiplier
 */
const calculateOdds = (betOption) => {
    if (typeof betOption === 'string') {
        return ODDS_1_3; // 1.95x for small/large
    }
    else {
        return ODDS_EXACT; // 5.8x for exact number
    }
};
/**
 * Determine if the player won based on bet option and dice result
 * @param betOption 'small', 'large', or specific number (1-6)
 * @param diceResult Number between 1 and 6
 * @returns True if won, false otherwise
 */
const determineWin = (betOption, diceResult) => {
    if (typeof betOption === 'string') {
        if (betOption === 'small') {
            // Small bet wins with 1-3
            return diceResult >= 1 && diceResult <= 3;
        }
        else { // 'large'
            // Large bet wins with 4-6
            return diceResult >= 4 && diceResult <= 6;
        }
    }
    else {
        // Exact number bet
        return diceResult === betOption;
    }
};
/**
 * Process a dice roll and calculate game result
 */
const rollDice = async (req, res) => {
    try {
        const { betAmount, betOption, multiplier } = req.body;
        // Validate input
        if (!betAmount || !betOption || multiplier === undefined) {
            return res.status(400).json({ message: 'All fields (betAmount, betOption, multiplier) are required' });
        }
        // Validate bet amount
        if (betAmount < MIN_BET) {
            return res.status(400).json({ message: `Minimum bet is ${MIN_BET} WEDS` });
        }
        if (betAmount > MAX_BET) {
            return res.status(400).json({ message: `Maximum bet is ${MAX_BET} WEDS` });
        }
        // Validate multiplier
        if (multiplier < 1 || multiplier > MAX_MULTIPLIER) {
            return res.status(400).json({ message: `Multiplier must be between 1 and ${MAX_MULTIPLIER}` });
        }
        // Validate bet option
        if (typeof betOption === 'string') {
            if (!['small', 'large'].includes(betOption)) {
                return res.status(400).json({ message: 'Bet option must be either small or large' });
            }
        }
        else if (typeof betOption === 'number') {
            if (betOption < 1 || betOption > 6) {
                return res.status(400).json({ message: 'Exact number bet must be between 1 and 6' });
            }
        }
        else {
            return res.status(400).json({ message: 'Invalid bet option' });
        }
        // Mock user data
        const user = {
            _id: '123456789',
            balance: 100,
            totalBets: 0,
            totalWins: 0,
            totalLosses: 0,
            totalProfit: 0
        };
        // Check if user has enough balance
        if (user.balance < betAmount) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }
        // Calculate odds
        const odds = calculateOdds(betOption);
        // Roll the die
        const diceResult = rollDie();
        // Determine win/loss
        const win = determineWin(betOption, diceResult);
        // Calculate profit
        let profit = 0;
        if (win) {
            profit = betAmount * odds * multiplier;
        }
        else {
            profit = -betAmount;
        }
        // Calculate new balance
        const balanceBefore = user.balance;
        const balanceAfter = user.balance + profit;
        // Update user balance and statistics
        user.balance = balanceAfter;
        user.totalBets += 1;
        if (win) {
            user.totalWins += 1;
        }
        else {
            user.totalLosses += 1;
        }
        user.totalProfit += profit;
        // Return result
        res.status(200).json({
            message: 'Game completed successfully',
            result: {
                diceResult,
                win,
                profit,
                balanceBefore,
                balanceAfter,
                betAmount,
                betOption,
                multiplier,
                odds,
                potentialWin: betAmount * odds * multiplier
            },
            user: {
                balance: balanceAfter,
                totalBets: user.totalBets,
                totalWins: user.totalWins,
                totalLosses: user.totalLosses,
                totalProfit: user.totalProfit
            }
        });
    }
    catch (error) {
        console.error('Game error:', error);
        res.status(500).json({ message: 'Game failed' });
    }
};
exports.rollDice = rollDice;
/**
 * Get recent game records for a user
 */
const getGameHistory = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        // Mock game records
        const mockRecords = Array.from({ length: limit }, (_, i) => ({
            _id: `game-${Date.now()}-${i}`,
            betAmount: Math.floor(Math.random() * 100) + 1,
            betOption: ['small', 'large', 1, 2, 3, 4, 5, 6][Math.floor(Math.random() * 8)],
            multiplier: Math.floor(Math.random() * 5) + 1,
            odds: Math.random() > 0.5 ? 1.95 : 5.8,
            diceResult: Math.floor(Math.random() * 6) + 1,
            win: Math.random() > 0.5,
            profit: Math.random() > 0.5 ? Math.floor(Math.random() * 200) + 1 : -Math.floor(Math.random() * 100) - 1,
            balanceBefore: 100,
            balanceAfter: Math.random() > 0.5 ? Math.floor(Math.random() * 200) + 50 : Math.floor(Math.random() * 100),
            createdAt: new Date(Date.now() - i * 60000) // 1 minute apart
        }));
        res.status(200).json({
            message: 'Game history retrieved successfully',
            records: mockRecords
        });
    }
    catch (error) {
        console.error('Get game history error:', error);
        res.status(500).json({ message: 'Failed to retrieve game history' });
    }
};
exports.getGameHistory = getGameHistory;
/**
 * Get game statistics for the current user
 */
const getGameStats = async (req, res) => {
    try {
        // Mock user statistics
        const totalBets = Math.floor(Math.random() * 100) + 1;
        const totalWins = Math.floor(Math.random() * totalBets);
        const totalLosses = totalBets - totalWins;
        const winRate = totalBets > 0 ? parseFloat(((totalWins / totalBets) * 100).toFixed(2)) : 0;
        const totalProfit = Math.floor(Math.random() * 1000) - 500;
        res.status(200).json({
            message: 'Game statistics retrieved successfully',
            stats: {
                totalBets,
                totalWins,
                totalLosses,
                winRate,
                totalProfit,
                balance: 100
            }
        });
    }
    catch (error) {
        console.error('Get game stats error:', error);
        res.status(500).json({ message: 'Failed to retrieve game statistics' });
    }
};
exports.getGameStats = getGameStats;
/**
 * Get game configuration (odds, limits, etc.)
 */
const getGameConfig = (req, res) => {
    try {
        res.status(200).json({
            message: 'Game configuration retrieved successfully',
            config: {
                odds: {
                    smallLarge: ODDS_1_3,
                    exactNumber: ODDS_EXACT
                },
                limits: {
                    minBet: MIN_BET,
                    maxBet: MAX_BET,
                    maxMultiplier: MAX_MULTIPLIER
                }
            }
        });
    }
    catch (error) {
        console.error('Get game config error:', error);
        res.status(500).json({ message: 'Failed to retrieve game configuration' });
    }
};
exports.getGameConfig = getGameConfig;
//# sourceMappingURL=gameController.js.map