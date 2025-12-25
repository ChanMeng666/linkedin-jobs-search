/**
 * Configuration Index
 * Central export point for all application configurations
 */

const corsOptions = require('./cors.config');
const cache = require('./cache.config');
const limiter = require('./rateLimit.config');
const constants = require('./constants');

// Application-wide configuration
const APP_CONFIG = {
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    API_PREFIX: '/api',

    // Re-export from constants for backward compatibility
    LINKEDIN_DEFAULTS: constants.LINKEDIN_DEFAULTS,
    AI_REFERRERS: constants.GEO_MONITORING.AI_REFERRERS
};

module.exports = {
    corsOptions,
    cache,
    limiter,
    APP_CONFIG,
    ...constants
};
