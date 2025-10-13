/**
 * Cache Configuration
 * Node-cache settings for job search results caching
 */

const NodeCache = require('node-cache');

// Cache TTL: 1 hour (3600 seconds)
const cacheConfig = {
    stdTTL: 3600,
    checkperiod: 600, // Check for expired keys every 10 minutes
    useClones: true,  // Clone objects when getting from cache
    deleteOnExpire: true
};

// Create and export cache instance
const cache = new NodeCache(cacheConfig);

module.exports = cache;
