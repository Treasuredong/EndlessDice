import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: string;
  username: string;
}

/**
 * Generate a JWT token for user authentication
 * @param userId User ID
 * @param username Username
 * @returns JWT token string
 */
export const generateToken = (userId: string, username: string): string => {
  const payload: JwtPayload = { userId, username };
  const secret = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

  try {
    // Using string literal for expiresIn as per type requirements
    return jwt.sign(payload, secret, { expiresIn: 604800 }); // 7 days in seconds
  } catch (error) {
    throw new Error('Token generation failed');
  }
};

/**
 * Verify and decode a JWT token
 * @param token JWT token string
 * @returns Decoded payload if valid, null otherwise
 */
export const verifyToken = (token: string): JwtPayload | null => {
  const secret = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch (error) {
    return null;
  }
};
