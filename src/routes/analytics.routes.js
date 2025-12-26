/**
 * Analytics Routes
 * Market analysis endpoints
 */

const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');

// Salary distribution analysis
router.post('/salary', analyticsController.getSalaryAnalysis);

// Skills extraction
router.post('/skills', analyticsController.getSkillsAnalysis);

// Location analysis
router.post('/location', analyticsController.getLocationAnalysis);

// Experience level analysis
router.post('/experience', analyticsController.getExperienceAnalysis);

// Comprehensive analytics (all in one)
router.post('/comprehensive', analyticsController.getComprehensiveAnalytics);

module.exports = router;
