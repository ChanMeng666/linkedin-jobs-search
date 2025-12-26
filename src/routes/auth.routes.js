/**
 * Auth Routes
 * Authentication-related endpoints
 */

const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

// Log module loading
logger.info('[Auth Routes] Loading auth routes module...');

let authController;
let verifyWithStackAPI;

try {
    authController = require('../controllers/auth.controller');
    logger.info('[Auth Routes] Auth controller loaded successfully');
} catch (error) {
    logger.error('[Auth Routes] Failed to load auth controller', { error: error.message, stack: error.stack });
    authController = null;
}

try {
    const authMiddleware = require('../middleware/auth.middleware');
    verifyWithStackAPI = authMiddleware.verifyWithStackAPI;
    logger.info('[Auth Routes] Auth middleware loaded successfully');
} catch (error) {
    logger.error('[Auth Routes] Failed to load auth middleware', { error: error.message, stack: error.stack });
    verifyWithStackAPI = null;
}

// Get auth config for frontend (most critical - must always work)
router.get('/config', (req, res) => {
    logger.info('[Auth Routes] /config endpoint called');

    try {
        // Direct config access without controller dependency
        const { STACK_AUTH_CONFIG } = require('../config');

        logger.info('[Auth Routes] Config loaded', {
            hasProjectId: !!STACK_AUTH_CONFIG?.projectId,
            hasPublishableKey: !!STACK_AUTH_CONFIG?.publishableKey
        });

        res.json({
            success: true,
            config: {
                projectId: STACK_AUTH_CONFIG.projectId,
                publishableKey: STACK_AUTH_CONFIG.publishableKey,
                providers: STACK_AUTH_CONFIG.providers,
                urls: STACK_AUTH_CONFIG.urls
            }
        });
    } catch (error) {
        logger.error('[Auth Routes] /config endpoint error', {
            error: error.message,
            stack: error.stack
        });
        res.status(500).json({
            success: false,
            error: error.message,
            debug: {
                hasEnvProjectId: !!process.env.NEXT_PUBLIC_STACK_PROJECT_ID,
                hasEnvPublishableKey: !!process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY
            }
        });
    }
});

// Sync user after OAuth login (requires full API verification)
if (authController && verifyWithStackAPI) {
    router.post('/sync', verifyWithStackAPI, authController.syncUser);
} else {
    router.post('/sync', (req, res) => {
        res.status(503).json({
            success: false,
            error: 'Auth service not available',
            debug: {
                hasController: !!authController,
                hasMiddleware: !!verifyWithStackAPI
            }
        });
    });
}

// Verify token (lightweight check)
if (authController) {
    router.get('/verify', authController.verifyToken);
} else {
    router.get('/verify', (req, res) => {
        res.status(503).json({
            success: false,
            error: 'Auth service not available'
        });
    });
}

logger.info('[Auth Routes] Auth routes module loaded successfully');

module.exports = router;
