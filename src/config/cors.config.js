/**
 * CORS Configuration
 * Cross-Origin Resource Sharing settings for the application
 */

// Parse allowed origins from environment variable or use defaults
const getAllowedOrigins = () => {
    if (process.env.NODE_ENV === 'development') {
        return ['http://localhost:3000', 'http://127.0.0.1:3000'];
    }

    // Use environment variable if set, otherwise use default production origin
    const envOrigins = process.env.ALLOWED_ORIGINS;
    if (envOrigins) {
        return envOrigins.split(',').map(origin => origin.trim());
    }

    // Default production origins (explicit, no wildcards)
    return [
        'https://linkedin-jobs-search.vercel.app'
    ];
};

const corsOptions = {
    origin: getAllowedOrigins(),
    methods: ['GET', 'POST'],
    credentials: true,
    optionsSuccessStatus: 200
};

module.exports = corsOptions;
