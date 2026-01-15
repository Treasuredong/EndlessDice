import { Request, Response } from 'express';
interface GameRequest extends Request {
    user?: any;
}
/**
 * Process a dice roll and calculate game result
 */
export declare const rollDice: (req: GameRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Get recent game records for a user
 */
export declare const getGameHistory: (req: GameRequest, res: Response) => Promise<void>;
/**
 * Get game statistics for the current user
 */
export declare const getGameStats: (req: GameRequest, res: Response) => Promise<void>;
/**
 * Get game configuration (odds, limits, etc.)
 */
export declare const getGameConfig: (req: Request, res: Response) => void;
export {};
//# sourceMappingURL=gameController.d.ts.map