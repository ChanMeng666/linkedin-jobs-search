/**
 * Query Builder Utility
 * Helper functions for building and validating LinkedIn API queries
 */

const { VALIDATION, LINKEDIN_DEFAULTS } = require('../config/constants');

/**
 * Remove empty or falsy values from object
 */
const removeEmptyValues = (obj) => {
    const cleaned = {};
    Object.keys(obj).forEach(key => {
        // Keep false boolean values, but remove other falsy values
        if (obj[key] || obj[key] === false) {
            cleaned[key] = obj[key];
        }
    });
    return cleaned;
};

/**
 * Normalize boolean parameters
 */
const normalizeBooleans = (params, booleanFields) => {
    const normalized = { ...params };
    booleanFields.forEach(field => {
        if (normalized[field] !== undefined) {
            normalized[field] = normalized[field] === true || normalized[field] === 'true';
        }
    });
    return normalized;
};

/**
 * Build LinkedIn query options from request parameters
 */
const buildLinkedInQuery = (params) => {
    // Normalize boolean fields
    const normalized = normalizeBooleans(params, ['has_verification', 'under_10_applicants']);

    // Build query object
    const query = {
        keyword: normalized.keyword,
        location: normalized.location,
        dateSincePosted: normalized.dateSincePosted,
        jobType: normalized.jobType,
        remoteFilter: normalized.remoteFilter,
        salary: normalized.salary,
        experienceLevel: normalized.experienceLevel,
        sortBy: normalized.sortBy,
        limit: normalized.limit || LINKEDIN_DEFAULTS.LIMIT,
        page: normalized.page || LINKEDIN_DEFAULTS.PAGE,
        has_verification: normalized.has_verification,
        under_10_applicants: normalized.under_10_applicants
    };

    // Remove empty values
    return removeEmptyValues(query);
};

/**
 * Parse pagination parameters
 */
const parsePagination = (page, limit) => {
    const parsedPage = parseInt(page) || 0;
    const parsedLimit = parseInt(limit) || 10;

    return {
        page: Math.max(0, parsedPage).toString(),
        limit: Math.min(Math.max(1, parsedLimit), 100).toString() // Max 100 results
    };
};

/**
 * Validate query parameters
 */
const validateQuery = (query) => {
    const errors = [];

    // Validate salary
    if (query.salary && !VALIDATION.SALARIES.includes(query.salary)) {
        errors.push(`Invalid salary. Must be one of: ${VALIDATION.SALARIES.join(', ')}`);
    }

    // Validate experience level
    if (query.experienceLevel && !VALIDATION.EXPERIENCE_LEVELS.includes(query.experienceLevel)) {
        errors.push(`Invalid experienceLevel. Must be one of: ${VALIDATION.EXPERIENCE_LEVELS.join(', ')}`);
    }

    // Validate job type
    if (query.jobType && !VALIDATION.JOB_TYPES.includes(query.jobType)) {
        errors.push(`Invalid jobType. Must be one of: ${VALIDATION.JOB_TYPES.join(', ')}`);
    }

    // Validate remote filter
    if (query.remoteFilter && !VALIDATION.REMOTE_FILTERS.includes(query.remoteFilter)) {
        errors.push(`Invalid remoteFilter. Must be one of: ${VALIDATION.REMOTE_FILTERS.join(', ')}`);
    }

    // Validate date since posted
    if (query.dateSincePosted && !VALIDATION.DATE_FILTERS.includes(query.dateSincePosted)) {
        errors.push(`Invalid dateSincePosted. Must be one of: ${VALIDATION.DATE_FILTERS.join(', ')}`);
    }

    // Validate sort by
    if (query.sortBy && !VALIDATION.SORT_OPTIONS.includes(query.sortBy)) {
        errors.push(`Invalid sortBy. Must be one of: ${VALIDATION.SORT_OPTIONS.join(', ')}`);
    }

    return errors;
};

module.exports = {
    removeEmptyValues,
    normalizeBooleans,
    buildLinkedInQuery,
    parsePagination,
    validateQuery
};
