/**
 * Export Routes
 * Data export endpoints
 */

const express = require('express');
const router = express.Router();
const exportController = require('../controllers/export.controller');
const { verifyJWT, optionalAuth } = require('../middleware/auth.middleware');

// Public export routes (no auth required, uses request body data)
router.post('/csv', exportController.exportToCSV);
router.post('/excel', exportController.exportToExcel);
router.post('/pdf', exportController.exportToPDF);

// Protected export routes (requires auth, exports user's saved data)
router.post('/saved-jobs/csv', verifyJWT, exportController.exportSavedJobsToCSV);
router.post('/saved-jobs/excel', verifyJWT, exportController.exportSavedJobsToExcel);

module.exports = router;
