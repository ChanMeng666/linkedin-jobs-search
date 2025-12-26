/**
 * Auth Routes
 * Authentication-related endpoints
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyWithStackAPI } = require('../middleware/auth.middleware');

// Sync user after OAuth login (requires full API verification)
router.post('/sync', verifyWithStackAPI, authController.syncUser);

// Verify token (lightweight check)
router.get('/verify', authController.verifyToken);

// Get auth config for frontend
router.get('/config', authController.getAuthConfig);

module.exports = router;
