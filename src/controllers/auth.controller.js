/**
 * Auth Controller
 * Handles authentication-related operations
 */

const { asyncHandler } = require('../middleware/errorHandler');
const logger = require('../utils/logger');
const { STACK_AUTH_CONFIG, HTTP_STATUS } = require('../config');

// Lazy load database to prevent initialization errors for non-DB endpoints
let db, users, eq;
const getDb = () => {
    if (!db) {
        const dbModule = require('../db');
        db = dbModule.db;
        users = require('../db/schema').users;
        eq = require('drizzle-orm').eq;
    }
    return { db, users, eq };
};

/**
 * Sync user after OAuth login
 * Creates or updates user in our database
 */
const syncUser = asyncHandler(async (req, res) => {
    const userData = req.user;

    if (!userData || !userData.id) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            error: 'User data not available'
        });
    }

    try {
        const { db, users, eq } = getDb();

        // Check if user exists
        const existingUsers = await db.select()
            .from(users)
            .where(eq(users.id, userData.id))
            .limit(1);

        let user;

        if (existingUsers.length > 0) {
            // Update existing user
            const [updatedUser] = await db.update(users)
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

            user = updatedUser;
            logger.info('User updated', { userId: user.id });
        } else {
            // Create new user
            const [newUser] = await db.insert(users)
                .values({
                    id: userData.id,
                    email: userData.email,
                    displayName: userData.displayName,
                    avatarUrl: userData.avatarUrl,
                    provider: userData.metadata?.auth_method || 'oauth',
                    lastLoginAt: new Date(),
                    metadata: userData.metadata
                })
                .returning();

            user = newUser;
            logger.info('New user created', { userId: user.id });
        }

        res.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                displayName: user.displayName,
                avatarUrl: user.avatarUrl
            }
        });
    } catch (error) {
        logger.error('User sync failed', { error: error.message });
        throw error;
    }
});

/**
 * Verify token endpoint
 * Lightweight check for token validity
 */
const verifyToken = asyncHandler(async (req, res) => {
    const token = req.headers['x-stack-access-token'] ||
                  (req.headers.authorization?.startsWith('Bearer ') ?
                   req.headers.authorization.slice(7) : null);

    if (!token) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
            success: false,
            error: 'No token provided'
        });
    }

    // Token verification is done by the middleware
    // If we reach here, the token is valid
    try {
        const jose = require('jose');
        const jwks = jose.createRemoteJWKSet(new URL(STACK_AUTH_CONFIG.jwksUrl));

        const { payload } = await jose.jwtVerify(token, jwks, {
            issuer: 'https://api.stack-auth.com',
            audience: STACK_AUTH_CONFIG.projectId
        });

        res.json({
            success: true,
            valid: true,
            user: {
                id: payload.sub,
                email: payload.email,
                displayName: payload.name || payload.display_name
            }
        });
    } catch (error) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
            success: false,
            valid: false,
            error: error.code === 'ERR_JWT_EXPIRED' ? 'Token expired' : 'Invalid token'
        });
    }
});

/**
 * Get auth configuration for frontend
 */
const getAuthConfig = asyncHandler(async (req, res) => {
    res.json({
        success: true,
        config: {
            projectId: STACK_AUTH_CONFIG.projectId,
            publishableKey: STACK_AUTH_CONFIG.publishableKey,
            providers: STACK_AUTH_CONFIG.providers,
            urls: STACK_AUTH_CONFIG.urls
        }
    });
});

module.exports = {
    syncUser,
    verifyToken,
    getAuthConfig
};
