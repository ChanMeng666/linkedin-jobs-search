/**
 * Configuration Index
 * Central export point for all application configurations
 */

const corsOptions = require('./cors.config');
const cache = require('./cache.config');
const limiter = require('./rateLimit.config');
const constants = require('./constants');

// Load auth config with error handling
let STACK_AUTH_CONFIG;
try {
    const authConfig = require('./auth.config');
    STACK_AUTH_CONFIG = authConfig.STACK_AUTH_CONFIG;
    console.log('[Config] Stack Auth config loaded successfully');
} catch (error) {
    console.error('[Config] Failed to load auth.config:', error.message);
    // Provide fallback config
    STACK_AUTH_CONFIG = {
        projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID || 'cb93ee14-b9ed-4eb7-8dfa-ddf75f342fe5',
        publishableKey: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY,
        secretKey: process.env.STACK_SECRET_SERVER_KEY,
        apiUrl: 'https://api.stack-auth.com/api/v1',
        providers: ['github', 'google'],
        urls: {
            login: '/login.html',
            callback: '/auth-callback.html',
            dashboard: '/dashboard.html',
            afterLogout: '/'
        },
        isConfigured: !!process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY
    };
}

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
    STACK_AUTH_CONFIG,
    ...constants
};
