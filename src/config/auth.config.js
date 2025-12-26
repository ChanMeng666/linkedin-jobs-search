/**
 * Stack Auth Configuration
 * Manages authentication settings for Stack Auth integration
 */

require('dotenv').config({ path: '.env.local' });

// Environment variable validation
const validateAuthConfig = () => {
    const warnings = [];
    const errors = [];

    // Check required variables
    if (!process.env.NEXT_PUBLIC_STACK_PROJECT_ID) {
        warnings.push('NEXT_PUBLIC_STACK_PROJECT_ID not set, using default value');
    }

    if (!process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY) {
        errors.push('NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY is required for OAuth');
    }

    if (!process.env.STACK_SECRET_SERVER_KEY) {
        errors.push('STACK_SECRET_SERVER_KEY is required for token verification');
    }

    // Log warnings
    warnings.forEach(warning => {
        console.warn(`[Auth Config] Warning: ${warning}`);
    });

    // Log errors
    errors.forEach(error => {
        console.error(`[Auth Config] Error: ${error}`);
    });

    return {
        isValid: errors.length === 0,
        warnings,
        errors
    };
};

// Run validation on module load
const configValidation = validateAuthConfig();

const STACK_AUTH_CONFIG = {
    projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID || 'cb93ee14-b9ed-4eb7-8dfa-ddf75f342fe5',
    publishableKey: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY,
    secretKey: process.env.STACK_SECRET_SERVER_KEY,
    apiUrl: 'https://api.stack-auth.com/api/v1',

    // JWKS URL for JWT verification
    jwksUrl: `https://api.stack-auth.com/api/v1/projects/${process.env.NEXT_PUBLIC_STACK_PROJECT_ID || 'cb93ee14-b9ed-4eb7-8dfa-ddf75f342fe5'}/.well-known/jwks.json`,

    // OAuth Providers enabled
    providers: ['github', 'google'],

    // URLs
    urls: {
        login: '/login.html',
        callback: '/auth-callback.html',
        dashboard: '/dashboard.html',
        afterLogout: '/'
    },

    // Configuration status
    isConfigured: configValidation.isValid
};

module.exports = { STACK_AUTH_CONFIG, validateAuthConfig };
