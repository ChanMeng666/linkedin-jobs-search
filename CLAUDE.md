# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LinkedIn Jobs Search is a full-stack job search platform that integrates with the LinkedIn Jobs API to provide advanced filtering, real-time search, and responsive user experience. Built with Node.js/Express backend and vanilla JavaScript frontend with TailwindCSS.

**Key Dependencies:**
- `linkedin-jobs-api`: Core API integration for job data
- `express`: Web server framework
- `node-cache`: In-memory caching (1-hour TTL)
- `express-rate-limit`: API rate limiting (100 req/15min per IP)
- `axios`: HTTP client for LinkedIn proxy requests

## Development Commands

```bash
# Development with hot reload (uses nodemon)
npm run dev

# Production server
npm start

# Vercel build (minimal - just echoes hello)
npm run vercel-build
```

**Port:** Default 3000 (configurable via `PORT` env var)

## Architecture Overview

### Dual Server Implementation

The project has **two server entry points** with different purposes:

1. **`src/server.js`** - Primary monolithic server (currently active)
   - Single file containing all routes, middleware, and logic
   - Includes GEO (Generative Engine Optimization) monitoring
   - Direct implementation of `/api/jobs/search` endpoint
   - Used by Vercel deployment (see `vercel.json`)

2. **`src/app.js`** - Modular MVC architecture (alternative)
   - Clean separation: routes → controllers → services
   - Uses `src/routes/jobs.js` and `src/controllers/jobsController.js`
   - Includes `src/utils/validator.js` for parameter validation
   - Currently NOT the active server

**Important:** When making changes, determine which server implementation is being used. The active server is `src/server.js` based on `package.json` and `vercel.json` configuration.

### Request Flow (server.js)

```
Client → CORS → Rate Limiter → GEO Monitoring → Cache Check → LinkedIn API → Response
```

**Caching Strategy:**
- Cache key: `JSON.stringify(req.body)` (entire request body)
- TTL: 3600 seconds (1 hour)
- Library: `node-cache`

**Rate Limiting:**
- 100 requests per 15-minute window per IP
- Applied to `/api/*` routes only

### GEO Monitoring System

The server includes comprehensive Generative Engine Optimization tracking:
- Detects AI referrers (ChatGPT, Claude, Perplexity, Copilot, Bard, GPT)
- Logs UTM parameters for AI attribution tracking
- Analyzes search patterns (complexity, filters used)
- All monitoring in `geoMonitoring` object in `src/server.js:33-73`

## API Endpoints

### Active Endpoints (server.js)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api` | Health check + endpoint listing |
| `POST` | `/api/jobs/search` | Main search with all filters |
| `GET` | `/api/geo-stats` | GEO monitoring statistics |
| `GET` | `/api/proxy-linkedin` | LinkedIn page proxy (requires `?url=` param) |

### Alternative Endpoints (app.js - not active)

These are defined in `src/routes/jobs.js` but not currently used:
- `POST /api/jobs/search` - Basic search
- `POST /api/jobs/advanced-search` - Advanced search
- `GET /api/jobs/recent` - Recent jobs (24hr)
- `POST /api/jobs/by-experience` - Experience-based search
- `POST /api/jobs/by-salary` - Salary-based search
- `POST /api/jobs/remote` - Remote jobs only
- `POST /api/jobs/paginated` - Paginated results

## Search Parameters

**linkedin-jobs-api** accepts these parameters:

```javascript
{
  keyword: String,           // Job title or skill
  location: String,          // City, state, or "Remote"
  dateSincePosted: String,   // "past month", "past week", "24hr"
  jobType: String,           // "full time", "part time", "contract", "temporary", "volunteer", "internship"
  remoteFilter: String,      // "on site", "remote", "hybrid"
  salary: String,            // "40000", "60000", "80000", "100000", "120000"
  experienceLevel: String,   // "internship", "entry level", "associate", "senior", "director", "executive"
  sortBy: String,           // "recent", "relevant"
  limit: String,            // Results per page (default: "10")
  page: String              // Page number (default: "0")
}
```

**Validation:** `src/utils/validator.js` defines allowed values for `salary`, `experienceLevel`, and `jobType`, but is only used in the modular architecture (not currently active).

## Frontend Architecture

**Location:** `public/index.html` (single-page application)

**Key Features:**
- Split-view layout: search form (left) + results (right)
- Vanilla JavaScript with Fetch API for backend communication
- TailwindCSS for styling (CDN-loaded, not built)
- Responsive design with mobile-first approach
- Client-side result rendering and pagination

## Deployment

**Vercel Configuration** (`vercel.json`):
- Serverless functions via `@vercel/node` for `src/server.js`
- Static serving via `@vercel/static` for `public/**`
- All `/api/*` routes → `src/server.js`
- Root and static files → `public/`

**Environment Variables:**
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment mode (development/production)

No external API keys required - the `linkedin-jobs-api` package handles authentication.

## Code Organization Notes

### When Adding Features

1. **Check which server is active** - Currently `src/server.js`
2. **For new endpoints:** Add to `src/server.js` after rate limiter setup
3. **Consider caching:** Stateless operations benefit from the existing cache
4. **Add GEO monitoring:** Call `geoMonitoring.logRequest(req, 'your_endpoint_type')` for new routes
5. **CORS:** Production origin whitelist in `src/server.js:11-17` needs updating for new domains

### Potential Architecture Migration

If migrating from monolithic `server.js` to modular `app.js`:
1. Move GEO monitoring middleware to separate file
2. Move caching logic to a service layer
3. Update `package.json` "main" field to "src/app.js"
4. Update `vercel.json` to point to new entry point
5. Consolidate duplicate endpoint logic

### Testing

No test framework currently configured. For manual testing:

```bash
# Test search endpoint
curl -X POST http://localhost:3000/api/jobs/search \
  -H "Content-Type: application/json" \
  -d '{"keyword": "software engineer", "location": "San Francisco"}'

# Test health check
curl http://localhost:3000/api
```

## Known Patterns

- **Empty values removed:** `server.js:159-163` removes falsy query parameters before API call
- **Cache key:** Uses entire request body, so identical searches hit cache
- **Error handling:** Try-catch in route handlers, errors logged and returned as JSON
- **Chinese comments:** Some comments in Chinese (e.g., `src/server.js:10,21,22`) - context indicates CORS config, cache setup, and rate limiting
