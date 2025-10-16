/**
 * User Model
 *
 * This class handles user-related operations including:
 * - User creation and validation
 * - Password hashing and verification
 * - User data management
 *
 * In a real application, this would connect to a database like PostgreSQL or MongoDB.
 * For this example, we'll use in-memory storage.
 */
import { User, RegisterRequest } from '../types';
export declare class UserModel {
    private users;
    /**
     * Create a new user
     * @param userData - User registration data
     * @returns Promise<User> - Created user (without password)
     */
    createUser(userData: RegisterRequest): Promise<Omit<User, 'password'>>;
    /**
     * Find user by email
     * @param email - User's email
     * @returns Promise<User | null>
     */
    findByEmail(email: string): Promise<User | null>;
    /**
     * Find user by ID
     * @param id - User's ID
     * @returns Promise<User | null>
     */
    findById(id: string): Promise<User | null>;
    /**
     * Verify user password
     * @param password - Plain text password
     * @param hashedPassword - Hashed password from database
     * @returns Promise<boolean>
     */
    verifyPassword(password: string, hashedPassword: string): Promise<boolean>;
    /**
     * Update user information
     * @param id - User ID
     * @param updates - Partial user data to update
     * @returns Promise<User | null>
     */
    updateUser(id: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User | null>;
    /**
     * Get all users (admin only)
     * @returns Promise<User[]>
     */
    getAllUsers(): Promise<Omit<User, 'password'>[]>;
    /**
     * Delete user
     * @param id - User ID
     * @returns Promise<boolean>
     */
    deleteUser(id: string): Promise<boolean>;
}
//# sourceMappingURL=User.d.ts.map