/**
 * Routes Index
 * Central export point for all API routes
 */

const jobsRoutes = require('./jobs.routes');
const geoRoutes = require('./geo.routes');
const healthRoutes = require('./health.routes');
const authRoutes = require('./auth.routes');
const oauthRoutes = require('./oauth.routes');
const userRoutes = require('./user.routes');
const exportRoutes = require('./export.routes');
const analyticsRoutes = require('./analytics.routes');
const cacheRoutes = require('./cache.routes');

module.exports = {
    jobsRoutes,
    geoRoutes,
    healthRoutes,
    authRoutes,
    oauthRoutes,
    userRoutes,
    exportRoutes,
    analyticsRoutes,
    cacheRoutes
};
