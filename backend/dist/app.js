"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const gameRoutes_1 = __importDefault(require("./routes/gameRoutes"));
const transactionRoutes_1 = __importDefault(require("./routes/transactionRoutes"));
const leaderboardRoutes_1 = __importDefault(require("./routes/leaderboardRoutes"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
// Using mock data instead of MongoDB for demonstration purposes
console.log('Using mock data for demonstration');
// Rate limiting (disabled for development)
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // Limit each IP to 100 requests per windowMs
//   standardHeaders: true,
//   legacyHeaders: false,
// });
// Middleware
// app.use(limiter);
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({ origin: process.env.CLIENT_URL || 'http://localhost:5174' }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use('/api/users', userRoutes_1.default);
app.use('/api/game', gameRoutes_1.default);
app.use('/api/transactions', transactionRoutes_1.default);
app.use('/api/leaderboard', leaderboardRoutes_1.default);
// Health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});
exports.default = app;
//# sourceMappingURL=app.js.map