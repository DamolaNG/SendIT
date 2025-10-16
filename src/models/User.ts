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

import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { User, UserRole, RegisterRequest } from '../types';

export class UserModel {
  private users: Map<string, User> = new Map();

  /**
   * Create a new user
   * @param userData - User registration data
   * @returns Promise<User> - Created user (without password)
   */
  async createUser(userData: RegisterRequest): Promise<Omit<User, 'password'>> {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      throw new Error('Invalid email format');
    }

    // Check if user already exists
    const existingUser = Array.from(this.users.values()).find(
      user => user.email === userData.email
    );
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
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    // Create new user
    const newUser: User = {
      id: uuidv4(), // Generate unique ID
      email: userData.email.toLowerCase(), // Normalize email
      password: hashedPassword,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      role: UserRole.USER, // Default role is USER
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
  async findByEmail(email: string): Promise<User | null> {
    const user = Array.from(this.users.values()).find(
      user => user.email === email.toLowerCase()
    );
    return user || null;
  }

  /**
   * Find user by ID
   * @param id - User's ID
   * @returns Promise<User | null>
   */
  async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  /**
   * Verify user password
   * @param password - Plain text password
   * @param hashedPassword - Hashed password from database
   * @returns Promise<boolean>
   */
  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  /**
   * Update user information
   * @param id - User ID
   * @param updates - Partial user data to update
   * @returns Promise<User | null>
   */
  async updateUser(id: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User | null> {
    const user = this.users.get(id);
    if (!user) {
      return null;
    }

    // Update user data
    const updatedUser: User = {
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
  async getAllUsers(): Promise<Omit<User, 'password'>[]> {
    return Array.from(this.users.values()).map(({ password, ...user }) => user);
  }

  /**
   * Delete user
   * @param id - User ID
   * @returns Promise<boolean>
   */
  async deleteUser(id: string): Promise<boolean> {
    return this.users.delete(id);
  }
}
