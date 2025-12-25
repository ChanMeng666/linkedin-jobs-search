/**
 * LinkedIn Jobs Service
 * Business logic layer for LinkedIn job search operations
 */

const linkedIn = require('linkedin-jobs-api');
const { APP_CONFIG } = require('../config');
const logger = require('../utils/logger');

class LinkedInService {
    /**
     * Query LinkedIn jobs with given options
     */
    async searchJobs(queryOptions) {
        try {
            // Set defaults
            const options = {
                limit: APP_CONFIG.LINKEDIN_DEFAULTS.LIMIT,
                page: APP_CONFIG.LINKEDIN_DEFAULTS.PAGE,
                ...queryOptions
            };

            // Remove empty values
            Object.keys(options).forEach(key => {
                if (!options[key] && options[key] !== false) {
                    delete options[key];
                }
            });

            logger.debug('LinkedIn API Query', { options });

            // Execute search
            const jobs = await linkedIn.query(options);

            return {
                success: true,
                count: jobs.length,
                jobs,
                searchParams: options
            };
        } catch (error) {
            logger.error('LinkedIn API Error', { error: error.message });
            throw new Error(`LinkedIn API request failed: ${error.message}`);
        }
    }

    /**
     * Build query options from request parameters
     */
    buildQueryOptions(params) {
        const {
            keyword,
            location,
            dateSincePosted,
            jobType,
            remoteFilter,
            salary,
            experienceLevel,
            sortBy,
            limit,
            page,
            has_verification,
            under_10_applicants
        } = params;

        return {
            keyword,
            location,
            dateSincePosted,
            jobType,
            remoteFilter,
            salary,
            experienceLevel,
            sortBy,
            limit: limit || APP_CONFIG.LINKEDIN_DEFAULTS.LIMIT,
            page: page || APP_CONFIG.LINKEDIN_DEFAULTS.PAGE,
            has_verification: has_verification === true || has_verification === 'true',
            under_10_applicants: under_10_applicants === true || under_10_applicants === 'true'
        };
    }

    /**
     * Search jobs with advanced filters
     */
    async advancedSearch(params) {
        const queryOptions = this.buildQueryOptions(params);
        return await this.searchJobs(queryOptions);
    }

    /**
     * Get recent jobs (24 hours)
     */
    async getRecentJobs(limit = '20') {
        return await this.searchJobs({
            dateSincePosted: '24hr',
            sortBy: 'recent',
            limit
        });
    }

    /**
     * Search remote jobs
     */
    async searchRemoteJobs(keyword, limit = '20') {
        return await this.searchJobs({
            keyword,
            remoteFilter: 'remote',
            limit
        });
    }

    /**
     * Search by experience level
     */
    async searchByExperience(keyword, experienceLevel, limit = '20') {
        return await this.searchJobs({
            keyword,
            experienceLevel,
            limit
        });
    }

    /**
     * Search by salary range
     */
    async searchBySalary(keyword, salary, limit = '20') {
        return await this.searchJobs({
            keyword,
            salary,
            limit
        });
    }
}

// Create singleton instance
const linkedInService = new LinkedInService();

module.exports = linkedInService;
