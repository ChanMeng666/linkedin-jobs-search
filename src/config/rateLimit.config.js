/**
 * Rate Limiting Configuration
 * Express rate limiter settings to prevent abuse
 */

const rateLimit = require('express-rate-limit');

// Rate limiter: 100 requests per 15-minute window per IP
const limiterConfig = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
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
