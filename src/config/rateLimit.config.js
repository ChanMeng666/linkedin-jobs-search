/**
 * Rate Limiting Configuration
 * Express rate limiter settings to prevent abuse
 */

const rateLimit = require('express-rate-limit');
const { RATE_LIMITS } = require('./constants');

const limiterConfig = {
    windowMs: RATE_LIMITS.WINDOW_MS,
    max: RATE_LIMITS.MAX_REQUESTS,
    message: {
        success: false,
        error: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    skip: (req) => {
        // Skip rate limiting in development for testing
        return process.env.NODE_ENV === 'development' && req.ip === '::1';
    }
};

const limiter = rateLimit(limiterConfig);

module.exports = limiter;
