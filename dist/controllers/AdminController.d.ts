/**
 * Admin Controller
 *
 * This controller handles admin-only operations:
 * - Updating order status
 * - Updating order location
 * - Managing all orders
 * - User management
 *
 * These endpoints require admin authentication.
 */
import { Request, Response } from 'express';
export declare class AdminController {
    private orderModel;
    private userModel;
    constructor();
    /**
     * Get all orders (admin only)
     * GET /api/admin/orders
     */
    getAllOrders: (_req: Request, res: Response) => Promise<void>;
    /**
     * Update order status (admin only)
     * PUT /api/admin/orders/:id/status
     */
    updateOrderStatus: (req: Request, res: Response) => Promise<void>;
    /**
     * Update order location (admin only)
     * PUT /api/admin/orders/:id/location
     */
    updateOrderLocation: (req: Request, res: Response) => Promise<void>;
    /**
     * Get order statistics (admin only)
     * GET /api/admin/stats
     */
    getOrderStats: (_req: Request, res: Response) => Promise<void>;
    /**
     * Get all users (admin only)
     * GET /api/admin/users
     */
    getAllUsers: (_req: Request, res: Response) => Promise<void>;
    /**
     * Create admin user (for initial setup)
     * POST /api/admin/create-admin
     */
    createAdminUser: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=AdminController.d.ts.map