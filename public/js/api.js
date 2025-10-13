/**
 * API Client
 * Handles all API communication with the backend
 */

const API = {
    baseURL: '/api',

    /**
     * Search jobs
     */
    async searchJobs(params) {
        try {
            const response = await fetch(`${this.baseURL}/jobs/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(params)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    /**
     * Get health check
     */
    async healthCheck() {
        try {
            const response = await fetch(`${this.baseURL}`);
            return await response.json();
        } catch (error) {
            console.error('Health check error:', error);
            throw error;
        }
    },

    /**
     * Get GEO statistics
     */
    async getGEOStats() {
        try {
            const response = await fetch(`${this.baseURL}/geo/stats`);
            return await response.json();
        } catch (error) {
            console.error('GEO stats error:', error);
            throw error;
        }
    }
};
