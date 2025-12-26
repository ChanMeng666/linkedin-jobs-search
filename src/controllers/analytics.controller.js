/**
 * Analytics Controller
 * Handles market analysis operations
 */

const analyticsService = require('../services/analytics.service');
const { asyncHandler } = require('../middleware/errorHandler');
const { HTTP_STATUS } = require('../config');

/**
 * Get salary distribution analysis
 */
const getSalaryAnalysis = asyncHandler(async (req, res) => {
    const { jobs } = req.body;

    if (!jobs || !Array.isArray(jobs) || jobs.length === 0) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            error: 'No jobs data provided'
        });
    }

    const analysis = analyticsService.analyzeSalaries(jobs);
    res.json({ success: true, ...analysis });
});

/**
 * Get skills extraction
 */
const getSkillsAnalysis = asyncHandler(async (req, res) => {
    const { jobs } = req.body;

    if (!jobs || !Array.isArray(jobs) || jobs.length === 0) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            error: 'No jobs data provided'
        });
    }

    const skills = analyticsService.extractSkills(jobs);
    res.json({ success: true, skills, count: skills.length });
});

/**
 * Get location analysis
 */
const getLocationAnalysis = asyncHandler(async (req, res) => {
    const { jobs } = req.body;

    if (!jobs || !Array.isArray(jobs) || jobs.length === 0) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            error: 'No jobs data provided'
        });
    }

    const locations = analyticsService.analyzeLocations(jobs);
    res.json({ success: true, locations, count: locations.length });
});

/**
 * Get experience level analysis
 */
const getExperienceAnalysis = asyncHandler(async (req, res) => {
    const { jobs } = req.body;

    if (!jobs || !Array.isArray(jobs) || jobs.length === 0) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            error: 'No jobs data provided'
        });
    }

    const experienceLevels = analyticsService.analyzeExperienceLevels(jobs);
    res.json({ success: true, experienceLevels });
});

/**
 * Get comprehensive analytics
 */
const getComprehensiveAnalytics = asyncHandler(async (req, res) => {
    const { jobs } = req.body;

    if (!jobs || !Array.isArray(jobs) || jobs.length === 0) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            error: 'No jobs data provided'
        });
    }

    const analytics = analyticsService.getComprehensiveAnalytics(jobs);
    res.json(analytics);
});

module.exports = {
    getSalaryAnalysis,
    getSkillsAnalysis,
    getLocationAnalysis,
    getExperienceAnalysis,
    getComprehensiveAnalytics
};
