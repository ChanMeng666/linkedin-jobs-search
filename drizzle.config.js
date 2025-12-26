/**
 * Drizzle Kit Configuration
 * For database migrations and schema management
 */

require('dotenv').config({ path: '.env.local' });

/** @type {import('drizzle-kit').Config} */
module.exports = {
    schema: './src/db/schema.js',
    out: './drizzle/migrations',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL
    },
    verbose: true,
    strict: true
};
