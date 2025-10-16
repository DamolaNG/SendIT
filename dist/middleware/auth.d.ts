/**
 * Authentication Middleware
 *
 * Middleware functions are functions that run between the request and response.
 * They're used for:
 * - Authentication (checking if user is logged in)
 * - Authorization (checking if user has permission)
 * - Logging, rate limiting, etc.
 *
 * In Express.js, middleware functions have access to:
 * - req (request object)
 * - res (response object)
 * - next (function to call next middleware)
 */
import { Request, Response, NextFunction } from 'express';
import { JWTPayload } from '../types';
declare global {
    namespace Express {
        interface Request {
            user?: JWTPayload;
        }
    }
}
export declare class AuthMiddleware {
    private authService;
    constructor();
    /**
     * Middleware to authenticate JWT token
     * This middleware checks if the user is logged in
     */
    authenticate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Middleware to check if user is admin
     * This middleware should be used after authenticate middleware
     */
    requireAdmin: (req: Request, res: Response, next: NextFunction) => void;
    /**
     * Optional authentication middleware
     * This middleware doesn't fail if no token is provided
     * Useful for endpoints that work for both authenticated and anonymous users
     */
    optionalAuth: (req: Request, _res: Response, next: NextFunction) => Promise<void>;
    /**
     * Middleware to check if user owns the resource
     * This ensures users can only access their own data
     */
    requireOwnership: (req: Request, res: Response, next: NextFunction) => void;
}
//# sourceMappingURL=auth.d.ts.map