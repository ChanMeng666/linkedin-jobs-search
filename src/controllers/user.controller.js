/**
 * User Controller
 * Handles user data operations
 */

const dbService = require('../services/db.service');
const { asyncHandler } = require('../middleware/errorHandler');
const { HTTP_STATUS } = require('../config');

// ==================== USER PROFILE ====================

const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await dbService.getUserById(req.user.id);

    if (!user) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
            success: false,
            error: 'User not found'
        });
    }

    res.json({
        success: true,
        user: {
            id: user.id,
            email: user.email,
            displayName: user.displayName,
            avatarUrl: user.avatarUrl,
            createdAt: user.createdAt
        }
    });
});

const updateProfile = asyncHandler(async (req, res) => {
    const { displayName } = req.body;
    const user = await dbService.upsertUser({
        id: req.user.id,
        email: req.user.email,
        displayName
    });

    res.json({
        success: true,
        user: {
            id: user.id,
            email: user.email,
            displayName: user.displayName,
            avatarUrl: user.avatarUrl
        }
    });
});

// ==================== SAVED JOBS ====================

const getSavedJobs = asyncHandler(async (req, res) => {
    const { limit = 50, offset = 0 } = req.query;
    const jobs = await dbService.getSavedJobs(
        req.user.id,
        parseInt(limit),
        parseInt(offset)
    );

    res.json({
        success: true,
        jobs,
        count: jobs.length
    });
});

const saveJob = asyncHandler(async (req, res) => {
    const result = await dbService.saveJob(req.user.id, req.body);

    if (!result.success) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json(result);
    }

    res.status(HTTP_STATUS.CREATED).json(result);
});

const updateSavedJob = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, notes } = req.body;

    const job = await dbService.updateSavedJobStatus(
        req.user.id,
        id,
        status,
        notes
    );

    if (!job) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
            success: false,
            error: 'Job not found'
        });
    }

    res.json({ success: true, job });
});

const removeSavedJob = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deleted = await dbService.removeSavedJob(req.user.id, id);

    if (!deleted) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
            success: false,
            error: 'Job not found'
        });
    }

    res.json({ success: true, message: 'Job removed' });
});

// ==================== SEARCH HISTORY ====================

const getSearchHistory = asyncHandler(async (req, res) => {
    const { limit = 20 } = req.query;
    const history = await dbService.getSearchHistory(req.user.id, parseInt(limit));

    res.json({ success: true, history });
});

const clearSearchHistory = asyncHandler(async (req, res) => {
    await dbService.clearSearchHistory(req.user.id);
    res.json({ success: true, message: 'Search history cleared' });
});

// ==================== SEARCH PRESETS ====================

const getPresets = asyncHandler(async (req, res) => {
    const presets = await dbService.getPresets(req.user.id);
    res.json({ success: true, presets });
});

const createPreset = asyncHandler(async (req, res) => {
    const preset = await dbService.createPreset(req.user.id, req.body);
    res.status(HTTP_STATUS.CREATED).json({ success: true, preset });
});

const updatePreset = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const preset = await dbService.updatePreset(req.user.id, id, req.body);

    if (!preset) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
            success: false,
            error: 'Preset not found'
        });
    }

    res.json({ success: true, preset });
});

const deletePreset = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deleted = await dbService.deletePreset(req.user.id, id);

    if (!deleted) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
            success: false,
            error: 'Preset not found'
        });
    }

    res.json({ success: true, message: 'Preset deleted' });
});

// ==================== STATS ====================

const getUserStats = asyncHandler(async (req, res) => {
    const stats = await dbService.getUserStats(req.user.id);
    res.json({ success: true, stats });
});

module.exports = {
    getCurrentUser,
    updateProfile,
    getSavedJobs,
    saveJob,
    updateSavedJob,
    removeSavedJob,
    getSearchHistory,
    clearSearchHistory,
    getPresets,
    createPreset,
    updatePreset,
    deletePreset,
    getUserStats
};
