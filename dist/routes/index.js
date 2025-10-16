"use strict";
/**
 * API Routes
 *
 * This file defines all the API routes for our application.
 * Routes are organized by feature (auth, parcels, orders) for better maintainability.
 *
 * In commercial applications, you might want to:
 * - Add rate limiting
 * - Add request validation middleware
 * - Add API versioning
 * - Add comprehensive logging
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const ParcelController_1 = require("../controllers/ParcelController");
const OrderController_1 = require("../controllers/OrderController");
const auth_1 = require("../middleware/auth");
const admin_1 = __importDefault(require("./admin"));
const router = (0, express_1.Router)();
// Initialize controllers
const authController = new AuthController_1.AuthController();
const parcelController = new ParcelController_1.ParcelController();
const orderController = new OrderController_1.OrderController();
const authMiddleware = new auth_1.AuthMiddleware();
// Authentication routes (no auth required)
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/refresh', authController.refreshToken);
router.post('/auth/logout', authController.logout);
// Protected routes (require authentication)
router.get('/auth/profile', authMiddleware.authenticate, authController.getProfile);
// Parcel routes (require authentication)
router.post('/parcels', authMiddleware.authenticate, parcelController.createParcel);
router.get('/parcels', authMiddleware.authenticate, parcelController.getParcels);
router.get('/parcels/:id', authMiddleware.authenticate, parcelController.getParcelById);
router.put('/parcels/:id', authMiddleware.authenticate, parcelController.updateParcel);
router.delete('/parcels/:id', authMiddleware.authenticate, parcelController.deleteParcel);
// Order routes (require authentication)
router.post('/orders', authMiddleware.authenticate, orderController.createOrder);
router.get('/orders', authMiddleware.authenticate, orderController.getOrders);
router.get('/orders/:id', authMiddleware.authenticate, orderController.getOrderById);
router.put('/orders/:id/destination', authMiddleware.authenticate, orderController.updateOrderDestination);
router.put('/orders/:id/cancel', authMiddleware.authenticate, orderController.cancelOrder);
// Public order tracking (no auth required)
router.get('/orders/track/:trackingNumber', orderController.trackOrder);
// Admin routes (require admin authentication)
router.put('/orders/:id/status', authMiddleware.authenticate, authMiddleware.requireAdmin, orderController.updateOrderStatus);
router.get('/orders/all', authMiddleware.authenticate, authMiddleware.requireAdmin, orderController.getAllOrders);
// Admin routes
router.use('/admin', admin_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map