/**
 * Cache Controller
 * Handles cache management operations
 */

const cacheService = require('../services/cache.service');
const { asyncHandler } = require('../middleware/errorHandler');
const { HTTP_STATUS } = require('../config');

/**
 * Get cache statistics
 * GET /api/cache/stats
 */
const getCacheStats = asyncHandler(async (req, res) => {
    const stats = cacheService.getStats();
    const keys = cacheService.getKeys();

    res.json({
        success: true,
        stats: {
            ...stats,
            size: keys.length,
            keys: keys.slice(0, 10) // Return first 10 keys for debugging
        }
    });
});

/**
 * Get cache size
 * GET /api/cache/size
 */
const getCacheSize = asyncHandler(async (req, res) => {
    const keys = cacheService.getKeys();

    res.json({
        success: true,
        size: keys.length
    });
});

/**
 * Clear all cache
 * POST /api/cache/clear
 * Requires authentication
 */
const clearCache = asyncHandler(async (req, res) => {
    const previousSize = cacheService.getKeys().length;
    cacheService.flush();

    res.json({
        success: true,
        message: 'Cache cleared successfully',
        clearedEntries: previousSize
    });
});

/**
 * Clear cache by pattern
 * POST /api/cache/clear-pattern
 * Requires authentication
 */
const clearCacheByPattern = asyncHandler(async (req, res) => {
    const { pattern } = req.body;

    if (!pattern) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            error: 'Pattern is required'
        });
    }

    const result = cacheService.clearByPattern(pattern);

    res.json({
        success: true,
        ...result
    });
});

module.exports = {
    getCacheStats,
    getCacheSize,
    clearCache,
    clearCacheByPattern
};
