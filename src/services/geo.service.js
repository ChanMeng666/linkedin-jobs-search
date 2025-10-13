/**
 * GEO (Generative Engine Optimization) Service
 * Business logic for GEO monitoring and analytics
 */

const geoMonitoring = require('../middleware/geoMonitoring');

class GEOService {
    /**
     * Get GEO statistics and insights
     */
    getStatistics() {
        const stats = geoMonitoring.getStats();

        return {
            message: 'GEO Monitoring Statistics',
            description: 'Insights into AI crawler activity and referral patterns',
            implementation: 'Basic monitoring - upgrade to analytics service for production',
            statistics: stats,
            kpis: {
                'AI Referrer Detection': 'Tracks known AI user agents and referrers',
                'UTM Parameter Tracking': 'Monitors utm_source, utm_medium, utm_campaign',
                'Search Pattern Analysis': 'Analyzes job search query patterns',
                'Response Time Monitoring': 'Tracks API performance metrics'
            },
            setup_instructions: {
                'Step 1': 'Add UTM parameters to AI-generated links: ?utm_source=chatgpt&utm_medium=ai_referral&utm_campaign=job_search',
                'Step 2': 'Monitor server logs for AI referrer patterns',
                'Step 3': 'Set up analytics dashboard for comprehensive tracking',
                'Step 4': 'Implement A/B testing for different AI instructions'
            },
            aiReferrers: geoMonitoring.aiReferrers
        };
    }

    /**
     * Analyze search patterns and provide insights
     */
    analyzeSearchBehavior(searchHistory) {
        // This would typically analyze historical data
        // For now, we'll return basic insights
        return {
            mostSearchedKeywords: [],
            popularLocations: [],
            preferredSalaryRanges: [],
            commonExperienceLevels: [],
            remoteWorkTrend: 'N/A',
            aiGeneratedSearchesRatio: geoMonitoring.getStats().aiPercentage
        };
    }

    /**
     * Get recommendations for GEO optimization
     */
    getOptimizationRecommendations() {
        const stats = geoMonitoring.getStats();

        const recommendations = [];

        // AI traffic recommendations
        if (stats.totalRequests > 100 && parseFloat(stats.aiPercentage) < 10) {
            recommendations.push({
                category: 'AI Visibility',
                priority: 'High',
                suggestion: 'Consider enhancing AI-friendly metadata and structured data to increase AI referral traffic'
            });
        }

        // Search complexity recommendations
        recommendations.push({
            category: 'User Experience',
            priority: 'Medium',
            suggestion: 'Add more guided search templates to help users leverage advanced filters'
        });

        // Monitoring recommendations
        if (stats.totalRequests > 1000) {
            recommendations.push({
                category: 'Analytics',
                priority: 'High',
                suggestion: 'Upgrade to professional analytics service for detailed insights and reporting'
            });
        }

        return {
            recommendations,
            currentStats: stats,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Reset GEO statistics
     */
    resetStatistics() {
        geoMonitoring.resetStats();
        return {
            success: true,
            message: 'GEO statistics have been reset',
            resetAt: new Date().toISOString()
        };
    }
}

// Create singleton instance
const geoService = new GEOService();

module.exports = geoService;
