/**
 * Authentication Middleware
 * 
 * Middleware functions are functions that run between the request and response.
 * They're used for:
 * - Authentication (checking if user is logged in)
 * - Authorization (checking if user has permission)
 * - Logging, rate limiting, etc.
 * 
 * In Express.js, middleware functions have access to:
 * - req (request object)
 * - res (response object) 
 * - next (function to call next middleware)
 */

import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';
import { JWTPayload } from '../types';

// Extend Express Request interface to include user data
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export class AuthMiddleware {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Middleware to authenticate JWT token
   * This middleware checks if the user is logged in
   */
  authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Get token from Authorization header
      // Format: "Bearer <token>"
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
          success: false,
          message: 'Access denied. No token provided.'
        });
        return;
      }

      // Extract token from header
      const token = authHeader.substring(7); // Remove "Bearer " prefix

      // Verify token
      const payload = await this.authService.verifyToken(token);
      
      // Add user info to request object
      req.user = payload;
      
      // Call next middleware
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
  };

  /**
   * Middleware to check if user is admin
   * This middleware should be used after authenticate middleware
   */
  requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    if (req.user.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
      return;
    }

    next();
  };

  /**
   * Optional authentication middleware
   * This middleware doesn't fail if no token is provided
   * Useful for endpoints that work for both authenticated and anonymous users
   */
  optionalAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const payload = await this.authService.verifyToken(token);
        req.user = payload;
      }
      
      next();
    } catch (error) {
      // Continue without authentication
      next();
    }
  };

  /**
   * Middleware to check if user owns the resource
   * This ensures users can only access their own data
   */
  requireOwnership = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    // Check if user is trying to access their own resource
    const resourceUserId = req.params.userId || req.body.userId;
    
    if (req.user.role === 'admin') {
      // Admins can access any resource
      next();
      return;
    }

    if (req.user.userId !== resourceUserId) {
      res.status(403).json({
        success: false,
        message: 'Access denied. You can only access your own resources.'
      });
      return;
    }

    next();
  };
}
