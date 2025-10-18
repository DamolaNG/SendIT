/**
 * Database Configuration
 *
 * This file handles MongoDB connection and configuration.
 * Uses Mongoose ODM for MongoDB integration.
 */
declare class Database {
    private static instance;
    private isConnected;
    private constructor();
    static getInstance(): Database;
    /**
     * Connect to MongoDB
     */
    connect(): Promise<void>;
    /**
     * Disconnect from MongoDB
     */
    disconnect(): Promise<void>;
    /**
     * Check if connected to MongoDB
     */
    isConnectedToDB(): boolean;
    /**
     * Get connection status
     */
    getConnectionStatus(): string;
}
export default Database;
//# sourceMappingURL=database.d.ts.map