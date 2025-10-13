/**
 * GEO (Generative Engine Optimization) Routes
 * API routes for GEO monitoring and analytics
 */

const express = require('express');
const router = express.Router();
const geoController = require('../controllers/geo.controller');

// Get GEO statistics
router.get('/stats', geoController.getStats);

// Get optimization recommendations
router.get('/recommendations', geoController.getRecommendations);

// Reset GEO statistics (admin only)
router.post('/reset', geoController.resetStats);

module.exports = router;
