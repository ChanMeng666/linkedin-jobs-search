/**
 * Minimal test endpoint to debug Vercel crashes
 */

module.exports = (req, res) => {
    const diagnostics = {
        timestamp: new Date().toISOString(),
        nodeVersion: process.version,
        env: {
            NODE_ENV: process.env.NODE_ENV,
            hasDatabase: !!process.env.DATABASE_URL,
            hasStackProjectId: !!process.env.NEXT_PUBLIC_STACK_PROJECT_ID,
            hasStackPublishableKey: !!process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY,
            hasStackSecretKey: !!process.env.STACK_SECRET_SERVER_KEY
        },
        modules: {}
    };

    // Test each module import
    const testModules = [
        { name: 'express', path: 'express' },
        { name: 'cors', path: 'cors' },
        { name: 'dotenv', path: 'dotenv' },
        { name: 'jose', path: 'jose' },
        { name: 'drizzle-orm', path: 'drizzle-orm' },
        { name: '@neondatabase/serverless', path: '@neondatabase/serverless' },
        { name: 'helmet', path: 'helmet' },
        { name: 'logger', path: '../src/utils/logger' },
        { name: 'constants', path: '../src/config/constants' },
        { name: 'auth.config', path: '../src/config/auth.config' },
        { name: 'config/index', path: '../src/config/index' },
        { name: 'errorHandler', path: '../src/middleware/errorHandler' },
        { name: 'security', path: '../src/middleware/security' },
        { name: 'geoMonitoring', path: '../src/middleware/geoMonitoring' },
        { name: 'cacheMiddleware', path: '../src/middleware/cacheMiddleware' },
        { name: 'auth.middleware', path: '../src/middleware/auth.middleware' },
        { name: 'middleware/index', path: '../src/middleware/index' },
        { name: 'db/schema', path: '../src/db/schema' },
        { name: 'db/index', path: '../src/db/index' },
        { name: 'routes/index', path: '../src/routes/index' },
        { name: 'app', path: '../src/app' }
    ];

    for (const mod of testModules) {
        try {
            require(mod.path);
            diagnostics.modules[mod.name] = 'OK';
        } catch (error) {
            diagnostics.modules[mod.name] = {
                error: error.message,
                code: error.code
            };
            // Stop at first error to see the root cause
            break;
        }
    }

    res.status(200).json(diagnostics);
};
