/**
 * Health Check Routes
 * API routes for server health monitoring
 */

const express = require('express');
const router = express.Router();
const healthController = require('../controllers/health.controller');

// Basic health check
router.get('/', healthController.healthCheck);

// Detailed system status
router.get('/status', healthController.systemStatus);

// LinkedIn proxy endpoint
router.get('/proxy-linkedin', healthController.proxyLinkedIn);

module.exports = router;
