/**
 * Authentication Controller
 *
 * Controllers handle HTTP requests and responses.
 * They contain the business logic for API endpoints.
 *
 * This controller handles:
 * - User registration
 * - User login
 * - Token refresh
 * - User profile management
 */
import { Request, Response } from 'express';
export declare class AuthController {
    private authService;
    constructor();
    /**
     * Register a new user
     * POST /api/auth/register
     */
    register: (req: Request, res: Response) => Promise<void>;
    /**
     * Login user
     * POST /api/auth/login
     */
    login: (req: Request, res: Response) => Promise<void>;
    /**
     * Get current user profile
     * GET /api/auth/profile
     */
    getProfile: (req: Request, res: Response) => Promise<void>;
    /**
     * Refresh JWT token
     * POST /api/auth/refresh
     */
    refreshToken: (req: Request, res: Response) => Promise<void>;
    /**
     * Logout user (client-side token removal)
     * POST /api/auth/logout
     */
    logout: (_req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=AuthController.d.ts.map