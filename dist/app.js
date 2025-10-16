"use strict";
/**
 * Express Application Setup
 *
 * This file sets up the Express.js application with:
 * - Middleware configuration
 * - Route registration
 * - Error handling
 * - CORS configuration
 *
 * Express.js is a popular Node.js web framework that makes it easy to build APIs.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
// Middleware configuration
// CORS (Cross-Origin Resource Sharing) allows our frontend to make requests to our API
// In production, you should configure specific origins instead of allowing all
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
// Parse JSON request bodies
app.use(express_1.default.json({ limit: '10mb' }));
// Parse URL-encoded request bodies
app.use(express_1.default.urlencoded({ extended: true }));
// Serve static files from the public directory
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
// API routes
app.use('/api', routes_1.default);
// Health check endpoint
app.get('/health', (_req, res) => {
    res.json({
        success: true,
        message: 'SendIT API is running',
        timestamp: new Date().toISOString()
    });
});
// Root endpoint
app.get('/', (_req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../public/index.html'));
});
// 404 handler for undefined routes
app.use('*', (_req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});
// Global error handler
app.use((error, _req, res, _next) => {
    console.error('Error:', error);
    res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
});
exports.default = app;
//# sourceMappingURL=app.js.map