"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jwtUtils_1 = require("../utils/jwtUtils");
/**
 * JWT Authentication Middleware
 */
const authMiddleware = async (req, res, next) => {
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
        const decoded = (0, jwtUtils_1.verifyToken)(token);
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
    }
    catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ message: 'Authentication failed' });
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=authMiddleware.js.map