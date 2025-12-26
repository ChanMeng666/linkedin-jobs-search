/**
 * Middleware Index
 * Central export point for all middleware
 */

const geoMonitoring = require('./geoMonitoring');
const { cacheMiddleware, clearCache, getCacheStats } = require('./cacheMiddleware');
const {
    notFoundHandler,
    errorHandler,
    asyncHandler,
    validationErrorHandler
} = require('./errorHandler');
const { securityMiddleware, additionalSecurityHeaders } = require('./security');
const { verifyJWT, verifyWithStackAPI, optionalAuth, extractToken } = require('./auth.middleware');

module.exports = {
    // Security
    securityMiddleware,
    additionalSecurityHeaders,

    // GEO Monitoring
    geoMonitoring,

    // Cache Middleware
    cacheMiddleware,
    clearCache,
    getCacheStats,

    // Error Handlers
    notFoundHandler,
    errorHandler,
    asyncHandler,
    validationErrorHandler,

    // Auth Middleware
    verifyJWT,
    verifyWithStackAPI,
    optionalAuth,
    extractToken
};
