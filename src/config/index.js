/**
 * Configuration Index
 * Central export point for all application configurations
 */

const corsOptions = require('./cors.config');
const cache = require('./cache.config');
const limiter = require('./rateLimit.config');

// Application-wide constants
const APP_CONFIG = {
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    API_PREFIX: '/api',

    // LinkedIn API defaults
    LINKEDIN_DEFAULTS: {
        LIMIT: '10',
        PAGE: '0'
    },

    // GEO Monitoring
    AI_REFERRERS: ['ChatGPT', 'Claude', 'Perplexity', 'Copilot', 'Bard', 'GPT', 'Gemini']
};

module.exports = {
    corsOptions,
    cache,
    limiter,
    APP_CONFIG
};
