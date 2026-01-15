import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwtUtils';

interface AuthenticatedRequest extends Request {
  user?: any;
}

/**
 * JWT Authentication Middleware
 */
export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header required' });
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Token required' });
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // Mock user data for demonstration
    const mockUser = {
      _id: decoded.userId,
      username: decoded.username,
      balance: 100,
      status: 'active'
    };

    // Attach user to request
    req.user = mockUser;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Authentication failed' });
  }
};
