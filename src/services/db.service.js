/**
 * Database Service
 * Core database operations wrapper
 */

const { db } = require('../db');
const { users, savedJobs, searchHistory, searchPresets } = require('../db/schema');
const { eq, desc, and, sql, gte, between } = require('drizzle-orm');
const logger = require('../utils/logger');

class DbService {
    // ==================== USER OPERATIONS ====================

    /**
     * Create or update user from Stack Auth data
     */
    async upsertUser(userData) {
        try {
            const existing = await db.select()
                .from(users)
                .where(eq(users.id, userData.id))
                .limit(1);

            if (existing.length > 0) {
                // Update existing user
                const [updated] = await db.update(users)
                    .set({
                        email: userData.email,
                        displayName: userData.displayName,
                        avatarUrl: userData.avatarUrl,
                        lastLoginAt: new Date(),
                        updatedAt: new Date(),
                        metadata: userData.metadata
                    })
                    .where(eq(users.id, userData.id))
                    .returning();

                return updated;
            }

            // Create new user
            const [newUser] = await db.insert(users)
                .values({
                    id: userData.id,
                    email: userData.email,
                    displayName: userData.displayName,
                    avatarUrl: userData.avatarUrl,
                    provider: userData.provider,
                    lastLoginAt: new Date(),
                    metadata: userData.metadata
                })
                .returning();

            logger.info('New user created', { userId: newUser.id });
            return newUser;
        } catch (error) {
            logger.error('Failed to upsert user', { error: error.message });
            throw error;
        }
    }

    async getUserById(userId) {
        const result = await db.select()
            .from(users)
            .where(eq(users.id, userId))
            .limit(1);
        return result[0] || null;
    }

    // ==================== SAVED JOBS OPERATIONS ====================

    async saveJob(userId, jobData) {
        try {
            // Check if already saved
            const existing = await db.select()
                .from(savedJobs)
                .where(and(
                    eq(savedJobs.userId, userId),
                    eq(savedJobs.jobUrl, jobData.jobUrl)
                ))
                .limit(1);

            if (existing.length > 0) {
                return { success: false, message: 'Job already saved', job: existing[0] };
            }

            const [saved] = await db.insert(savedJobs)
                .values({
                    userId,
                    jobId: jobData.jobId || this.extractJobId(jobData.jobUrl),
                    position: jobData.position,
                    company: jobData.company,
                    location: jobData.location,
                    salary: jobData.salary,
                    jobUrl: jobData.jobUrl,
                    companyLogo: jobData.companyLogo,
                    jobType: jobData.jobType,
                    agoTime: jobData.agoTime
                })
                .returning();

            return { success: true, job: saved };
        } catch (error) {
            logger.error('Failed to save job', { error: error.message });
            throw error;
        }
    }

    /**
     * Extract job ID from LinkedIn URL
     */
    extractJobId(jobUrl) {
        if (!jobUrl) return null;
        const match = jobUrl.match(/view\/(\d+)/);
        return match ? match[1] : null;
    }

    async getSavedJobs(userId, limit = 50, offset = 0) {
        return db.select()
            .from(savedJobs)
            .where(eq(savedJobs.userId, userId))
            .orderBy(desc(savedJobs.createdAt))
            .limit(limit)
            .offset(offset);
    }

    async getSavedJobById(userId, jobId) {
        const result = await db.select()
            .from(savedJobs)
            .where(and(
                eq(savedJobs.userId, userId),
                eq(savedJobs.id, jobId)
            ))
            .limit(1);
        return result[0] || null;
    }

    async updateSavedJobStatus(userId, jobId, status, notes) {
        const updateData = { status, updatedAt: new Date() };
        if (notes !== undefined) updateData.notes = notes;
        if (status === 'applied') updateData.appliedAt = new Date();

        const result = await db.update(savedJobs)
            .set(updateData)
            .where(and(
                eq(savedJobs.userId, userId),
                eq(savedJobs.id, jobId)
            ))
            .returning();

        return result[0] || null;
    }

