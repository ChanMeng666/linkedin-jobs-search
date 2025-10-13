/**
 * GEO Controller
 * Handles HTTP requests for GEO monitoring and analytics
 */

const geoService = require('../services/geo.service');
const geoMonitoring = require('../middleware/geoMonitoring');
const { asyncHandler } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

/**
 * Get GEO statistics
 * GET /api/geo/stats
 */
const getStats = asyncHandler(async (req, res) => {
    geoMonitoring.logRequest(req, 'geo_stats_access');

    const stats = geoService.getStatistics();

    logger.info('GEO stats accessed', {
        totalRequests: stats.statistics.totalRequests,
        aiPercentage: stats.statistics.aiPercentage
    });

    res.json(stats);
});

/**
 * Get optimization recommendations
 * GET /api/geo/recommendations
 */
const getRecommendations = asyncHandler(async (req, res) => {
    geoMonitoring.logRequest(req, 'geo_recommendations');

    const recommendations = geoService.getOptimizationRecommendations();

    logger.info('GEO recommendations accessed');

    res.json(recommendations);
});

/**
 * Reset GEO statistics (admin operation)
 * POST /api/geo/reset
 */
const resetStats = asyncHandler(async (req, res) => {
    geoMonitoring.logRequest(req, 'geo_stats_reset');

    // TODO: Add authentication/authorization check for admin users
    const result = geoService.resetStatistics();

    logger.warn('GEO statistics reset', {
        resetBy: req.ip,
        timestamp: result.resetAt
    });

    res.json(result);
});

module.exports = {
    getStats,
    getRecommendations,
    resetStats
};
