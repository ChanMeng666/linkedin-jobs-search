/**
 * Routes Index
 * Central export point for all API routes
 */

const jobsRoutes = require('./jobs.routes');
const geoRoutes = require('./geo.routes');
const healthRoutes = require('./health.routes');

module.exports = {
    jobsRoutes,
    geoRoutes,
    healthRoutes
};
