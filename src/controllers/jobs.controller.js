/**
 * Jobs Controller
 * Handles HTTP requests for job search operations
 */

const linkedInService = require('../services/linkedin.service');
const geoMonitoring = require('../middleware/geoMonitoring');
const { asyncHandler } = require('../middleware/errorHandler');
const { validateQuery } = require('../utils/queryBuilder');
const logger = require('../utils/logger');

/**
 * Main job search endpoint
 * POST /api/jobs/search
 */
const searchJobs = asyncHandler(async (req, res) => {
    const startTime = Date.now();

    // GEO Monitoring
    const geoLog = geoMonitoring.logRequest(req, 'job_search');

    // Analyze search pattern
    const searchAnalytics = geoMonitoring.analyzeSearchPattern(req.body);
    logger.info('Search request received', {
        geoLog,
        searchPattern: searchAnalytics
    });

    // Validate query parameters
    const queryOptions = linkedInService.buildQueryOptions(req.body);
    const validationErrors = validateQuery(queryOptions);

    if (validationErrors.length > 0) {
        logger.warn('Validation errors', { errors: validationErrors });
        return res.status(400).json({
            success: false,
            errors: validationErrors
        });
    }

    // Execute search
    const result = await linkedInService.searchJobs(queryOptions);

    // Log performance
    const duration = Date.now() - startTime;
    logger.logAPICall('LinkedInService', 'searchJobs', duration, result.success);

    res.json(result);
});

/**
 * Advanced search with all filters
 * POST /api/jobs/advanced-search
 */
const advancedSearch = asyncHandler(async (req, res) => {
    const startTime = Date.now();

    geoMonitoring.logRequest(req, 'advanced_search');

    const result = await linkedInService.advancedSearch(req.body);

    const duration = Date.now() - startTime;
    logger.logAPICall('LinkedInService', 'advancedSearch', duration, result.success);

    res.json(result);
});

/**
 * Get recent jobs (24 hours)
 * GET /api/jobs/recent
 */
const getRecentJobs = asyncHandler(async (req, res) => {
    geoMonitoring.logRequest(req, 'recent_jobs');

    const limit = req.query.limit || '20';
    const result = await linkedInService.getRecentJobs(limit);

    res.json(result);
});

/**
 * Search by experience level
 * POST /api/jobs/by-experience
 */
const searchByExperience = asyncHandler(async (req, res) => {
    const { keyword, experienceLevel } = req.body;

    if (!experienceLevel) {
        return res.status(400).json({
            success: false,
            error: 'experienceLevel is required'
        });
    }

    const result = await linkedInService.searchByExperience(keyword, experienceLevel);
    res.json(result);
});

/**
 * Search by salary range
 * POST /api/jobs/by-salary
 */
const searchBySalary = asyncHandler(async (req, res) => {
    const { keyword, salary } = req.body;

    if (!salary) {
        return res.status(400).json({
            success: false,
            error: 'salary is required'
        });
    }

    const result = await linkedInService.searchBySalary(keyword, salary);
    res.json(result);
});

/**
 * Search remote jobs
 * POST /api/jobs/remote
 */
const searchRemoteJobs = asyncHandler(async (req, res) => {
    const { keyword } = req.body;

    const result = await linkedInService.searchRemoteJobs(keyword);
    res.json(result);
});

/**
 * Paginated search
 * POST /api/jobs/paginated
 */
const paginatedSearch = asyncHandler(async (req, res) => {
    const result = await linkedInService.searchJobs(req.body);
    res.json(result);
});

module.exports = {
    searchJobs,
    advancedSearch,
    getRecentJobs,
    searchByExperience,
    searchBySalary,
    searchRemoteJobs,
    paginatedSearch
};
