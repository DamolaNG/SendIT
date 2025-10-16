"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const uuid_1 = require("uuid");
const types_1 = require("../types");
class UserModel {
    constructor() {
        this.users = new Map();
    }
    /**
     * Create a new user
     * @param userData - User registration data
     * @returns Promise<User> - Created user (without password)
     */
    async createUser(userData) {
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
            throw new Error('Invalid email format');
        }
        // Check if user already exists
        const existingUser = Array.from(this.users.values()).find(user => user.email === userData.email);
        if (existingUser) {
            throw new Error('User with this email already exists');
        }
        // Validate password strength
        if (userData.password.length < 8) {
            throw new Error('Password must be at least 8 characters long');
        }
        // Hash the password using bcrypt
        // bcrypt is a popular library for hashing passwords securely
        // It uses a salt to prevent rainbow table attacks
        const saltRounds = 12; // Higher number = more secure but slower
        const hashedPassword = await bcryptjs_1.default.hash(userData.password, saltRounds);
        // Create new user
        const newUser = {
            id: (0, uuid_1.v4)(), // Generate unique ID
            email: userData.email.toLowerCase(), // Normalize email
            password: hashedPassword,
            firstName: userData.firstName,
            lastName: userData.lastName,
            phone: userData.phone,
            role: types_1.UserRole.USER, // Default role is USER
            createdAt: new Date(),
            updatedAt: new Date()
        };
        // Store user in memory (in production, this would be saved to database)
        this.users.set(newUser.id, newUser);
        // Return user without password for security
        const { password, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
    }
    /**
     * Find user by email
     * @param email - User's email
     * @returns Promise<User | null>
     */
    async findByEmail(email) {
        const user = Array.from(this.users.values()).find(user => user.email === email.toLowerCase());
        return user || null;
    }
    /**
     * Find user by ID
     * @param id - User's ID
     * @returns Promise<User | null>
     */
    async findById(id) {
        return this.users.get(id) || null;
    }
    /**
     * Verify user password
     * @param password - Plain text password
     * @param hashedPassword - Hashed password from database
     * @returns Promise<boolean>
     */
    async verifyPassword(password, hashedPassword) {
        return await bcryptjs_1.default.compare(password, hashedPassword);
    }
    /**
     * Update user information
     * @param id - User ID
     * @param updates - Partial user data to update
     * @returns Promise<User | null>
     */
    async updateUser(id, updates) {
        const user = this.users.get(id);
        if (!user) {
            return null;
        }
        // Update user data
        const updatedUser = {
            ...user,
            ...updates,
            updatedAt: new Date()
        };
        this.users.set(id, updatedUser);
        return updatedUser;
    }
    /**
     * Get all users (admin only)
     * @returns Promise<User[]>
     */
    async getAllUsers() {
        return Array.from(this.users.values()).map(({ password, ...user }) => user);
    }
    /**
     * Delete user
     * @param id - User ID
     * @returns Promise<boolean>
     */
    async deleteUser(id) {
        return this.users.delete(id);
    }
}
exports.UserModel = UserModel;
//# sourceMappingURL=User.js.map