require('dotenv').config();
const express = require('express');
const linkedIn = require('linkedin-jobs-api');
const cors = require('cors');
const app = express();
const rateLimit = require('express-rate-limit');
const cache = require('node-cache');
const axios = require('axios');

// 更详细的 CORS 配置
app.use(cors({
    origin: process.env.NODE_ENV === 'development' 
        ? 'http://localhost:3000' 
        : ['your-production-domain.vercel.app'],
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(express.json());
app.use(express.static('public'));

// 创建缓存实例
const jobsCache = new cache({ stdTTL: 3600 }); // 缓存1小时

// 创建限流器
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15分钟窗口
    max: 100 // 限制每个IP 15分钟内最多100个请求
});

// 应用限流中间件
app.use('/api/', limiter);

// GEO监控中间件
const geoMonitoring = {
    aiReferrers: ['ChatGPT', 'Claude', 'Perplexity', 'Copilot', 'Bard', 'GPT'],
    
    logRequest: (req, type = 'general') => {
        const userAgent = req.get('User-Agent') || '';
        const referrer = req.get('Referer') || '';
        const timestamp = new Date().toISOString();
        const ip = req.ip || req.connection.remoteAddress;
        
        // 检测AI来源
        const isAIReferrer = geoMonitoring.aiReferrers.some(ai => 
            userAgent.toLowerCase().includes(ai.toLowerCase()) ||
            referrer.toLowerCase().includes(ai.toLowerCase())
        );
        
        // 检测UTM参数 (用于追踪AI引用)
        const utmSource = req.query.utm_source;
        const utmMedium = req.query.utm_medium;
        const utmCampaign = req.query.utm_campaign;
        
        const logEntry = {
            timestamp,
            type,
            ip,
            userAgent,
            referrer,
            isAIReferrer,
            utmSource,
            utmMedium,
            utmCampaign,
            path: req.path,
            query: req.query
        };
        
        // 简单的日志记录 (生产环境应使用专业日志服务)
        console.log('GEO Monitoring:', JSON.stringify(logEntry));
        
        return logEntry;
    }
};

// 基础欢迎路由
app.get('/api', (req, res) => {
    geoMonitoring.logRequest(req, 'api_health_check');
    res.json({ 
        message: 'LinkedIn Jobs API Demo Server is running!',
        timestamp: new Date().toISOString(),
        endpoints: {
            'POST /api/jobs/search': 'Main job search endpoint',
            'GET /api/geo-stats': 'GEO monitoring statistics',
            'GET /llms.txt': 'AI guidance document',
            'GET /robots.txt': 'Crawler instructions'
        }
    });
});

// GEO统计端点
app.get('/api/geo-stats', (req, res) => {
    geoMonitoring.logRequest(req, 'geo_stats_access');
    
    res.json({
        message: 'GEO Monitoring Statistics',
        description: 'This endpoint provides insights into AI crawler activity and referral patterns',
        implementation: 'Basic monitoring - upgrade to analytics service for production',
        kpis: {
            'AI Referrer Detection': 'Tracks known AI user agents and referrers',
            'UTM Parameter Tracking': 'Monitors utm_source, utm_medium, utm_campaign',
            'Search Pattern Analysis': 'Analyzes job search query patterns',
            'Response Time Monitoring': 'Tracks API performance metrics'
        },
        setup_instructions: {
            'Step 1': 'Add UTM parameters to AI-generated links: ?utm_source=chatgpt&utm_medium=ai_referral&utm_campaign=job_search',
            'Step 2': 'Monitor server logs for AI referrer patterns',
            'Step 3': 'Set up analytics dashboard for comprehensive tracking',
            'Step 4': 'Implement A/B testing for different AI instructions'
        }
    });
});

// 搜索路由
app.post('/api/jobs/search', async (req, res) => {
    try {
        // GEO监控 - 记录搜索请求
        const geoLog = geoMonitoring.logRequest(req, 'job_search');
        
        // 分析搜索模式
        const searchAnalytics = {
            hasKeyword: !!req.body.keyword,
            hasLocation: !!req.body.location,
            hasSalaryFilter: !!req.body.salary,
            hasExperienceFilter: !!req.body.experienceLevel,
            hasRemoteFilter: !!req.body.remoteFilter,
            isAdvancedSearch: Object.keys(req.body).length > 2,
            searchComplexity: Object.keys(req.body).filter(key => req.body[key]).length
        };
        
        console.log('Search Analytics:', JSON.stringify({
            ...geoLog,
            searchPattern: searchAnalytics
        }));
        
        // 生成缓存键
        const cacheKey = JSON.stringify(req.body);
        
        // 检查缓存
        const cachedResult = jobsCache.get(cacheKey);
        if (cachedResult) {
            return res.json(cachedResult);
        }

        // 构建查询选项
        const queryOptions = {
            keyword: req.body.keyword,
            location: req.body.location,
            dateSincePosted: req.body.dateSincePosted,
            jobType: req.body.jobType,
            remoteFilter: req.body.remoteFilter,
            salary: req.body.salary,
            experienceLevel: req.body.experienceLevel,
            limit: req.body.limit || '10',
            sortBy: req.body.sortBy,
            page: req.body.page || '0'
        };

        // 移除空值
        Object.keys(queryOptions).forEach(key => {
            if (!queryOptions[key]) {
                delete queryOptions[key];
            }
        });

        console.log('Searching with options:', queryOptions);

        // 执行搜索
        const jobs = await linkedIn.query(queryOptions);

        console.log(`Found ${jobs.length} jobs`);

        // 存入缓存
        jobsCache.set(cacheKey, {
            success: true,
            jobs: jobs,
            searchParams: queryOptions
        });

        // 返回结果
        res.json({
            success: true,
            jobs: jobs,
            searchParams: queryOptions
        });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'An error occurred during the search'
        });
    }
});

// 添加代理中间件
app.get('/api/proxy-linkedin', async (req, res) => {
    try {
        const { url } = req.query;
        
        // 验证 URL 是否为 LinkedIn 域名
        if (!url.startsWith('https://www.linkedin.com/')) {
            return res.status(400).json({ error: 'Invalid URL' });
        }

        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        res.send(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch LinkedIn page' });
    }
});

// 修改服务器启动逻辑
const PORT = process.env.PORT || 3000;
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`✨ Server is running on http://localhost:${PORT}`);
        console.log(`🚀 API endpoint: http://localhost:${PORT}/api`);
        console.log(`📝 Search endpoint: http://localhost:${PORT}/api/jobs/search`);
    });
}

module.exports = app;