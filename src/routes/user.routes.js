/**
 * User Routes
 * Protected routes for user data operations
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyJWT } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(verifyJWT);

// User Profile
router.get('/me', userController.getCurrentUser);
router.put('/me', userController.updateProfile);

// Saved Jobs
router.get('/saved-jobs', userController.getSavedJobs);
router.post('/saved-jobs', userController.saveJob);
router.put('/saved-jobs/:id', userController.updateSavedJob);
router.delete('/saved-jobs/:id', userController.removeSavedJob);

// Search History
router.get('/search-history', userController.getSearchHistory);
router.delete('/search-history', userController.clearSearchHistory);

// Search Presets
router.get('/presets', userController.getPresets);
router.post('/presets', userController.createPreset);
router.put('/presets/:id', userController.updatePreset);
router.delete('/presets/:id', userController.deletePreset);

// Stats
router.get('/stats', userController.getUserStats);

// Trends
router.get('/trends', userController.getUserTrends);
router.get('/job-status-distribution', userController.getJobStatusDistribution);

module.exports = router;
