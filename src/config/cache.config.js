/**
 * Cache Configuration
 * Node-cache settings for job search results caching
 */

const NodeCache = require('node-cache');
const { TIMING } = require('./constants');

const cacheConfig = {
    stdTTL: TIMING.CACHE_TTL,
    checkperiod: TIMING.CACHE_CHECK_PERIOD,
    useClones: true,
    deleteOnExpire: true
};

// Create and export cache instance
const cache = new NodeCache(cacheConfig);

module.exports = cache;
