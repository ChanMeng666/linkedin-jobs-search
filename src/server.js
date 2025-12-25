/**
 * Server Entry Point
 * Starts the Express application configured in app.js
 */

const app = require('./app');
const { APP_CONFIG, TIMING } = require('./config');
const logger = require('./utils/logger');

const PORT = APP_CONFIG.PORT;

// Start server
const server = app.listen(PORT, () => {
    logger.info(`Server started successfully`, {
        port: PORT,
        environment: APP_CONFIG.NODE_ENV,
        nodeVersion: process.version
    });

    console.log(`\n✨ LinkedIn Jobs Search Server`);
    console.log(`🚀 Server running at: http://localhost:${PORT}`);
    console.log(`📝 API endpoint: http://localhost:${PORT}/api`);
    console.log(`🔍 Search endpoint: http://localhost:${PORT}/api/jobs/search`);
    console.log(`📊 GEO stats: http://localhost:${PORT}/api/geo/stats`);
    console.log(`\n✅ Environment: ${APP_CONFIG.NODE_ENV}`);
    console.log(`✅ Node version: ${process.version}\n`);
});

// Handle server errors
server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        logger.error(`Port ${PORT} is already in use`);
        process.exit(1);
    } else {
        logger.error('Server error', { error: error.message });
        throw error;
    }
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
    logger.info(`${signal} received, closing server gracefully`);

    server.close(() => {
        logger.info('Server closed successfully');
        process.exit(0);
    });

    // Force close after timeout
    setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, TIMING.GRACEFUL_SHUTDOWN_TIMEOUT);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception', { error: error.message, stack: error.stack });
    gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection', { reason, promise });
});

module.exports = app;
