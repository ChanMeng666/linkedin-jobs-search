/**
 * Health Controller
 * Handles HTTP requests for system health monitoring
 */

const axios = require('axios');
const geoMonitoring = require('../middleware/geoMonitoring');
const { getCacheStats } = require('../middleware/cacheMiddleware');
const { asyncHandler } = require('../middleware/errorHandler');
const { APP_CONFIG } = require('../config');
const logger = require('../utils/logger');

/**
 * Basic health check
 * GET /api
 */
const healthCheck = asyncHandler(async (req, res) => {
    geoMonitoring.logRequest(req, 'api_health_check');

    res.json({
        message: 'LinkedIn Jobs API Demo Server is running!',
        version: '2.0.0',
        timestamp: new Date().toISOString(),
        environment: APP_CONFIG.NODE_ENV,
        endpoints: {
            'POST /api/jobs/search': 'Main job search endpoint',
            'GET /api/geo/stats': 'GEO monitoring statistics',
            'GET /api/status': 'Detailed system status',
            'GET /llms.txt': 'AI guidance document',
            'GET /robots.txt': 'Crawler instructions'
        }
    });
});

/**
 * Detailed system status
 * GET /api/status
 */
const systemStatus = asyncHandler(async (req, res) => {
    geoMonitoring.logRequest(req, 'system_status');

    const geoStats = geoMonitoring.getStats();
    const cacheStats = getCacheStats();

    const status = {
        server: {
            status: 'healthy',
            uptime: process.uptime(),
            environment: APP_CONFIG.NODE_ENV,
            nodeVersion: process.version,
            platform: process.platform
        },
        memory: {
            used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
            total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB',
            external: Math.round(process.memoryUsage().external / 1024 / 1024) + ' MB'
        },
        geo: geoStats,
        cache: cacheStats,
        timestamp: new Date().toISOString()
    };

    logger.info('System status checked');

    res.json(status);
});

/**
 * LinkedIn page proxy
 * GET /api/proxy-linkedin?url=...
 */
const proxyLinkedIn = asyncHandler(async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({
            success: false,
            error: 'URL parameter is required'
        });
    }

    // Validate URL is from LinkedIn
    if (!url.startsWith('https://www.linkedin.com/')) {
        return res.status(400).json({
            success: false,
            error: 'Invalid URL - must be from linkedin.com'
        });
    }

    logger.info('Proxying LinkedIn URL', { url: url.substring(0, 50) });

    const response = await axios.get(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 10000 // 10 second timeout
    });

    res.send(response.data);
});

module.exports = {
    healthCheck,
    systemStatus,
    proxyLinkedIn
};
