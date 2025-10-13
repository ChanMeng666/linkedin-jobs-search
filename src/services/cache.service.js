/**
 * Cache Service
 * Business logic for cache operations
 */

const { cache } = require('../config');

class CacheService {
    /**
     * Get value from cache
     */
    get(key) {
        return cache.get(key);
    }

    /**
     * Set value in cache
     */
    set(key, value, ttl) {
        return cache.set(key, value, ttl);
    }

    /**
     * Delete value from cache
     */
    delete(key) {
        return cache.del(key);
    }

    /**
     * Clear all cache
     */
    flush() {
        return cache.flushAll();
    }

    /**
     * Get cache statistics
     */
    getStats() {
        return cache.getStats();
    }

    /**
     * Get all cache keys
     */
    getKeys() {
        return cache.keys();
    }

    /**
     * Clear cache by pattern
     */
    clearByPattern(pattern) {
        const keys = this.getKeys();
        const matchingKeys = keys.filter(key => key.includes(pattern));
        let deletedCount = 0;

        matchingKeys.forEach(key => {
            if (this.delete(key)) {
                deletedCount++;
            }
        });

        return {
            pattern,
            deletedCount,
            remainingKeys: keys.length - deletedCount
        };
    }

    /**
     * Generate cache key from request body
     */
    generateKey(data) {
        return JSON.stringify(data);
    }
}

// Create singleton instance
const cacheService = new CacheService();

module.exports = cacheService;
