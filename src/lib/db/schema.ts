/**
 * Database Schema
 * Drizzle ORM schema definitions for Neon PostgreSQL
 */

import { pgTable, uuid, text, timestamp, jsonb, boolean, integer } from 'drizzle-orm/pg-core';

/**
 * Users table - synced with Stack Auth
 */
export const users = pgTable('users', {
  id: uuid('id').primaryKey(), // Stack Auth user ID
  email: text('email').notNull().unique(),
  displayName: text('display_name'),
  avatarUrl: text('avatar_url'),
  provider: text('provider'), // 'github', 'google', 'email'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  lastLoginAt: timestamp('last_login_at'),
  metadata: jsonb('metadata'), // Additional user metadata
});

/**
 * Saved/Favorite Jobs
 */
export const savedJobs = pgTable('saved_jobs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  jobId: text('job_id').notNull(), // LinkedIn job ID (extracted from URL)
  position: text('position').notNull(),
  company: text('company').notNull(),
  location: text('location'),
  salary: text('salary'),
  jobUrl: text('job_url').notNull(),
  companyLogo: text('company_logo'),
  jobType: text('job_type'),
  agoTime: text('ago_time'),
  notes: text('notes'), // User's personal notes
  status: text('status').default('saved'), // 'saved', 'applied', 'interviewing', 'offered', 'rejected'
  appliedAt: timestamp('applied_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Search History
 */
export const searchHistory = pgTable('search_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  keyword: text('keyword'),
  location: text('location'),
  country: text('country'), // Country code for multi-country search
  jobType: text('job_type'),
  experienceLevel: text('experience_level'),
  salary: text('salary'),
  remoteFilter: text('remote_filter'),
  dateSincePosted: text('date_since_posted'),
  sortBy: text('sort_by'),
  resultsCount: integer('results_count'),
  searchParams: jsonb('search_params'), // Full search parameters as JSON
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

/**
 * Search Presets (saved search configurations)
 */
export const searchPresets = pgTable('search_presets', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  keyword: text('keyword'),
  location: text('location'),
  country: text('country'),
  jobType: text('job_type'),
  experienceLevel: text('experience_level'),
  salary: text('salary'),
  remoteFilter: text('remote_filter'),
  dateSincePosted: text('date_since_posted'),
  sortBy: text('sort_by'),
  isDefault: boolean('is_default').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type SavedJob = typeof savedJobs.$inferSelect;
export type NewSavedJob = typeof savedJobs.$inferInsert;
export type SearchHistoryItem = typeof searchHistory.$inferSelect;
export type NewSearchHistoryItem = typeof searchHistory.$inferInsert;
export type SearchPreset = typeof searchPresets.$inferSelect;
export type NewSearchPreset = typeof searchPresets.$inferInsert;
