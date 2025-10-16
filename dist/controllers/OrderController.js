"use strict";
/**
 * Order Controller
 *
 * This controller handles delivery order operations:
 * - Creating delivery orders
 * - Tracking orders
 * - Updating order status (admin)
 * - Managing order destinations
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const Order_1 = require("../models/Order");
class OrderController {
    constructor() {
        /**
         * Create a new delivery order
         * POST /api/orders
         */
        this.createOrder = async (req, res) => {
            try {
                const userId = req.user?.userId;
                if (!userId) {
                    res.status(401).json({
                        success: false,
                        message: 'Authentication required'
                    });
                    return;
                }
                const orderData = req.body;
                // Validate required fields
                if (!orderData.parcelId || !orderData.pickupLocation || !orderData.destinationLocation) {
                    res.status(400).json({
                        success: false,
                        message: 'Parcel ID, pickup location, and destination location are required'
                    });
                    return;
                }
                const order = await this.orderModel.createOrder(userId, orderData);
                res.status(201).json({
                    success: true,
                    data: order,
                    message: 'Order created successfully'
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    message: error instanceof Error ? error.message : 'Failed to create order'
                });
            }
        };
        /**
         * Get all orders for the authenticated user
         * GET /api/orders
         */
        this.getOrders = async (req, res) => {
            try {
                const userId = req.user?.userId;
                if (!userId) {
                    res.status(401).json({
                        success: false,
                        message: 'Authentication required'
                    });
                    return;
                }
                const orders = await this.orderModel.getOrdersByUser(userId);
                res.status(200).json({
                    success: true,
                    data: orders,
                    message: 'Orders retrieved successfully'
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to retrieve orders'
                });
            }
        };
        /**
         * Get a specific order by ID
         * GET /api/orders/:id
         */
        this.getOrderById = async (req, res) => {
            try {
                const userId = req.user?.userId;
                const orderId = req.params.id;
                if (!userId) {
                    res.status(401).json({
                        success: false,
                        message: 'Authentication required'
                    });
                    return;
                }
                const order = await this.orderModel.getOrderById(orderId);
                if (!order) {
                    res.status(404).json({
                        success: false,
                        message: 'Order not found'
                    });
                    return;
                }
                // Check if order belongs to user (unless admin)
                if (order.userId !== userId && req.user?.role !== 'admin') {
                    res.status(403).json({
                        success: false,
                        message: 'Access denied'
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    data: order,
                    message: 'Order retrieved successfully'
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to retrieve order'
                });
            }
        };
        /**
         * Track order by tracking number
         * GET /api/orders/track/:trackingNumber
         */
        this.trackOrder = async (req, res) => {
            try {
                const trackingNumber = req.params.trackingNumber;
                const order = await this.orderModel.getOrderByTrackingNumber(trackingNumber);
                if (!order) {
                    res.status(404).json({
                        success: false,
                        message: 'Order not found'
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    data: order,
                    message: 'Order tracking information retrieved successfully'
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to track order'
                });
            }
        };
        /**
         * Update order destination
         * PUT /api/orders/:id/destination
         */
        this.updateOrderDestination = async (req, res) => {
            try {
                const userId = req.user?.userId;
                const orderId = req.params.id;
                if (!userId) {
                    res.status(401).json({
                        success: false,
                        message: 'Authentication required'
                    });
                    return;
                }
                const order = await this.orderModel.getOrderById(orderId);
                if (!order) {
                    res.status(404).json({
                        success: false,
                        message: 'Order not found'
                    });
                    return;
                }
                // Check if order belongs to user
                if (order.userId !== userId) {
                    res.status(403).json({
                        success: false,
                        message: 'Access denied'
                    });
                    return;
                }
                const destinationData = req.body;
                if (!destinationData.destinationLocation) {
                    res.status(400).json({
                        success: false,
                        message: 'Destination location is required'
                    });
                    return;
                }
                const updatedOrder = await this.orderModel.updateOrderDestination(orderId, destinationData.destinationLocation);
                if (!updatedOrder) {
                    res.status(500).json({
                        success: false,
                        message: 'Failed to update order destination'
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    data: updatedOrder,
                    message: 'Order destination updated successfully'
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    message: error instanceof Error ? error.message : 'Failed to update order destination'
                });
            }
        };
        /**
         * Cancel an order
         * PUT /api/orders/:id/cancel
         */
        this.cancelOrder = async (req, res) => {
            try {
                const userId = req.user?.userId;
                const orderId = req.params.id;
                if (!userId) {
                    res.status(401).json({
                        success: false,
                        message: 'Authentication required'
                    });
                    return;
                }
                const order = await this.orderModel.getOrderById(orderId);
                if (!order) {
                    res.status(404).json({
                        success: false,
                        message: 'Order not found'
                    });
                    return;
                }
                // Check if order belongs to user
                if (order.userId !== userId) {
                    res.status(403).json({
                        success: false,
                        message: 'Access denied'
                    });
                    return;
                }
                const cancelledOrder = await this.orderModel.cancelOrder(orderId);
                if (!cancelledOrder) {
                    res.status(500).json({
                        success: false,
                        message: 'Failed to cancel order'
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    data: cancelledOrder,
                    message: 'Order cancelled successfully'
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    message: error instanceof Error ? error.message : 'Failed to cancel order'
                });
            }
        };
        /**
         * Update order status (admin only)
         * PUT /api/orders/:id/status
         */
        this.updateOrderStatus = async (req, res) => {
            try {
                const orderId = req.params.id;
                const statusData = req.body;
                if (!statusData.status) {
                    res.status(400).json({
                        success: false,
                        message: 'Status is required'
                    });
                    return;
                }
                const updatedOrder = await this.orderModel.updateOrderStatus(orderId, statusData.status, statusData.currentLocation);
                if (!updatedOrder) {
                    res.status(404).json({
                        success: false,
                        message: 'Order not found'
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    data: updatedOrder,
                    message: 'Order status updated successfully'
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    message: error instanceof Error ? error.message : 'Failed to update order status'
                });
            }
        };
        /**
         * Get all orders (admin only)
         * GET /api/orders/all
         */
        this.getAllOrders = async (_req, res) => {
            try {
                const orders = await this.orderModel.getAllOrders();
                res.status(200).json({
                    success: true,
                    data: orders,
                    message: 'All orders retrieved successfully'
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to retrieve orders'
                });
            }
        };
        this.orderModel = new Order_1.OrderModel();
    }
}
exports.OrderController = OrderController;
//# sourceMappingURL=OrderController.js.map