    async removeSavedJob(userId, jobId) {
        const result = await db.delete(savedJobs)
            .where(and(
                eq(savedJobs.userId, userId),
                eq(savedJobs.id, jobId)
            ))
            .returning();

        return result[0] || null;
    }

    async getSavedJobsCount(userId) {
        const result = await db.select({ count: sql`count(*)` })
            .from(savedJobs)
            .where(eq(savedJobs.userId, userId));
        return parseInt(result[0]?.count || 0);
    }

    // ==================== SEARCH HISTORY OPERATIONS ====================

    async addSearchHistory(userId, searchParams, resultsCount) {
        const [entry] = await db.insert(searchHistory)
            .values({
                userId,
                keyword: searchParams.keyword,
                location: searchParams.location,
                country: searchParams.country,
                jobType: searchParams.jobType,
                experienceLevel: searchParams.experienceLevel,
                salary: searchParams.salary,
                remoteFilter: searchParams.remoteFilter,
                dateSincePosted: searchParams.dateSincePosted,
                sortBy: searchParams.sortBy,
                resultsCount,
                searchParams
            })
            .returning();

        return entry;
    }

    async getSearchHistory(userId, limit = 20) {
        return db.select()
            .from(searchHistory)
            .where(eq(searchHistory.userId, userId))
            .orderBy(desc(searchHistory.createdAt))
            .limit(limit);
    }

    async clearSearchHistory(userId) {
        await db.delete(searchHistory)
            .where(eq(searchHistory.userId, userId));
    }

    // ==================== SEARCH PRESETS OPERATIONS ====================

    async createPreset(userId, presetData) {
        // If setting as default, unset other defaults first
        if (presetData.isDefault) {
            await db.update(searchPresets)
                .set({ isDefault: false })
                .where(eq(searchPresets.userId, userId));
        }

        const [preset] = await db.insert(searchPresets)
            .values({
                userId,
                name: presetData.name,
                description: presetData.description,
                keyword: presetData.keyword,
                location: presetData.location,
                country: presetData.country,
                jobType: presetData.jobType,
                experienceLevel: presetData.experienceLevel,
                salary: presetData.salary,
                remoteFilter: presetData.remoteFilter,
                dateSincePosted: presetData.dateSincePosted,
                sortBy: presetData.sortBy,
                isDefault: presetData.isDefault || false
            })
            .returning();

        return preset;
    }

    async getPresets(userId) {
        return db.select()
            .from(searchPresets)
            .where(eq(searchPresets.userId, userId))
            .orderBy(desc(searchPresets.isDefault), desc(searchPresets.createdAt));
    }

    async getPresetById(userId, presetId) {
        const result = await db.select()
            .from(searchPresets)
            .where(and(
                eq(searchPresets.userId, userId),
                eq(searchPresets.id, presetId)
            ))
            .limit(1);
        return result[0] || null;
    }

    async updatePreset(userId, presetId, presetData) {
        if (presetData.isDefault) {
            await db.update(searchPresets)
                .set({ isDefault: false })
                .where(eq(searchPresets.userId, userId));
        }

        const result = await db.update(searchPresets)
            .set({ ...presetData, updatedAt: new Date() })
            .where(and(
                eq(searchPresets.userId, userId),
                eq(searchPresets.id, presetId)
            ))
            .returning();

        return result[0] || null;
    }

    async deletePreset(userId, presetId) {
        const result = await db.delete(searchPresets)
            .where(and(
                eq(searchPresets.userId, userId),
                eq(searchPresets.id, presetId)
            ))
            .returning();

        return result[0] || null;
    }

    // ==================== STATS OPERATIONS ====================

