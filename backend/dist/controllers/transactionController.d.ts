import { Request, Response } from 'express';
interface TransactionRequest extends Request {
    user?: any;
}
/**
 * Submit a deposit request
 */
export declare const submitDeposit: (req: TransactionRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Submit a withdrawal request
 */
export declare const submitWithdraw: (req: TransactionRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Get transaction history for current user
 */
export declare const getTransactionHistory: (req: TransactionRequest, res: Response) => Promise<void>;
/**
 * Admin: Process a deposit (confirm/reject)
 */
export declare const processDeposit: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Admin: Process a withdrawal (confirm/reject)
 */
export declare const processWithdrawal: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Get all pending deposit requests (admin)
 */
export declare const getPendingDeposits: (req: Request, res: Response) => Promise<void>;
/**
 * Get transaction statistics
 */
export declare const getTransactionStats: (req: Request, res: Response) => Promise<void>;
export {};
//# sourceMappingURL=transactionController.d.ts.map