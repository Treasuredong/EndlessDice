import { Request, Response } from 'express';
/**
 * Register a new user
 */
export declare const registerUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Login a user
 */
export declare const loginUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Get current user profile
 */
export declare const getProfile: (req: Request, res: Response) => Promise<void>;
/**
 * Update user profile
 */
export declare const updateProfile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=userController.d.ts.map