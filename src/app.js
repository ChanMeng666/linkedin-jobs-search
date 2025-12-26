/**
 * Express Application Configuration
 * Modular MVC architecture with clean separation of concerns
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { corsOptions, limiter } = require('./config');
const { jobsRoutes, geoRoutes, healthRoutes, authRoutes, userRoutes, exportRoutes, analyticsRoutes } = require('./routes');
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

// Diagnostic endpoint (before other routes)
app.get('/api/debug/config', (req, res) => {
    try {
        const { STACK_AUTH_CONFIG } = require('./config');
        res.json({
            success: true,
            env: {
                NODE_ENV: process.env.NODE_ENV,
                hasDatabase: !!process.env.DATABASE_URL,
                hasStackProjectId: !!process.env.NEXT_PUBLIC_STACK_PROJECT_ID,
                hasStackPublishableKey: !!process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY,
                hasStackSecretKey: !!process.env.STACK_SECRET_SERVER_KEY,
                stackProjectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID || 'NOT SET'
            },
            config: {
                projectId: STACK_AUTH_CONFIG?.projectId,
                hasPublishableKey: !!STACK_AUTH_CONFIG?.publishableKey,
                isConfigured: STACK_AUTH_CONFIG?.isConfigured
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            stack: error.stack
        });
    }
});

// API Routes
app.use('/api', healthRoutes);              // Health check and system status
app.use('/api/jobs', jobsRoutes);           // Job search operations
app.use('/api/geo', geoRoutes);             // GEO monitoring and analytics
app.use('/api/auth', authRoutes);           // Authentication
app.use('/api/user', userRoutes);           // User data (protected)
app.use('/api/export', exportRoutes);       // Data export
app.use('/api/analytics', analyticsRoutes); // Market analytics

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