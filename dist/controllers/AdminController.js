"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const Order_1 = require("../models/Order");
const User_1 = require("../models/User");
class AdminController {
    constructor() {
        /**
         * Get all orders (admin only)
         * GET /api/admin/orders
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
        /**
         * Update order status (admin only)
         * PUT /api/admin/orders/:id/status
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
                // In a real application, you would send email notifications here
                // await this.sendStatusUpdateNotification(updatedOrder);
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
         * Update order location (admin only)
         * PUT /api/admin/orders/:id/location
         */
        this.updateOrderLocation = async (req, res) => {
            try {
                const orderId = req.params.id;
                const { currentLocation } = req.body;
                if (!currentLocation) {
                    res.status(400).json({
                        success: false,
                        message: 'Current location is required'
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
                // Update order with new location
                const updatedOrder = await this.orderModel.updateOrderStatus(orderId, order.status, currentLocation);
                if (!updatedOrder) {
                    res.status(500).json({
                        success: false,
                        message: 'Failed to update order location'
                    });
                    return;
                }
                // In a real application, you would send email notifications here
                // await this.sendLocationUpdateNotification(updatedOrder);
                res.status(200).json({
                    success: true,
                    data: updatedOrder,
                    message: 'Order location updated successfully'
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    message: error instanceof Error ? error.message : 'Failed to update order location'
                });
            }
        };
        /**
         * Get order statistics (admin only)
         * GET /api/admin/stats
         */
        this.getOrderStats = async (_req, res) => {
            try {
                const orders = await this.orderModel.getAllOrders();
                const stats = {
                    totalOrders: orders.length,
                    pendingOrders: orders.filter(o => o.status === 'pending').length,
                    inTransitOrders: orders.filter(o => o.status === 'in_transit').length,
                    deliveredOrders: orders.filter(o => o.status === 'delivered').length,
                    cancelledOrders: orders.filter(o => o.status === 'cancelled').length,
                    totalRevenue: orders.reduce((sum, order) => sum + order.price, 0),
                    averageOrderValue: orders.length > 0 ? orders.reduce((sum, order) => sum + order.price, 0) / orders.length : 0
                };
                res.status(200).json({
                    success: true,
                    data: stats,
                    message: 'Order statistics retrieved successfully'
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to retrieve order statistics'
                });
            }
        };
        /**
         * Get all users (admin only)
         * GET /api/admin/users
         */
        this.getAllUsers = async (_req, res) => {
            try {
                const users = await this.userModel.getAllUsers();
                res.status(200).json({
                    success: true,
                    data: users,
                    message: 'All users retrieved successfully'
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to retrieve users'
                });
            }
        };
        /**
         * Create admin user (for initial setup)
         * POST /api/admin/create-admin
         */
        this.createAdminUser = async (req, res) => {
            try {
                const { email, password, firstName, lastName, phone } = req.body;
                if (!email || !password || !firstName || !lastName) {
                    res.status(400).json({
                        success: false,
                        message: 'Email, password, first name, and last name are required'
                    });
                    return;
                }
                // Create user with admin role
                const userData = {
                    email,
                    password,
                    firstName,
                    lastName,
                    phone: phone || '',
                    role: 'admin'
                };
                const user = await this.userModel.createUser(userData);
                res.status(201).json({
                    success: true,
                    data: user,
                    message: 'Admin user created successfully'
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    message: error instanceof Error ? error.message : 'Failed to create admin user'
                });
            }
        };
        this.orderModel = new Order_1.OrderModel();
        this.userModel = new User_1.UserModel();
    }
}
exports.AdminController = AdminController;
//# sourceMappingURL=AdminController.js.map