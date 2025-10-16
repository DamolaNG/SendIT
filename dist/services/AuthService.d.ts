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
import { User, LoginRequest, RegisterRequest, AuthResponse, JWTPayload } from '../types';
export declare class AuthService {
    private userModel;
    private jwtSecret;
    constructor();
    /**
     * Register a new user
     * @param userData - User registration data
     * @returns Promise<AuthResponse> - JWT token and user data
     */
    register(userData: RegisterRequest): Promise<AuthResponse>;
    /**
     * Login user
     * @param loginData - Login credentials
     * @returns Promise<AuthResponse> - JWT token and user data
     */
    login(loginData: LoginRequest): Promise<AuthResponse>;
    /**
     * Generate JWT token
     * @param userId - User ID
     * @param email - User email
     * @param role - User role
     * @returns string - JWT token
     */
    private generateToken;
    /**
     * Verify JWT token
     * @param token - JWT token
     * @returns Promise<JWTPayload> - Decoded token payload
     */
    verifyToken(token: string): Promise<JWTPayload>;
    /**
     * Get user from token
     * @param token - JWT token
     * @returns Promise<User | null>
     */
    getUserFromToken(token: string): Promise<User | null>;
    /**
     * Check if user has admin role
     * @param token - JWT token
     * @returns Promise<boolean>
     */
    isAdmin(token: string): Promise<boolean>;
    /**
     * Refresh token (generate new token with same user data)
     * @param token - Current JWT token
     * @returns Promise<AuthResponse>
     */
    refreshToken(token: string): Promise<AuthResponse>;
}
//# sourceMappingURL=AuthService.d.ts.map