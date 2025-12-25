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
    validationErrorHandler
};
