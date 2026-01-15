import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes';
import gameRoutes from './routes/gameRoutes';
import transactionRoutes from './routes/transactionRoutes';
import leaderboardRoutes from './routes/leaderboardRoutes';

// Load environment variables
dotenv.config();

const app = express();

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
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5174' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;
