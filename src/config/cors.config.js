/**
 * CORS Configuration
 * Cross-Origin Resource Sharing settings for the application
 */

const corsOptions = {
    origin: process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : [
            'https://linkedin-jobs-search.vercel.app',
            'https://*.vercel.app'
        ],
    methods: ['GET', 'POST'],
    credentials: true,
    optionsSuccessStatus: 200
};

module.exports = corsOptions;
