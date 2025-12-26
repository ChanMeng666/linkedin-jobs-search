/**
 * LinkedIn Jobs Service
 * Business logic layer for LinkedIn job search operations
 */

const linkedIn = require('linkedin-jobs-api');
const { APP_CONFIG, LINKEDIN_HOSTS } = require('../config');
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
            under_10_applicants,
            country
        } = params;

        // Get host from country code
        const hostConfig = country && LINKEDIN_HOSTS[country]
            ? LINKEDIN_HOSTS[country]
            : LINKEDIN_HOSTS['us'];

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
            under_10_applicants: under_10_applicants === true || under_10_applicants === 'true',
            host: hostConfig.host
        };
    }

    /**
     * Get available countries for multi-country search
     */
    getAvailableCountries() {
        return Object.entries(LINKEDIN_HOSTS).map(([code, config]) => ({
            code,
            name: config.name,
            flag: config.flag
        }));
    }

    /**
     * Search jobs across multiple countries
     */
    async searchMultipleCountries(params, countryCodes) {
        const results = await Promise.all(
            countryCodes.map(async (country) => {
                try {
                    const result = await this.searchJobs({
                        ...this.buildQueryOptions({ ...params, country })
                    });
                    return {
                        country,
                        countryName: LINKEDIN_HOSTS[country]?.name || country,
                        ...result
                    };
                } catch (error) {
                    logger.error(`Failed to search in ${country}`, { error: error.message });
                    return {
                        country,
                        countryName: LINKEDIN_HOSTS[country]?.name || country,
                        success: false,
                        error: error.message,
                        jobs: []
                    };
                }
            })
        );

        // Aggregate results
        const allJobs = results.flatMap(r =>
            r.jobs.map(job => ({ ...job, country: r.country, countryName: r.countryName }))
        );

        return {
            success: true,
            totalCount: allJobs.length,
            jobs: allJobs,
            byCountry: results.reduce((acc, r) => {
                acc[r.country] = {
                    name: r.countryName,
                    count: r.jobs?.length || 0,
                    jobs: r.jobs || []
                };
                return acc;
            }, {})
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
