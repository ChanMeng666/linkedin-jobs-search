/**
 * Database Connection
 * Neon PostgreSQL with Drizzle ORM
 */

require('dotenv').config({ path: '.env.local' });
const schema = require('./schema');
const logger = require('../utils/logger');

let db = null;
let sql = null;
let isInitialized = false;
let initError = null;

// Initialize database connection lazily
const initDb = () => {
    if (isInitialized) return { db, sql, error: initError };

    isInitialized = true;

    if (!process.env.DATABASE_URL) {
        initError = new Error('DATABASE_URL environment variable is required');
        logger.warn('DATABASE_URL not set - database features will be unavailable');
        return { db: null, sql: null, error: initError };
    }

    try {
        const { drizzle } = require('drizzle-orm/neon-http');
        const { neon } = require('@neondatabase/serverless');

        sql = neon(process.env.DATABASE_URL);
        db = drizzle(sql, { schema });

        logger.info('Database connection initialized', {
            dialect: 'postgresql',
            driver: 'neon-http'
        });
    } catch (error) {
        initError = error;
        logger.error('Failed to initialize database', { error: error.message });
    }

    return { db, sql, error: initError };
};

// Proxy to lazily initialize on first access
module.exports = {
    get db() {
        const result = initDb();
        if (!result.db) {
            throw result.error || new Error('Database not available');
        }
        return result.db;
    },
    get sql() {
        const result = initDb();
        return result.sql;
    },
    schema,
    initDb,
    isAvailable: () => {
        const result = initDb();
        return result.db !== null;
    }
};
