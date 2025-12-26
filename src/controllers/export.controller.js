/**
 * Export Controller
 * Handles data export operations
 */

const exportService = require('../services/export.service');
const dbService = require('../services/db.service');
const { asyncHandler } = require('../middleware/errorHandler');
const { HTTP_STATUS } = require('../config');

/**
 * Export search results to CSV
 */
const exportToCSV = asyncHandler(async (req, res) => {
    const { jobs } = req.body;

    if (!jobs || !Array.isArray(jobs) || jobs.length === 0) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            error: 'No jobs data provided'
        });
    }

    const csv = await exportService.exportToCSV(jobs);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=jobs-${Date.now()}.csv`);
    res.send(csv);
});

/**
 * Export search results to Excel
 */
const exportToExcel = asyncHandler(async (req, res) => {
    const { jobs } = req.body;

    if (!jobs || !Array.isArray(jobs) || jobs.length === 0) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            error: 'No jobs data provided'
        });
    }

    const buffer = await exportService.exportToExcel(jobs);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=jobs-${Date.now()}.xlsx`);
    res.send(buffer);
});

/**
 * Export single job to PDF
 */
const exportToPDF = asyncHandler(async (req, res) => {
    const { job } = req.body;

    if (!job || !job.position) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            error: 'No job data provided'
        });
    }

    const buffer = await exportService.exportJobToPDF(job);

    const filename = `${job.position.replace(/[^a-zA-Z0-9]/g, '_')}-${Date.now()}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.send(buffer);
});

/**
 * Export user's saved jobs to CSV (requires auth)
 */
const exportSavedJobsToCSV = asyncHandler(async (req, res) => {
    const savedJobs = await dbService.getSavedJobs(req.user.id, 1000, 0);

    if (savedJobs.length === 0) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            error: 'No saved jobs to export'
        });
    }

    const csv = await exportService.exportToCSV(savedJobs);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=saved-jobs-${Date.now()}.csv`);
    res.send(csv);
});

/**
 * Export user's saved jobs to Excel (requires auth)
 */
const exportSavedJobsToExcel = asyncHandler(async (req, res) => {
    const savedJobs = await dbService.getSavedJobs(req.user.id, 1000, 0);

    if (savedJobs.length === 0) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            error: 'No saved jobs to export'
        });
    }

    const buffer = await exportService.exportSavedJobsToExcel(savedJobs);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=saved-jobs-${Date.now()}.xlsx`);
    res.send(buffer);
});

module.exports = {
    exportToCSV,
    exportToExcel,
    exportToPDF,
    exportSavedJobsToCSV,
    exportSavedJobsToExcel
};
