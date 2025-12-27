/**
 * Cache Routes
 * API routes for cache management
 */

const express = require('express');
const router = express.Router();
const cacheController = require('../controllers/cache.controller');
const { verifyJWT } = require('../middleware/auth.middleware');

// Public routes
router.get('/stats', cacheController.getCacheStats);
router.get('/size', cacheController.getCacheSize);

// Protected routes (require authentication)
router.post('/clear', verifyJWT, cacheController.clearCache);
router.post('/clear-pattern', verifyJWT, cacheController.clearCacheByPattern);

module.exports = router;
