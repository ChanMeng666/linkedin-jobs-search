/**
 * Application Constants
 * Centralized configuration values for the application
 */

// Timing constants (in milliseconds unless specified)
const TIMING = {
    CACHE_TTL: 3600,              // 1 hour in seconds
    CACHE_CHECK_PERIOD: 600,      // 10 minutes in seconds
    RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
    GRACEFUL_SHUTDOWN_TIMEOUT: 10000   // 10 seconds
};

// Rate limiting configuration
const RATE_LIMITS = {
    MAX_REQUESTS: 100,
    WINDOW_MS: TIMING.RATE_LIMIT_WINDOW
};

// LinkedIn API defaults
const LINKEDIN_DEFAULTS = {
    LIMIT: '10',
    PAGE: '0',
    MAX_LIMIT: 100
};

// Validation options for LinkedIn API parameters
const VALIDATION = {
    SALARIES: ['40000', '60000', '80000', '100000', '120000'],
    EXPERIENCE_LEVELS: ['internship', 'entry level', 'associate', 'senior', 'director', 'executive'],
    JOB_TYPES: ['full time', 'part time', 'contract', 'temporary', 'volunteer', 'internship'],
    REMOTE_FILTERS: ['on site', 'remote', 'hybrid'],
    DATE_FILTERS: ['past month', 'past week', '24hr'],
    SORT_OPTIONS: ['recent', 'relevant']
};

// GEO Monitoring configuration
const GEO_MONITORING = {
    AI_REFERRERS: ['ChatGPT', 'Claude', 'Perplexity', 'Copilot', 'Bard', 'GPT', 'Gemini']
};

// HTTP status codes
const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503
};

module.exports = {
    TIMING,
    RATE_LIMITS,
    LINKEDIN_DEFAULTS,
    VALIDATION,
    GEO_MONITORING,
    HTTP_STATUS
};
