/**
 * Express Application Configuration
 * Modular MVC architecture with clean separation of concerns
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { corsOptions, limiter } = require('./config');
const { jobsRoutes, geoRoutes, healthRoutes } = require('./routes');
const { geoMonitoring, errorHandler, notFoundHandler, securityMiddleware, additionalSecurityHeaders } = require('./middleware');
const logger = require('./utils/logger');

const app = express();

// Trust proxy (for Vercel and other platforms)
app.set('trust proxy', 1);

// Security Middleware (helmet and additional headers)
app.use(securityMiddleware);
app.use(additionalSecurityHeaders);

// CORS Configuration
app.use(cors(corsOptions));

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Files
app.use(express.static('public'));

// GEO Monitoring Middleware (attach to all requests)
app.use(geoMonitoring.middleware());

// Rate Limiting (apply to all /api routes)
app.use('/api', limiter);

// Request Logging
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.logRequest(req, duration);
    });
    next();
});

// API Routes
app.use('/api', healthRoutes);              // Health check and system status
app.use('/api/jobs', jobsRoutes);           // Job search operations
app.use('/api/geo', geoRoutes);             // GEO monitoring and analytics

// 404 Handler
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

// Graceful Shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    logger.info('SIGINT received, shutting down gracefully');
    process.exit(0);
});

module.exports = app;