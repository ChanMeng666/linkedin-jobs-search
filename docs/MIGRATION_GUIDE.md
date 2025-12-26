# Migration Guide: Express.js to Next.js 14 with Stack Auth

This guide documents the complete migration process from an Express.js/vanilla JavaScript application to Next.js 14 (App Router) with Stack Auth authentication and Neon PostgreSQL database.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Phase 1: Project Initialization](#phase-1-project-initialization)
4. [Phase 2: Stack Auth Integration](#phase-2-stack-auth-integration)
5. [Phase 3: Database Setup with Neon](#phase-3-database-setup-with-neon)
6. [Phase 4: API Routes Migration](#phase-4-api-routes-migration)
7. [Phase 5: Page Components Migration](#phase-5-page-components-migration)
8. [Phase 6: Vercel Deployment](#phase-6-vercel-deployment)
9. [Common Issues and Solutions](#common-issues-and-solutions)
10. [File Structure Reference](#file-structure-reference)

---

## Overview

### Why Migrate?

- **Better Stack Auth Support**: Stack Auth SDK is designed for Next.js App Router
- **Server Components**: Improved performance with React Server Components
- **Built-in API Routes**: Simplified backend with Next.js API routes
- **Easier Deployment**: Native Vercel integration
- **Type Safety**: Better TypeScript support with Next.js

### Technology Stack

| Component | Technology |
|-----------|------------|
| Framework | Next.js 14 (App Router) |
| Authentication | Stack Auth |
| Database | Neon PostgreSQL |
| ORM | Drizzle ORM |
| Styling | Tailwind CSS |
| Deployment | Vercel |

---

## Prerequisites

Before starting the migration:

1. **Stack Auth Account**: Create a project at [app.stack-auth.com](https://app.stack-auth.com)
2. **Neon Database**: Create a database at [neon.tech](https://neon.tech)
3. **Vercel Account**: For deployment
4. **Node.js**: Version 18+ recommended

### Required Environment Variables

```env
# Stack Auth
NEXT_PUBLIC_STACK_PROJECT_ID=your_project_id
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your_publishable_key
STACK_SECRET_SERVER_KEY=your_secret_key

# Neon Database
DATABASE_URL=postgres://user:password@host/database?sslmode=require
```

---

## Phase 1: Project Initialization

### Step 1.1: Create Next.js Project Structure

If migrating from an existing project, create the Next.js structure alongside:

```bash
# Install Next.js dependencies
npm install next@14 react react-dom

# Install TypeScript support
npm install -D typescript @types/react @types/react-dom @types/node

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Step 1.2: Create Configuration Files

**tsconfig.json**:
```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**next.config.mjs**:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
```

**tailwind.config.ts**:
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#0066FF',
      },
    },
  },
  plugins: [],
};

export default config;
```

### Step 1.3: Update package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

---

## Phase 2: Stack Auth Integration

### Step 2.1: Install Stack Auth

```bash
npm install @stackframe/stack
```

### Step 2.2: Create Stack Auth Configuration Files

**IMPORTANT**: Stack Auth requires separate configurations for server and client components.

**src/lib/stack.ts** (Server-side only):
```typescript
import "server-only";
import { StackServerApp } from "@stackframe/stack";

export const stackServerApp = new StackServerApp({
  tokenStore: "nextjs-cookie",
  urls: {
    home: "/",
    signIn: "/login",
    afterSignIn: "/dashboard",
    afterSignOut: "/",
    signUp: "/login",
    afterSignUp: "/dashboard",
  },
});
```

**src/lib/stack-client.ts** (Client-side):
```typescript
"use client";

import { StackClientApp } from "@stackframe/stack";

export const stackClientApp = new StackClientApp({
  tokenStore: "nextjs-cookie",
  urls: {
    home: "/",
    signIn: "/login",
    afterSignIn: "/dashboard",
    afterSignOut: "/",
    signUp: "/login",
    afterSignUp: "/dashboard",
  },
});
```

### Step 2.3: Create Stack Provider

**src/components/providers/StackProvider.tsx**:
```typescript
"use client";

import { StackProvider as StackAuthProvider, StackTheme } from "@stackframe/stack";
import { stackClientApp } from "@/lib/stack-client";

export function StackProvider({ children }: { children: React.ReactNode }) {
  return (
    <StackAuthProvider app={stackClientApp}>
      <StackTheme>
        {children}
      </StackTheme>
    </StackAuthProvider>
  );
}
```

### Step 2.4: Create Auth Handler Route

**src/app/handler/[...stack]/page.tsx**:
```typescript
import { StackHandler } from "@stackframe/stack";
import { stackServerApp } from "@/lib/stack";

export default function Handler(props: { params: Promise<{ stack: string[] }> }) {
  return <StackHandler fullPage app={stackServerApp} routeProps={props} />;
}
```

### Step 2.5: Create Login Page

**src/app/login/page.tsx**:
```typescript
import { SignIn } from "@stackframe/stack";
import { stackServerApp } from "@/lib/stack";

export default async function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <SignIn
        app={stackServerApp}
        fullPage={false}
        automaticRedirect={true}
      />
    </div>
  );
}
```

---

## Phase 3: Database Setup with Neon

### Step 3.1: Install Drizzle ORM

```bash
npm install drizzle-orm @neondatabase/serverless
npm install -D drizzle-kit
```

### Step 3.2: Create Database Schema

**src/db/schema.ts**:
```typescript
import { pgTable, text, timestamp, uuid, jsonb } from "drizzle-orm/pg-core";

export const savedJobs = pgTable("saved_jobs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  jobData: jsonb("job_data").notNull(),
  savedAt: timestamp("saved_at").defaultNow().notNull(),
});

export const searchHistory = pgTable("search_history", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  searchParams: jsonb("search_params").notNull(),
  resultsCount: text("results_count"),
  searchedAt: timestamp("searched_at").defaultNow().notNull(),
});
```

### Step 3.3: Create Database Client

**src/db/index.ts**:
```typescript
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
```

### Step 3.4: Configure Drizzle

**drizzle.config.ts**:
```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

### Step 3.5: Push Schema to Database

```bash
npx drizzle-kit push
```

---

## Phase 4: API Routes Migration

### Step 4.1: Jobs Search API

**src/app/api/jobs/route.ts**:
```typescript
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Import linkedin-jobs-api dynamically
    const linkedIn = await import("linkedin-jobs-api");

    const queryOptions = {
      keyword: body.keyword || "",
      location: body.location || "",
      dateSincePosted: body.dateSincePosted || "",
      jobType: body.jobType || "",
      remoteFilter: body.remoteFilter || "",
      salary: body.salary || "",
      experienceLevel: body.experienceLevel || "",
      sortBy: body.sortBy || "recent",
      limit: body.limit || "25",
    };

    const jobs = await linkedIn.query(queryOptions);

    return NextResponse.json({
      success: true,
      jobs: jobs || [],
      count: jobs?.length || 0,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
```

### Step 4.2: User Data APIs (Protected)

**src/app/api/user/saved-jobs/route.ts**:
```typescript
import { NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "@/lib/stack";
import { db } from "@/db";
import { savedJobs } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const jobs = await db
      .select()
      .from(savedJobs)
      .where(eq(savedJobs.userId, user.id))
      .orderBy(savedJobs.savedAt);

    return NextResponse.json({ success: true, jobs });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch saved jobs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const [job] = await db
      .insert(savedJobs)
      .values({
        userId: user.id,
        jobData: body.jobData,
      })
      .returning();

    return NextResponse.json({ success: true, job });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to save job" },
      { status: 500 }
    );
  }
}
```

---

## Phase 5: Page Components Migration

### Step 5.1: Root Layout with Suspense

**CRITICAL**: Components using Stack Auth hooks must be wrapped in Suspense boundaries.

**src/app/layout.tsx**:
```typescript
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { StackProvider } from '@/components/providers/StackProvider';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import './globals.css';

export const dynamic = 'force-dynamic';

function NavigationSkeleton() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="w-10 h-10 bg-stone-200 rounded-lg animate-pulse" />
          <div className="hidden md:flex items-center gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-16 h-4 bg-stone-200 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export const metadata: Metadata = {
  title: 'LinkedIn Jobs Search',
  description: 'Search LinkedIn jobs across multiple countries',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-stone-50 flex flex-col">
        <StackProvider>
          <Suspense fallback={<NavigationSkeleton />}>
            <Navigation />
          </Suspense>
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </StackProvider>
      </body>
    </html>
  );
}
```

### Step 5.2: Loading Component

**src/app/loading.tsx**:
```typescript
export default function Loading() {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
        <p className="text-stone-600">Loading...</p>
      </div>
    </div>
  );
}
```

### Step 5.3: Navigation with Auth State

**src/components/layout/Navigation.tsx**:
```typescript
"use client";

import Link from 'next/link';
import { useUser } from '@stackframe/stack';

export function Navigation() {
  const user = useUser();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/">Logo</Link>

          <div className="flex items-center gap-4">
            {!user ? (
              <>
                <Link href="/login">Sign In</Link>
                <Link href="/search">Get Started</Link>
              </>
            ) : (
              <>
                <Link href="/dashboard">Dashboard</Link>
                <button onClick={() => user.signOut()}>Sign Out</button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
```

### Step 5.4: Protected Pages

**src/app/dashboard/page.tsx**:
```typescript
import { redirect } from 'next/navigation';
import { stackServerApp } from '@/lib/stack';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const user = await stackServerApp.getUser();

  if (!user) {
    redirect('/login?from=dashboard');
  }

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1>Welcome, {user.displayName || user.primaryEmail}</h1>
        {/* Dashboard content */}
      </div>
    </div>
  );
}
```

---

## Phase 6: Vercel Deployment

### Step 6.1: Configure vercel.json

**vercel.json**:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs"
}
```

### Step 6.2: Add Environment Variables to Vercel

Using Vercel CLI:
```bash
vercel env add NEXT_PUBLIC_STACK_PROJECT_ID
vercel env add NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY
vercel env add STACK_SECRET_SERVER_KEY
vercel env add DATABASE_URL
```

Or via Vercel Dashboard:
1. Go to Project Settings → Environment Variables
2. Add each variable for Production, Preview, and Development

### Step 6.3: Pull Environment Variables Locally

```bash
vercel link
vercel env pull
```

### Step 6.4: Deploy

```bash
# Deploy to production
vercel --prod

# Force deploy without cache (useful for debugging)
vercel --prod --force
```

---

## Common Issues and Solutions

### Issue 1: StackAssertionError - App JSON Mismatch

**Error**:
```
StackAssertionError: The provided app JSON does not match the configuration
of the existing client app with the same unique identifier
```

**Cause**: Using `StackServerApp` in client components, or mixing server/client configurations.

**Solution**:
1. Create separate files for server (`stack.ts`) and client (`stack-client.ts`) configurations
2. Use `"server-only"` import in `stack.ts`
3. Use `StackClientApp` in `StackProvider`, not `StackServerApp`

```typescript
// src/lib/stack.ts - Server only
import "server-only";
import { StackServerApp } from "@stackframe/stack";

// src/lib/stack-client.ts - Client components
"use client";
import { StackClientApp } from "@stackframe/stack";
```

### Issue 2: Missing Suspense Boundary

**Error**:
```
suspendIfSsr() should be wrapped in a suspense boundary
```

**Cause**: Stack Auth hooks like `useUser()` require Suspense boundaries in Next.js App Router.

**Solution**:
1. Add `src/app/loading.tsx` for app-level Suspense
2. Wrap components using auth hooks in `<Suspense>`:

```typescript
<Suspense fallback={<LoadingSkeleton />}>
  <Navigation />  {/* Uses useUser() */}
</Suspense>
```

### Issue 3: No Secret Server Key

**Error**:
```
No secret server key provided. Please copy your key from the Stack dashboard
and put it in the STACK_SECRET_SERVER_KEY environment variable.
```

**Cause**: Environment variables not configured in Vercel.

**Solution**:
1. Add all Stack Auth environment variables to Vercel
2. Verify with `vercel env pull`
3. Redeploy after adding variables

### Issue 4: Hydration Mismatch

**Error**:
```
Hydration failed because the initial UI does not match what was rendered on the server.
```

**Solution**:
1. Add `suppressHydrationWarning` to `<html>` tag
2. Ensure client/server configurations match

```typescript
<html lang="en" suppressHydrationWarning>
```

### Issue 5: Dynamic Server Usage

**Error**:
```
Dynamic server usage: Route couldn't be rendered statically
```

**Solution**: Add `export const dynamic = 'force-dynamic';` to pages using auth:

```typescript
export const dynamic = 'force-dynamic';

export default async function Page() {
  const user = await stackServerApp.getUser();
  // ...
}
```

---

## File Structure Reference

```
src/
├── app/
│   ├── api/
│   │   ├── health/
│   │   │   └── route.ts
│   │   ├── jobs/
│   │   │   └── route.ts
│   │   └── user/
│   │       ├── saved-jobs/
│   │       │   └── route.ts
│   │       └── search-history/
│   │           └── route.ts
│   ├── handler/
│   │   └── [...stack]/
│   │       └── page.tsx          # Stack Auth handler
│   ├── login/
│   │   └── page.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   ├── search/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx                # Root layout with StackProvider
│   ├── loading.tsx               # Global loading state
│   └── page.tsx                  # Home page
├── components/
│   ├── layout/
│   │   ├── Navigation.tsx
│   │   └── Footer.tsx
│   └── providers/
│       └── StackProvider.tsx     # Client-side Stack provider
├── db/
│   ├── index.ts                  # Drizzle client
│   └── schema.ts                 # Database schema
└── lib/
    ├── stack.ts                  # Server-side Stack Auth (server-only)
    └── stack-client.ts           # Client-side Stack Auth
```

---

## Quick Start Checklist

- [ ] Create Next.js project structure
- [ ] Install dependencies (`@stackframe/stack`, `drizzle-orm`, etc.)
- [ ] Create Stack Auth project at [app.stack-auth.com](https://app.stack-auth.com)
- [ ] Create Neon database at [neon.tech](https://neon.tech)
- [ ] Set up environment variables (`.env.local`)
- [ ] Create server config (`src/lib/stack.ts`) with `"server-only"`
- [ ] Create client config (`src/lib/stack-client.ts`) with `"use client"`
- [ ] Create StackProvider using `StackClientApp`
- [ ] Add `loading.tsx` for Suspense boundary
- [ ] Wrap auth-using components in `<Suspense>`
- [ ] Add `suppressHydrationWarning` to `<html>`
- [ ] Add `export const dynamic = 'force-dynamic'` to auth pages
- [ ] Configure Vercel environment variables
- [ ] Deploy with `vercel --prod`

---

## Additional Resources

- [Stack Auth Documentation](https://docs.stack-auth.com)
- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [Neon Documentation](https://neon.tech/docs)
- [Vercel Documentation](https://vercel.com/docs)

---

*This guide was created based on the actual migration of the LinkedIn Jobs Search project. Last updated: December 2025.*
