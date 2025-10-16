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

import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { ParcelController } from '../controllers/ParcelController';
import { OrderController } from '../controllers/OrderController';
import { AuthMiddleware } from '../middleware/auth';
import adminRoutes from './admin';

const router = Router();

// Initialize controllers
const authController = new AuthController();
const parcelController = new ParcelController();
const orderController = new OrderController();
const authMiddleware = new AuthMiddleware();

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
router.use('/admin', adminRoutes);

export default router;
