/**
 * Jobs Routes
 * API routes for LinkedIn job search operations
 */

const express = require('express');
const router = express.Router();
const jobsController = require('../controllers/jobs.controller');
const { cacheMiddleware } = require('../middleware');

// Main search endpoint with caching
router.post('/search', cacheMiddleware(), jobsController.searchJobs);

// Advanced search endpoint
router.post('/advanced-search', cacheMiddleware(), jobsController.advancedSearch);

// Recent jobs endpoint
router.get('/recent', cacheMiddleware(), jobsController.getRecentJobs);

// Search by experience level
router.post('/by-experience', cacheMiddleware(), jobsController.searchByExperience);

// Search by salary range
router.post('/by-salary', cacheMiddleware(), jobsController.searchBySalary);

// Remote jobs search
router.post('/remote', cacheMiddleware(), jobsController.searchRemoteJobs);

// Paginated search
router.post('/paginated', cacheMiddleware(), jobsController.paginatedSearch);

module.exports = router;
