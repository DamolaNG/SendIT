"use strict";
/**
 * Database Configuration
 *
 * This file handles MongoDB connection and configuration.
 * Uses Mongoose ODM for MongoDB integration.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
class Database {
    constructor() {
        this.isConnected = false;
    }
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
    /**
     * Connect to MongoDB
     */
    async connect() {
        if (this.isConnected) {
            console.log('MongoDB already connected');
            return;
        }
        try {
            const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sendit_db';
            await mongoose_1.default.connect(mongoUri, {
                // Connection options for better performance and reliability
                maxPoolSize: 10, // Maintain up to 10 socket connections
                serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
                socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
                bufferCommands: false // Disable mongoose buffering
            });
            this.isConnected = true;
            console.log('✅ MongoDB connected successfully');
            // Handle connection events
            mongoose_1.default.connection.on('error', (error) => {
                console.error('❌ MongoDB connection error:', error);
                this.isConnected = false;
            });
            mongoose_1.default.connection.on('disconnected', () => {
                console.log('⚠️ MongoDB disconnected');
                this.isConnected = false;
            });
            mongoose_1.default.connection.on('reconnected', () => {
                console.log('🔄 MongoDB reconnected');
                this.isConnected = true;
            });
        }
        catch (error) {
            console.error('❌ MongoDB connection failed:', error);
            this.isConnected = false;
            throw error;
        }
    }
    /**
     * Disconnect from MongoDB
     */
    async disconnect() {
        if (!this.isConnected) {
            return;
        }
        try {
            await mongoose_1.default.disconnect();
            this.isConnected = false;
            console.log('✅ MongoDB disconnected successfully');
        }
        catch (error) {
            console.error('❌ Error disconnecting from MongoDB:', error);
            throw error;
        }
    }
    /**
     * Check if connected to MongoDB
     */
    isConnectedToDB() {
        return this.isConnected && mongoose_1.default.connection.readyState === 1;
    }
    /**
     * Get connection status
     */
    getConnectionStatus() {
        const states = {
            0: 'disconnected',
            1: 'connected',
            2: 'connecting',
            3: 'disconnecting'
        };
        return states[mongoose_1.default.connection.readyState] || 'unknown';
    }
}
exports.default = Database;
//# sourceMappingURL=database.js.map