/**
 * Admin Routes
 * 
 * These routes are for admin-only operations:
 * - Order management
 * - User management
 * - Statistics and analytics
 * 
 * All routes require admin authentication.
 */

import { Router } from 'express';
import { AdminController } from '../controllers/AdminController';
import { AuthMiddleware } from '../middleware/auth';

const router = Router();
const adminController = new AdminController();
const authMiddleware = new AuthMiddleware();

// All admin routes require authentication and admin role
router.use(authMiddleware.authenticate);
router.use(authMiddleware.requireAdmin);

// Order management routes
router.get('/orders', adminController.getAllOrders);
router.put('/orders/:id/status', adminController.updateOrderStatus);
router.put('/orders/:id/location', adminController.updateOrderLocation);

// Statistics routes
router.get('/stats', adminController.getOrderStats);

// User management routes
router.get('/users', adminController.getAllUsers);
router.post('/create-admin', adminController.createAdminUser);

export default router;
