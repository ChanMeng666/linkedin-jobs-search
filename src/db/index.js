/**
 * Database Connection
 * Neon PostgreSQL with Drizzle ORM
 */

require('dotenv').config({ path: '.env.local' });
const { drizzle } = require('drizzle-orm/neon-http');
const { neon } = require('@neondatabase/serverless');
const schema = require('./schema');
const logger = require('../utils/logger');

// Validate DATABASE_URL
if (!process.env.DATABASE_URL) {
    logger.error('DATABASE_URL environment variable is not set');
    throw new Error('DATABASE_URL environment variable is required');
}

// Create Neon SQL client (HTTP-based, ideal for serverless)
const sql = neon(process.env.DATABASE_URL);

// Create Drizzle instance with schema
const db = drizzle(sql, { schema });

logger.info('Database connection initialized', {
    dialect: 'postgresql',
    driver: 'neon-http'
});

module.exports = { db, sql, schema };
