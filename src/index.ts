/**
 * Server Entry Point
 * 
 * This is the main entry point for our application.
 * It starts the Express server and handles graceful shutdown.
 */

import app from './app';
import Database from './config/database';

const PORT = process.env.PORT || 3000;

// Initialize database connection
const db = Database.getInstance();

// Start the server
const server = app.listen(PORT, async () => {
  console.log(`🚀 SendIT API server is running on port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 API endpoints: http://localhost:${PORT}/api`);
  console.log(`📦 Frontend: http://localhost:${PORT}`);
  
  // Connect to MongoDB
  try {
    await db.connect();
    console.log(`🍃 MongoDB connected successfully`);
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    console.log('⚠️  Running without database (in-memory mode)');
  }
});

// Graceful shutdown handling
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await db.disconnect();
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await db.disconnect();
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
