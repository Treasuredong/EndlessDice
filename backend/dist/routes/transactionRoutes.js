"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const transactionController_1 = require("../controllers/transactionController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// User routes
router.post('/deposit', authMiddleware_1.authMiddleware, transactionController_1.submitDeposit);
router.post('/withdraw', authMiddleware_1.authMiddleware, transactionController_1.submitWithdraw);
router.get('/history', authMiddleware_1.authMiddleware, transactionController_1.getTransactionHistory);
// Admin routes (in a real app, these would be protected by admin middleware)
router.get('/admin/deposits/pending', transactionController_1.getPendingDeposits);
router.post('/admin/deposit/process', transactionController_1.processDeposit);
router.post('/admin/withdraw/process', transactionController_1.processWithdrawal);
router.get('/admin/stats', transactionController_1.getTransactionStats);
exports.default = router;
//# sourceMappingURL=transactionRoutes.js.map