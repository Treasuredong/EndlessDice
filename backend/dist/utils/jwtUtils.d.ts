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
export declare const generateToken: (userId: string, username: string) => string;
/**
 * Verify and decode a JWT token
 * @param token JWT token string
 * @returns Decoded payload if valid, null otherwise
 */
export declare const verifyToken: (token: string) => JwtPayload | null;
export {};
//# sourceMappingURL=jwtUtils.d.ts.map