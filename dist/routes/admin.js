"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AdminController_1 = require("../controllers/AdminController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const adminController = new AdminController_1.AdminController();
const authMiddleware = new auth_1.AuthMiddleware();
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
exports.default = router;
//# sourceMappingURL=admin.js.map