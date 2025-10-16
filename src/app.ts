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

import express from 'express';
import cors from 'cors';
import path from 'path';
import routes from './routes';

const app = express();

// Middleware configuration

// CORS (Cross-Origin Resource Sharing) allows our frontend to make requests to our API
// In production, you should configure specific origins instead of allowing all
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Parse JSON request bodies
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// API routes
app.use('/api', routes);

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
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// 404 handler for undefined routes
app.use('*', (_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
app.use((error: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', error);
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

export default app;
