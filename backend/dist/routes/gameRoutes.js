"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const gameController_1 = require("../controllers/gameController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Public routes
router.get('/config', gameController_1.getGameConfig);
// Protected routes
router.post('/roll', authMiddleware_1.authMiddleware, gameController_1.rollDice);
router.get('/history', authMiddleware_1.authMiddleware, gameController_1.getGameHistory);
router.get('/stats', authMiddleware_1.authMiddleware, gameController_1.getGameStats);
exports.default = router;
//# sourceMappingURL=gameRoutes.js.map