/**
 * Cache Middleware
 * Handles caching of API responses to improve performance
 */

const { cache } = require('../config');

/**
 * Generate cache key from request
 */
const generateCacheKey = (req) => {
    // For POST requests, use request body
    if (req.method === 'POST') {
        return JSON.stringify(req.body);
    }
    // For GET requests, use full URL
    return req.originalUrl || req.url;
};

/**
 * Cache middleware for GET and POST requests
 */
const cacheMiddleware = (duration = 3600) => {
    return (req, res, next) => {
        // Only cache successful GET and POST requests
        if (req.method !== 'GET' && req.method !== 'POST') {
            return next();
        }

        const cacheKey = generateCacheKey(req);

        // Check if response is in cache
        const cachedResponse = cache.get(cacheKey);

        if (cachedResponse) {
            console.log(`Cache HIT: ${cacheKey.substring(0, 50)}...`);
            return res.json(cachedResponse);
        }

        console.log(`Cache MISS: ${cacheKey.substring(0, 50)}...`);

        // Store original res.json function
        const originalJson = res.json.bind(res);

        // Override res.json to cache the response
        res.json = (body) => {
            // Only cache successful responses
            if (res.statusCode >= 200 && res.statusCode < 300) {
                cache.set(cacheKey, body, duration);
                console.log(`Cached response with key: ${cacheKey.substring(0, 50)}...`);
            }
            return originalJson(body);
        };

        next();
    };
};

/**
 * Clear cache by pattern
 */
const clearCache = (pattern) => {
    if (!pattern) {
        cache.flushAll();
        console.log('All cache cleared');
        return;
    }

    const keys = cache.keys();
    const matchingKeys = keys.filter(key => key.includes(pattern));
    matchingKeys.forEach(key => cache.del(key));
    console.log(`Cleared ${matchingKeys.length} cache entries matching: ${pattern}`);
};

/**
 * Get cache statistics
 */
const getCacheStats = () => {
    return cache.getStats();
};

module.exports = {
    cacheMiddleware,
    clearCache,
    getCacheStats,
    cache
};
