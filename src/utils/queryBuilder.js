/**
 * Query Builder Utility
 * Helper functions for building and validating LinkedIn API queries
 */

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
        limit: normalized.limit || '10',
        page: normalized.page || '0',
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
    const validSalaries = ['40000', '60000', '80000', '100000', '120000'];
    if (query.salary && !validSalaries.includes(query.salary)) {
        errors.push(`Invalid salary. Must be one of: ${validSalaries.join(', ')}`);
    }

    // Validate experience level
    const validExperiences = ['internship', 'entry level', 'associate', 'senior', 'director', 'executive'];
    if (query.experienceLevel && !validExperiences.includes(query.experienceLevel)) {
        errors.push(`Invalid experienceLevel. Must be one of: ${validExperiences.join(', ')}`);
    }

    // Validate job type
    const validJobTypes = ['full time', 'part time', 'contract', 'temporary', 'volunteer', 'internship'];
    if (query.jobType && !validJobTypes.includes(query.jobType)) {
        errors.push(`Invalid jobType. Must be one of: ${validJobTypes.join(', ')}`);
    }

    // Validate remote filter
    const validRemoteFilters = ['on site', 'remote', 'hybrid'];
    if (query.remoteFilter && !validRemoteFilters.includes(query.remoteFilter)) {
        errors.push(`Invalid remoteFilter. Must be one of: ${validRemoteFilters.join(', ')}`);
    }

    // Validate date since posted
    const validDates = ['past month', 'past week', '24hr'];
    if (query.dateSincePosted && !validDates.includes(query.dateSincePosted)) {
        errors.push(`Invalid dateSincePosted. Must be one of: ${validDates.join(', ')}`);
    }

    // Validate sort by
    const validSortBy = ['recent', 'relevant'];
    if (query.sortBy && !validSortBy.includes(query.sortBy)) {
        errors.push(`Invalid sortBy. Must be one of: ${validSortBy.join(', ')}`);
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
