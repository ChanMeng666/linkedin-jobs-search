const linkedIn = require('linkedin-jobs-api');
const { validateSearchParams } = require('../utils/validator');

const jobsController = {
    // 基础搜索
    async searchJobs(req, res, next) {
        try {
            const { keyword, location } = req.body;
            
            const queryOptions = {
                keyword,
                location,
                limit: '10'
            };

            const jobs = await linkedIn.query(queryOptions);
            res.json({
                success: true,
                count: jobs.length,
                jobs
            });
        } catch (error) {
            next(error);
        }
    },

    // 高级搜索
    async advancedSearch(req, res, next) {
        try {
            const {
                keyword,
                location,
                dateSincePosted,
                jobType,
                remoteFilter,
                salary,
                experienceLevel,
                limit,
                sortBy,
                has_verification,
                under_10_applicants
            } = req.body;

            const queryOptions = {
                keyword,
                location,
                dateSincePosted,
                jobType,
                remoteFilter,
                salary,
                experienceLevel,
                limit,
                sortBy,
                has_verification: has_verification === true || has_verification === 'true',
                under_10_applicants: under_10_applicants === true || under_10_applicants === 'true'
            };

            // 移除空值和 false 布尔值
            Object.keys(queryOptions).forEach(key => {
                if (!queryOptions[key]) {
                    delete queryOptions[key];
                }
            });

            const jobs = await linkedIn.query(queryOptions);
            res.json({
                success: true,
                count: jobs.length,
                jobs
            });
        } catch (error) {
            next(error);
        }
    },

    // 获取最新职位
    async getRecentJobs(req, res, next) {
        try {
            const queryOptions = {
                dateSincePosted: '24hr',
                sortBy: 'recent',
                limit: '20'
            };

            const jobs = await linkedIn.query(queryOptions);
            res.json({
                success: true,
                count: jobs.length,
                jobs
            });
        } catch (error) {
            next(error);
        }
    },

    // 按经验级别搜索
    async searchByExperience(req, res, next) {
        try {
            const { experienceLevel, keyword } = req.body;
            
            const queryOptions = {
                keyword,
                experienceLevel,
                limit: '20'
            };

            const jobs = await linkedIn.query(queryOptions);
            res.json({
                success: true,
                count: jobs.length,
                jobs
            });
        } catch (error) {
            next(error);
        }
    },

    // 按薪资范围搜索
    async searchBySalary(req, res, next) {
        try {
            const { salary, keyword } = req.body;
            
            const queryOptions = {
                keyword,
                salary,
                limit: '20'
            };

            const jobs = await linkedIn.query(queryOptions);
            res.json({
                success: true,
                count: jobs.length,
                jobs
            });
        } catch (error) {
            next(error);
        }
    },

    // 远程工作机会
    async searchRemoteJobs(req, res, next) {
        try {
            const { keyword } = req.body;
            
            const queryOptions = {
                keyword,
                remoteFilter: 'remote',
                limit: '20'
            };

            const jobs = await linkedIn.query(queryOptions);
            res.json({
                success: true,
                count: jobs.length,
                jobs
            });
        } catch (error) {
            next(error);
        }
    },

    // 分页搜索
    async paginatedSearch(req, res, next) {
        try {
            const { keyword, page = "0", limit = "10" } = req.body;
            
            const queryOptions = {
                keyword,
                page,
                limit
            };

            const jobs = await linkedIn.query(queryOptions);
            res.json({
                success: true,
                count: jobs.length,
                currentPage: parseInt(page),
                jobs
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = jobsController;