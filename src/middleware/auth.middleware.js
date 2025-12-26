/**
 * Stack Auth Middleware
 * JWT verification for protected routes
 */

const jose = require('jose');
const logger = require('../utils/logger');
const { HTTP_STATUS, STACK_AUTH_CONFIG } = require('../config');

let jwks = null;

/**
 * Initialize JWKS for JWT verification
 */
async function initializeJWKS() {
    if (!jwks) {
        jwks = jose.createRemoteJWKSet(new URL(STACK_AUTH_CONFIG.jwksUrl));
    }
    return jwks;
}

/**
 * Extract access token from request
 */
function extractToken(req) {
    // Check x-stack-access-token header first (Stack Auth standard)
    const stackToken = req.headers['x-stack-access-token'];
    if (stackToken) return stackToken;

    // Fallback to Authorization Bearer token
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.slice(7);
    }

    return null;
}

/**
 * JWT Verification Middleware (Fast, local verification)
 * Use for most protected routes
 */
const verifyJWT = async (req, res, next) => {
    try {
        const token = extractToken(req);

        if (!token) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                success: false,
                error: 'Access token required'
            });
        }

        const keySet = await initializeJWKS();

        const { payload } = await jose.jwtVerify(token, keySet, {
            issuer: 'https://api.stack-auth.com',
            audience: STACK_AUTH_CONFIG.projectId
        });

        // Attach user info to request
        req.user = {
            id: payload.sub,
            email: payload.email,
            displayName: payload.name || payload.display_name,
            verified: true
        };

        // Store token for potential forwarding
        req.accessToken = token;

        next();
    } catch (error) {
        logger.warn('JWT verification failed', { error: error.message });

        if (error.code === 'ERR_JWT_EXPIRED') {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                success: false,
                error: 'Token expired',
                code: 'TOKEN_EXPIRED'
            });
        }

        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
            success: false,
            error: 'Invalid token'
        });
    }
};

/**
 * REST API Verification Middleware (Full user data)
 * Use when you need complete, up-to-date user profile
 */
const verifyWithStackAPI = async (req, res, next) => {
    try {
        const token = extractToken(req);

        if (!token) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                success: false,
                error: 'Access token required'
            });
        }

        const response = await fetch('https://api.stack-auth.com/api/v1/users/me', {
            headers: {
                'x-stack-access-type': 'server',
                'x-stack-project-id': STACK_AUTH_CONFIG.projectId,
                'x-stack-secret-server-key': STACK_AUTH_CONFIG.secretKey,
                'x-stack-access-token': token
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            logger.warn('Stack Auth API verification failed', {
                status: response.status,
                error: errorData
            });

            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                success: false,
                error: 'Authentication failed'
            });
        }

        const userData = await response.json();

        req.user = {
            id: userData.id,
            email: userData.primary_email,
            displayName: userData.display_name,
            avatarUrl: userData.profile_image_url,
            verified: userData.primary_email_verified,
            metadata: userData
        };

        req.accessToken = token;
        next();
    } catch (error) {
        logger.error('Stack Auth verification error', { error: error.message });
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            error: 'Authentication service error'
        });
    }
};

/**
 * Optional Auth Middleware
 * Attaches user if token present, continues if not
 */
const optionalAuth = async (req, res, next) => {
    const token = extractToken(req);

    if (!token) {
        req.user = null;
        return next();
    }

    try {
        const keySet = await initializeJWKS();
        const { payload } = await jose.jwtVerify(token, keySet, {
            issuer: 'https://api.stack-auth.com',
            audience: STACK_AUTH_CONFIG.projectId
        });

        req.user = {
            id: payload.sub,
            email: payload.email,
            displayName: payload.name || payload.display_name,
            verified: true
        };
        req.accessToken = token;
    } catch (error) {
        req.user = null;
    }

    next();
};

module.exports = {
    verifyJWT,
    verifyWithStackAPI,
    optionalAuth,
    extractToken
};
