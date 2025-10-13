/**
 * Logger Utility
 * Centralized logging with different log levels
 */

const LOG_LEVELS = {
    ERROR: 'ERROR',
    WARN: 'WARN',
    INFO: 'INFO',
    DEBUG: 'DEBUG'
};

const LOG_COLORS = {
    ERROR: '\x1b[31m', // Red
    WARN: '\x1b[33m',  // Yellow
    INFO: '\x1b[36m',  // Cyan
    DEBUG: '\x1b[35m', // Magenta
    RESET: '\x1b[0m'
};

class Logger {
    constructor() {
        this.level = process.env.LOG_LEVEL || 'INFO';
        this.enableColors = process.env.NODE_ENV !== 'production';
    }

    /**
     * Format log message
     */
    formatMessage(level, message, meta = {}) {
        const timestamp = new Date().toISOString();
        const color = this.enableColors ? LOG_COLORS[level] : '';
        const reset = this.enableColors ? LOG_COLORS.RESET : '';

        const baseMessage = `${color}[${timestamp}] [${level}]${reset} ${message}`;

        if (Object.keys(meta).length > 0) {
            return `${baseMessage}\n${JSON.stringify(meta, null, 2)}`;
        }

        return baseMessage;
    }

    /**
     * Check if log level should be logged
     */
    shouldLog(level) {
        const levels = Object.keys(LOG_LEVELS);
        const currentLevelIndex = levels.indexOf(this.level);
        const messageLevelIndex = levels.indexOf(level);
        return messageLevelIndex <= currentLevelIndex;
    }

    /**
     * Error log
     */
    error(message, meta = {}) {
        if (this.shouldLog(LOG_LEVELS.ERROR)) {
            console.error(this.formatMessage(LOG_LEVELS.ERROR, message, meta));
        }
    }

    /**
     * Warning log
     */
    warn(message, meta = {}) {
        if (this.shouldLog(LOG_LEVELS.WARN)) {
            console.warn(this.formatMessage(LOG_LEVELS.WARN, message, meta));
        }
    }

    /**
     * Info log
     */
    info(message, meta = {}) {
        if (this.shouldLog(LOG_LEVELS.INFO)) {
            console.log(this.formatMessage(LOG_LEVELS.INFO, message, meta));
        }
    }

    /**
     * Debug log
     */
    debug(message, meta = {}) {
        if (this.shouldLog(LOG_LEVELS.DEBUG)) {
            console.log(this.formatMessage(LOG_LEVELS.DEBUG, message, meta));
        }
    }

    /**
     * Log HTTP request
     */
    logRequest(req, duration) {
        const message = `${req.method} ${req.path} - ${duration}ms`;
        const meta = {
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            statusCode: req.statusCode
        };
        this.info(message, meta);
    }

    /**
     * Log API call
     */
    logAPICall(service, method, duration, success = true) {
        const message = `${service}.${method} - ${duration}ms`;
        if (success) {
            this.info(message, { success: true });
        } else {
            this.error(message, { success: false });
        }
    }

    /**
     * Log cache operation
     */
    logCache(operation, key, hit = true) {
        const message = `Cache ${operation}: ${hit ? 'HIT' : 'MISS'}`;
        this.debug(message, { key: key.substring(0, 50) });
    }
}

// Create singleton instance
const logger = new Logger();

module.exports = logger;
