/**
 * GEO (Generative Engine Optimization) Monitoring Middleware
 * Tracks AI crawler activity, referral patterns, and search analytics
 */

const { APP_CONFIG } = require('../config');
const logger = require('../utils/logger');

class GEOMonitoring {
    constructor() {
        this.aiReferrers = APP_CONFIG.AI_REFERRERS;
        this.stats = {
            totalRequests: 0,
            aiRequests: 0,
            searchRequests: 0,
            lastReset: new Date()
        };
    }

    /**
     * Log and analyze incoming requests
     */
    logRequest(req, type = 'general') {
        const userAgent = req.get('User-Agent') || '';
        const referrer = req.get('Referer') || '';
        const timestamp = new Date().toISOString();
        const ip = req.ip || req.connection.remoteAddress;

        // Detect AI referrers
        const isAIReferrer = this.aiReferrers.some(ai =>
            userAgent.toLowerCase().includes(ai.toLowerCase()) ||
            referrer.toLowerCase().includes(ai.toLowerCase())
        );

        // Extract UTM parameters for AI attribution tracking
        const utmSource = req.query.utm_source;
        const utmMedium = req.query.utm_medium;
        const utmCampaign = req.query.utm_campaign;

        const logEntry = {
            timestamp,
            type,
            ip,
            userAgent,
            referrer,
            isAIReferrer,
            utmSource,
            utmMedium,
            utmCampaign,
            path: req.path,
            query: req.query
        };

        // Update statistics
        this.stats.totalRequests++;
        if (isAIReferrer) {
            this.stats.aiRequests++;
        }
        if (type === 'job_search') {
            this.stats.searchRequests++;
        }

        // Log using centralized logger
        logger.debug('GEO Monitoring', logEntry);

        return logEntry;
    }

    /**
     * Analyze search patterns
     */
    analyzeSearchPattern(requestBody) {
        return {
            hasKeyword: !!requestBody.keyword,
            hasLocation: !!requestBody.location,
            hasSalaryFilter: !!requestBody.salary,
            hasExperienceFilter: !!requestBody.experienceLevel,
            hasRemoteFilter: !!requestBody.remoteFilter,
            hasAdvancedFilters: requestBody.has_verification || requestBody.under_10_applicants,
            isAdvancedSearch: Object.keys(requestBody).length > 2,
            searchComplexity: Object.keys(requestBody).filter(key => requestBody[key]).length
        };
    }

    /**
     * Get current statistics
     */
    getStats() {
        return {
            ...this.stats,
            aiPercentage: this.stats.totalRequests > 0
                ? ((this.stats.aiRequests / this.stats.totalRequests) * 100).toFixed(2) + '%'
                : '0%',
            uptime: Date.now() - this.stats.lastReset.getTime()
        };
    }

    /**
     * Reset statistics
     */
    resetStats() {
        this.stats = {
            totalRequests: 0,
            aiRequests: 0,
            searchRequests: 0,
            lastReset: new Date()
        };
    }

    /**
     * Express middleware function
     */
    middleware() {
        return (req, res, next) => {
            // Attach GEO monitoring instance to request
            req.geoMonitoring = this;
            next();
        };
    }
}

// Create singleton instance
const geoMonitoring = new GEOMonitoring();

module.exports = geoMonitoring;
