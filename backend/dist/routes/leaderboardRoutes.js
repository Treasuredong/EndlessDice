"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const leaderboardController_1 = require("../controllers/leaderboardController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Public leaderboard routes
router.get('/24h', leaderboardController_1.get24HourLeaderboard);
router.get('/all-time', leaderboardController_1.getAllTimeLeaderboard);
router.get('/winning-streak', leaderboardController_1.getWinningStreakLeaderboard);
router.get('/stats', leaderboardController_1.getLeaderboardStats);
// Protected user-specific leaderboard routes
router.get('/user/:userId/position', authMiddleware_1.authMiddleware, leaderboardController_1.getUserLeaderboardPosition);
exports.default = router;
//# sourceMappingURL=leaderboardRoutes.js.map