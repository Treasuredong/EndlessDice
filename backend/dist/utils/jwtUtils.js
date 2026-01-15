"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Generate a JWT token for user authentication
 * @param userId User ID
 * @param username Username
 * @returns JWT token string
 */
const generateToken = (userId, username) => {
    const payload = { userId, username };
    const secret = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
    try {
        // Using string literal for expiresIn as per type requirements
        return jsonwebtoken_1.default.sign(payload, secret, { expiresIn: 604800 }); // 7 days in seconds
    }
    catch (error) {
        throw new Error('Token generation failed');
    }
};
exports.generateToken = generateToken;
/**
 * Verify and decode a JWT token
 * @param token JWT token string
 * @returns Decoded payload if valid, null otherwise
 */
const verifyToken = (token) => {
    const secret = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
    try {
        return jsonwebtoken_1.default.verify(token, secret);
    }
    catch (error) {
        return null;
    }
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=jwtUtils.js.map