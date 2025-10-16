/**
 * Order Controller
 *
 * This controller handles delivery order operations:
 * - Creating delivery orders
 * - Tracking orders
 * - Updating order status (admin)
 * - Managing order destinations
 */
import { Request, Response } from 'express';
export declare class OrderController {
    private orderModel;
    constructor();
    /**
     * Create a new delivery order
     * POST /api/orders
     */
    createOrder: (req: Request, res: Response) => Promise<void>;
    /**
     * Get all orders for the authenticated user
     * GET /api/orders
     */
    getOrders: (req: Request, res: Response) => Promise<void>;
    /**
     * Get a specific order by ID
     * GET /api/orders/:id
     */
    getOrderById: (req: Request, res: Response) => Promise<void>;
    /**
     * Track order by tracking number
     * GET /api/orders/track/:trackingNumber
     */
    trackOrder: (req: Request, res: Response) => Promise<void>;
    /**
     * Update order destination
     * PUT /api/orders/:id/destination
     */
    updateOrderDestination: (req: Request, res: Response) => Promise<void>;
    /**
     * Cancel an order
     * PUT /api/orders/:id/cancel
     */
    cancelOrder: (req: Request, res: Response) => Promise<void>;
    /**
     * Update order status (admin only)
     * PUT /api/orders/:id/status
     */
    updateOrderStatus: (req: Request, res: Response) => Promise<void>;
    /**
     * Get all orders (admin only)
     * GET /api/orders/all
     */
    getAllOrders: (_req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=OrderController.d.ts.map