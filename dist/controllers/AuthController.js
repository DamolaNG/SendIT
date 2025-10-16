"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const AuthService_1 = require("../services/AuthService");
class AuthController {
    constructor() {
        /**
         * Register a new user
         * POST /api/auth/register
         */
        this.register = async (req, res) => {
            try {
                const userData = req.body;
                // Validate required fields
                if (!userData.email || !userData.password || !userData.firstName || !userData.lastName) {
                    res.status(400).json({
                        success: false,
                        message: 'Email, password, first name, and last name are required'
                    });
                    return;
                }
                const result = await this.authService.register(userData);
                res.status(201).json({
                    success: true,
                    data: result,
                    message: 'User registered successfully'
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    message: error instanceof Error ? error.message : 'Registration failed'
                });
            }
        };
        /**
         * Login user
         * POST /api/auth/login
         */
        this.login = async (req, res) => {
            try {
                const loginData = req.body;
                // Validate required fields
                if (!loginData.email || !loginData.password) {
                    res.status(400).json({
                        success: false,
                        message: 'Email and password are required'
                    });
                    return;
                }
                const result = await this.authService.login(loginData);
                res.status(200).json({
                    success: true,
                    data: result,
                    message: 'Login successful'
                });
            }
            catch (error) {
                res.status(401).json({
                    success: false,
                    message: error instanceof Error ? error.message : 'Login failed'
                });
            }
        };
        /**
         * Get current user profile
         * GET /api/auth/profile
         */
        this.getProfile = async (req, res) => {
            try {
                // User data is attached to request by auth middleware
                const user = req.user;
                if (!user) {
                    res.status(401).json({
                        success: false,
                        message: 'User not authenticated'
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    data: {
                        id: user.userId,
                        email: user.email,
                        role: user.role
                    },
                    message: 'Profile retrieved successfully'
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to retrieve profile'
                });
            }
        };
        /**
         * Refresh JWT token
         * POST /api/auth/refresh
         */
        this.refreshToken = async (req, res) => {
            try {
                const authHeader = req.headers.authorization;
                if (!authHeader || !authHeader.startsWith('Bearer ')) {
                    res.status(401).json({
                        success: false,
                        message: 'No token provided'
                    });
                    return;
                }
                const token = authHeader.substring(7);
                const result = await this.authService.refreshToken(token);
                res.status(200).json({
                    success: true,
                    data: result,
                    message: 'Token refreshed successfully'
                });
            }
            catch (error) {
                res.status(401).json({
                    success: false,
                    message: error instanceof Error ? error.message : 'Token refresh failed'
                });
            }
        };
        /**
         * Logout user (client-side token removal)
         * POST /api/auth/logout
         */
        this.logout = async (_req, res) => {
            // In JWT-based authentication, logout is handled client-side
            // by removing the token from storage
            res.status(200).json({
                success: true,
                message: 'Logout successful'
            });
        };
        this.authService = new AuthService_1.AuthService();
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map