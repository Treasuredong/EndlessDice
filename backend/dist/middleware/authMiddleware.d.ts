import { Request, Response, NextFunction } from 'express';
interface AuthenticatedRequest extends Request {
    user?: any;
}
/**
 * JWT Authentication Middleware
 */
export declare const authMiddleware: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export {};
//# sourceMappingURL=authMiddleware.d.ts.map