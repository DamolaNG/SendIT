/**
 * Authentication Service
 * 
 * This service handles all authentication-related operations:
 * - User registration and login
 * - JWT token generation and verification
 * - Password validation
 * 
 * JWT (JSON Web Tokens) are industry standard for authentication.
 * They contain user information and are cryptographically signed.
 */

import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User';
import { 
  User, 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  JWTPayload,
  UserRole 
} from '../types';

export class AuthService {
  private userModel: UserModel;
  private jwtSecret: string;
  private jwtExpiresIn: string;

  constructor() {
    this.userModel = new UserModel();
    // In production, these should come from environment variables
    this.jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '24h';
  }

  /**
   * Register a new user
   * @param userData - User registration data
   * @returns Promise<AuthResponse> - JWT token and user data
   */
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      // Create user in database
      const user = await this.userModel.createUser(userData);
      
      // Generate JWT token
      const token = this.generateToken(user.id, user.email, user.role);
      
      return {
        token,
        user
      };
    } catch (error) {
      // Re-throw with more context
      throw new Error(`Registration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Login user
   * @param loginData - Login credentials
   * @returns Promise<AuthResponse> - JWT token and user data
   */
  async login(loginData: LoginRequest): Promise<AuthResponse> {
    try {
      // Find user by email
      const user = await this.userModel.findByEmail(loginData.email);
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Verify password
      const isPasswordValid = await this.userModel.verifyPassword(
        loginData.password, 
        user.password
      );
      
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      // Generate JWT token
      const token = this.generateToken(user.id, user.email, user.role);
      
      // Return user data without password
      const { password, ...userWithoutPassword } = user;
      
      return {
        token,
        user: userWithoutPassword
      };
    } catch (error) {
      throw new Error(`Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate JWT token
   * @param userId - User ID
   * @param email - User email
   * @param role - User role
   * @returns string - JWT token
   */
  private generateToken(userId: string, email: string, role: UserRole): string {
    const payload: Omit<JWTPayload, 'iat' | 'exp'> = {
      userId,
      email,
      role
    };

    return jwt.sign(payload, this.jwtSecret, { expiresIn: this.jwtExpiresIn });
  }

  /**
   * Verify JWT token
   * @param token - JWT token
   * @returns Promise<JWTPayload> - Decoded token payload
   */
  async verifyToken(token: string): Promise<JWTPayload> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as JWTPayload;
      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Get user from token
   * @param token - JWT token
   * @returns Promise<User | null>
   */
  async getUserFromToken(token: string): Promise<User | null> {
    try {
      const payload = await this.verifyToken(token);
      const user = await this.userModel.findById(payload.userId);
      return user;
    } catch (error) {
      return null;
    }
  }

  /**
   * Check if user has admin role
   * @param token - JWT token
   * @returns Promise<boolean>
   */
  async isAdmin(token: string): Promise<boolean> {
    try {
      const payload = await this.verifyToken(token);
      return payload.role === UserRole.ADMIN;
    } catch (error) {
      return false;
    }
  }

  /**
   * Refresh token (generate new token with same user data)
   * @param token - Current JWT token
   * @returns Promise<AuthResponse>
   */
  async refreshToken(token: string): Promise<AuthResponse> {
    try {
      const user = await this.getUserFromToken(token);
      if (!user) {
        throw new Error('Invalid token');
      }

      const newToken = this.generateToken(user.id, user.email, user.role);
      const { password, ...userWithoutPassword } = user;

      return {
        token: newToken,
        user: userWithoutPassword
      };
    } catch (error) {
      throw new Error(`Token refresh failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