    async getUserStats(userId) {
        // Date calculations
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        // Total saved jobs
        const [savedCount] = await db.select({ count: sql`count(*)` })
            .from(savedJobs)
            .where(eq(savedJobs.userId, userId));

        // Total search history
        const [historyCount] = await db.select({ count: sql`count(*)` })
            .from(searchHistory)
            .where(eq(searchHistory.userId, userId));

        // Total presets
        const [presetsCount] = await db.select({ count: sql`count(*)` })
            .from(searchPresets)
            .where(eq(searchPresets.userId, userId));

        // This month's searches
        const [thisMonthCount] = await db.select({ count: sql`count(*)` })
            .from(searchHistory)
            .where(and(
                eq(searchHistory.userId, userId),
                gte(searchHistory.createdAt, startOfMonth)
            ));

        // Recent saves (last 7 days)
        const [recentSavesCount] = await db.select({ count: sql`count(*)` })
            .from(savedJobs)
            .where(and(
                eq(savedJobs.userId, userId),
                gte(savedJobs.createdAt, sevenDaysAgo)
            ));

        // Applied jobs count
        const [appliedCount] = await db.select({ count: sql`count(*)` })
            .from(savedJobs)
            .where(and(
                eq(savedJobs.userId, userId),
                eq(savedJobs.status, 'applied')
            ));

        // Status breakdown
        const statusCounts = await db.select({
            status: savedJobs.status,
            count: sql`count(*)`
        })
            .from(savedJobs)
            .where(eq(savedJobs.userId, userId))
            .groupBy(savedJobs.status);

        return {
            totalSearches: parseInt(historyCount?.count || 0),
            savedJobs: parseInt(savedCount?.count || 0),
            appliedJobs: parseInt(appliedCount?.count || 0),
            thisMonth: parseInt(thisMonthCount?.count || 0),
            recentSaves: parseInt(recentSavesCount?.count || 0),
            presetsCount: parseInt(presetsCount?.count || 0),
            statusBreakdown: statusCounts.reduce((acc, item) => {
                acc[item.status || 'saved'] = parseInt(item.count);
                return acc;
            }, {})
        };
    }

    // ==================== TRENDS OPERATIONS ====================

    /**
     * Get search trends for the last N days
     */
    async getSearchTrends(userId, days = 7) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // Get daily search counts
        const dailySearches = await db.select({
            date: sql`DATE(${searchHistory.createdAt})`,
            count: sql`count(*)`
        })
            .from(searchHistory)
            .where(and(
                eq(searchHistory.userId, userId),
                gte(searchHistory.createdAt, startDate)
            ))
            .groupBy(sql`DATE(${searchHistory.createdAt})`)
            .orderBy(sql`DATE(${searchHistory.createdAt})`);

        // Get daily saved jobs
        const dailySaves = await db.select({
            date: sql`DATE(${savedJobs.createdAt})`,
            count: sql`count(*)`
        })
            .from(savedJobs)
            .where(and(
                eq(savedJobs.userId, userId),
                gte(savedJobs.createdAt, startDate)
            ))
            .groupBy(sql`DATE(${savedJobs.createdAt})`)
            .orderBy(sql`DATE(${savedJobs.createdAt})`);

        // Fill in missing dates with 0
        const trends = [];
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const searchItem = dailySearches.find(d => d.date === dateStr);
            const saveItem = dailySaves.find(d => d.date === dateStr);

            trends.push({
                date: dateStr,
                searches: parseInt(searchItem?.count || 0),
                savedJobs: parseInt(saveItem?.count || 0)
            });
        }

        return trends;
    }

    /**
     * Get job status distribution
     */
    async getJobStatusDistribution(userId) {
        const statusCounts = await db.select({
            status: savedJobs.status,
            count: sql`count(*)`
        })
            .from(savedJobs)
            .where(eq(savedJobs.userId, userId))
            .groupBy(savedJobs.status);

        const statuses = ['saved', 'applied', 'interviewing', 'offered', 'rejected'];
        const distribution = {};

        statuses.forEach(status => {
            const item = statusCounts.find(s => s.status === status);
            distribution[status] = parseInt(item?.count || 0);
        });

        return distribution;
    }
}

module.exports = new DbService();
