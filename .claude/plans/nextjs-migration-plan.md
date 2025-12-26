# LinkedIn Jobs Search - Next.js 迁移计划

## 一、项目现状分析

### 1.1 当前技术栈
| 组件 | 当前技术 | 问题 |
|------|---------|------|
| 前端 | Vanilla JavaScript + HTML | 无组件化，维护困难 |
| 后端 | Express.js | 需要单独部署 |
| 数据库 | Neon PostgreSQL + Drizzle ORM | ✅ 保持不变 |
| 认证 | Stack Auth（未能正常工作） | 与 vanilla JS 不兼容 |
| 样式 | TailwindCSS (CDN) | ✅ 已使用，迁移简单 |
| 部署 | Vercel (Serverless) | ✅ 保持不变 |

### 1.2 现有文件统计
```
总文件数: 78个
├── HTML 页面: 8个 (index, login, dashboard, search, analytics, pricing, api-docs, auth-callback)
├── JavaScript 文件: 约40个
│   ├── 前端 JS: 12个
│   └── 后端 JS: 28个 (controllers, routes, services, middleware)
├── CSS 文件: 12个
└── 组件模板: 2个 (navigation, footer)
```

### 1.3 数据库表结构（保持不变）
- `users` - 用户表（与 Stack Auth 同步）
- `saved_jobs` - 收藏的职位
- `search_history` - 搜索历史
- `search_presets` - 搜索预设

---

## 二、目标架构

### 2.1 新技术栈
| 组件 | 新技术 | 优势 |
|------|--------|------|
| 框架 | Next.js 14 (App Router) | 全栈、SSR、API Routes |
| UI 库 | React 18 | 组件化、生态丰富 |
| 认证 | Stack Auth SDK (@stackframe/stack) | 原生支持，开箱即用 |
| 数据库 | Neon PostgreSQL + Drizzle ORM | 保持不变 |
| 样式 | TailwindCSS (PostCSS) | 构建时优化，更小体积 |
| 语言 | TypeScript | 类型安全，更好的开发体验 |
| 部署 | Vercel | 原生 Next.js 支持 |

### 2.2 目标目录结构
```
linkedin-jobs-search/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx            # 根布局（含 Navigation）
│   │   ├── page.tsx              # 首页 (/)
│   │   ├── login/
│   │   │   └── page.tsx          # 登录页
│   │   ├── dashboard/
│   │   │   └── page.tsx          # 仪表板（受保护）
│   │   ├── search/
│   │   │   └── page.tsx          # 搜索页
│   │   ├── analytics/
│   │   │   └── page.tsx          # 分析页（受保护）
│   │   ├── pricing/
│   │   │   └── page.tsx          # 定价页
│   │   ├── api-docs/
│   │   │   └── page.tsx          # API 文档页
│   │   ├── handler/
│   │   │   └── [...stack]/
│   │   │       └── page.tsx      # Stack Auth 处理器
│   │   └── api/                   # API Routes
│   │       ├── jobs/
│   │       │   └── route.ts      # POST /api/jobs/search
│   │       ├── user/
│   │       │   ├── saved-jobs/
│   │       │   │   └── route.ts  # GET/POST/DELETE
│   │       │   └── search-history/
│   │       │       └── route.ts  # GET/POST
│   │       ├── export/
│   │       │   └── route.ts      # POST /api/export
│   │       ├── analytics/
│   │       │   └── route.ts      # GET /api/analytics
│   │       └── health/
│   │           └── route.ts      # GET /api/health
│   │
│   ├── components/               # React 组件
│   │   ├── layout/
│   │   │   ├── Navigation.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── AuthGuard.tsx
│   │   ├── jobs/
│   │   │   ├── JobCard.tsx
│   │   │   ├── JobList.tsx
│   │   │   └── SearchForm.tsx
│   │   ├── dashboard/
│   │   │   ├── StatsCard.tsx
│   │   │   ├── SavedJobsList.tsx
│   │   │   └── SearchHistoryList.tsx
│   │   └── ui/                   # 通用 UI 组件
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Card.tsx
│   │       └── Modal.tsx
│   │
│   ├── lib/                      # 工具库
│   │   ├── db/
│   │   │   ├── index.ts          # 数据库连接
│   │   │   └── schema.ts         # Drizzle Schema
│   │   ├── linkedin/
│   │   │   └── api.ts            # LinkedIn API 封装
│   │   ├── export/
│   │   │   └── generators.ts     # CSV/Excel/PDF 生成
│   │   └── utils/
│   │       ├── formatters.ts
│   │       └── validators.ts
│   │
│   ├── hooks/                    # React Hooks
│   │   ├── useJobs.ts
│   │   ├── useSavedJobs.ts
│   │   └── useSearchHistory.ts
│   │
│   └── types/                    # TypeScript 类型
│       ├── job.ts
│       ├── user.ts
│       └── api.ts
│
├── public/                       # 静态资源
│   └── assets/
│       └── images/
│           ├── linkedin-jobs-search-logo.svg
│           └── default-avatar.svg
│
├── stack.ts                      # Stack Auth 服务端配置
├── stack.tsx                     # Stack Auth 客户端配置
├── drizzle.config.ts             # Drizzle 配置
├── tailwind.config.ts            # Tailwind 配置
├── next.config.js                # Next.js 配置
├── tsconfig.json                 # TypeScript 配置
├── package.json
└── .env.local                    # 环境变量
```

---

## 三、迁移阶段规划

### 阶段 1：项目初始化（预计 30 分钟）

**任务清单：**
- [ ] 备份现有代码（创建 `backup-vanilla-js` 分支）
- [ ] 初始化 Next.js 14 项目（TypeScript + App Router）
- [ ] 配置 TailwindCSS（PostCSS 方式）
- [ ] 配置 Drizzle ORM（复用现有 schema）
- [ ] 配置 Stack Auth SDK
- [ ] 设置环境变量

**关键配置文件：**
```typescript
// stack.ts - Stack Auth 服务端
import { StackServerApp } from "@stackframe/stack";

export const stackServerApp = new StackServerApp({
  tokenStore: "nextjs-cookie",
  urls: {
    home: "/",
    signIn: "/login",
    afterSignIn: "/dashboard",
    afterSignOut: "/",
  },
});
```

```typescript
// stack.tsx - Stack Auth 客户端
"use client";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "./stack";

export function StackAuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <StackProvider app={stackServerApp}>
      <StackTheme>
        {children}
      </StackTheme>
    </StackProvider>
  );
}
```

---

### 阶段 2：核心布局与认证（预计 1 小时）

**任务清单：**
- [ ] 创建根布局 `layout.tsx`（含 Stack Auth Provider）
- [ ] 迁移 Navigation 组件
- [ ] 迁移 Footer 组件
- [ ] 创建 AuthGuard 组件（页面保护）
- [ ] 创建登录页面（使用 Stack Auth 组件）
- [ ] 创建 Stack Auth Handler 页面

**页面映射：**
| 原始页面 | 新页面 | 认证要求 |
|---------|--------|---------|
| `login.html` | `/login/page.tsx` | 公开 |
| `auth-callback.html` | `/handler/[...stack]/page.tsx` | Stack Auth 处理 |

**认证组件示例：**
```tsx
// src/app/login/page.tsx
import { SignIn } from "@stackframe/stack";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <SignIn />
    </div>
  );
}
```

---

### 阶段 3：API Routes 迁移（预计 1.5 小时）

**任务清单：**
- [ ] 迁移 `/api/jobs/search` → 职位搜索
- [ ] 迁移 `/api/user/saved-jobs` → 收藏管理
- [ ] 迁移 `/api/user/search-history` → 搜索历史
- [ ] 迁移 `/api/export` → 数据导出
- [ ] 迁移 `/api/analytics` → 市场分析
- [ ] 迁移 `/api/health` → 健康检查

**API 映射：**
| 原始路由 | 新路由 | 文件位置 |
|---------|--------|---------|
| POST `/api/jobs/search` | POST `/api/jobs` | `src/app/api/jobs/route.ts` |
| GET `/api/user/saved-jobs` | GET `/api/user/saved-jobs` | `src/app/api/user/saved-jobs/route.ts` |
| POST `/api/user/saved-jobs` | POST `/api/user/saved-jobs` | 同上 |
| DELETE `/api/user/saved-jobs/:id` | DELETE `/api/user/saved-jobs/[id]` | `src/app/api/user/saved-jobs/[id]/route.ts` |
| POST `/api/export/csv` | POST `/api/export` | `src/app/api/export/route.ts` |
| GET `/api/analytics/market` | GET `/api/analytics` | `src/app/api/analytics/route.ts` |

**API Route 示例：**
```typescript
// src/app/api/jobs/route.ts
import { NextRequest, NextResponse } from "next/server";
import linkedIn from "linkedin-jobs-api";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const jobs = await linkedIn.query({
    keyword: body.keyword,
    location: body.location,
    // ... 其他参数
  });

  return NextResponse.json({ success: true, jobs });
}
```

---

### 阶段 4：页面迁移（预计 2 小时）

**任务清单：**
- [ ] 迁移首页 (`index.html` → `/page.tsx`)
- [ ] 迁移搜索页 (`search.html` → `/search/page.tsx`)
- [ ] 迁移仪表板 (`dashboard.html` → `/dashboard/page.tsx`) [受保护]
- [ ] 迁移分析页 (`analytics.html` → `/analytics/page.tsx`) [受保护]
- [ ] 迁移定价页 (`pricing.html` → `/pricing/page.tsx`)
- [ ] 迁移 API 文档页 (`api-docs.html` → `/api-docs/page.tsx`)

**页面映射：**
| 原始页面 | 新页面 | 认证 | 组件 |
|---------|--------|------|------|
| `index.html` | `/page.tsx` | 公开 | Hero, Features, CTA |
| `search.html` | `/search/page.tsx` | 公开 | SearchForm, JobList, JobCard |
| `dashboard.html` | `/dashboard/page.tsx` | **必须登录** | StatsCard, SavedJobsList, SearchHistory |
| `analytics.html` | `/analytics/page.tsx` | **必须登录** | Charts, MarketInsights |
| `pricing.html` | `/pricing/page.tsx` | 公开 | PricingCard |
| `api-docs.html` | `/api-docs/page.tsx` | 公开 | ApiEndpointCard |

**受保护页面示例：**
```tsx
// src/app/dashboard/page.tsx
import { stackServerApp } from "@/stack";
import { redirect } from "next/navigation";
import Dashboard from "@/components/dashboard/Dashboard";

export default async function DashboardPage() {
  const user = await stackServerApp.getUser();

  if (!user) {
    redirect("/login?from=dashboard");
  }

  return <Dashboard user={user} />;
}
```

---

### 阶段 5：组件开发（预计 1.5 小时）

**需要创建的组件：**

| 组件 | 功能 | 复杂度 |
|------|------|--------|
| `Navigation` | 响应式导航栏，用户状态显示 | 中 |
| `Footer` | 页脚链接 | 低 |
| `SearchForm` | 职位搜索表单（多国、多筛选） | 高 |
| `JobCard` | 职位卡片（保存、查看详情） | 中 |
| `JobList` | 职位列表（分页、加载状态） | 中 |
| `SavedJobsList` | 收藏职位列表（状态管理、删除） | 中 |
| `SearchHistoryList` | 搜索历史（快速重搜） | 低 |
| `StatsCard` | 统计数据卡片 | 低 |
| `AuthGuard` | 页面认证保护 | 中 |

---

### 阶段 6：测试与优化（预计 1 小时）

**任务清单：**
- [ ] 测试所有页面路由
- [ ] 测试 OAuth 登录（Google, GitHub）
- [ ] 测试 API 功能
- [ ] 测试受保护页面重定向
- [ ] 测试职位搜索和保存
- [ ] 测试数据导出功能
- [ ] 性能优化（图片、字体加载）
- [ ] 响应式测试

---

## 四、关键技术决策

### 4.1 为什么选择 App Router 而不是 Pages Router？

| 特性 | App Router | Pages Router |
|------|-----------|--------------|
| React Server Components | ✅ 支持 | ❌ 不支持 |
| 嵌套布局 | ✅ 原生支持 | ❌ 需要手动实现 |
| 数据获取 | ✅ 在组件中 fetch | getServerSideProps |
| Stack Auth 推荐 | ✅ 官方推荐 | 社区支持 |
| 未来方向 | ✅ Next.js 主推 | 维护模式 |

**结论：使用 App Router**

### 4.2 为什么使用 TypeScript？

- 类型安全，减少运行时错误
- 更好的 IDE 支持和自动补全
- Stack Auth SDK 提供完整的类型定义
- 与 Drizzle ORM 类型系统完美配合

### 4.3 数据库迁移策略

- **保持现有数据库不变**
- 复用现有 Drizzle schema（转换为 TypeScript）
- 无需数据迁移
- 用户数据、收藏、搜索历史全部保留

---

## 五、环境变量

```env
# .env.local

# Neon Database
DATABASE_URL=postgresql://...

# Stack Auth
NEXT_PUBLIC_STACK_PROJECT_ID=your-project-id
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=pck_...
STACK_SECRET_SERVER_KEY=ssk_...

# Optional
NODE_ENV=development
```

---

## 六、风险评估与缓解

| 风险 | 可能性 | 影响 | 缓解措施 |
|------|--------|------|----------|
| Stack Auth 集成问题 | 低 | 高 | 使用官方文档，参考示例项目 |
| 数据库连接问题 | 低 | 高 | 复用现有 Drizzle 配置 |
| 样式差异 | 中 | 中 | 逐页对比，保持一致 |
| API 兼容性 | 低 | 中 | 保持相同的请求/响应格式 |
| 部署问题 | 低 | 中 | Vercel 原生支持 Next.js |

---

## 七、回滚计划

如果迁移失败，可以通过以下步骤回滚：

1. 切换回 `backup-vanilla-js` 分支
2. 在 Vercel 中重新部署原始版本
3. 分析失败原因，修复后重试

---

## 八、迁移后的优势

1. **认证正常工作** - Stack Auth 原生支持
2. **更好的性能** - SSR、代码分割、自动优化
3. **更易维护** - 组件化、类型安全
4. **更好的 SEO** - 服务端渲染
5. **更好的开发体验** - 热更新、TypeScript
6. **更小的包体积** - 构建时优化 TailwindCSS

---

## 九、时间估算

| 阶段 | 预计时间 |
|------|----------|
| 阶段 1：项目初始化 | 30 分钟 |
| 阶段 2：核心布局与认证 | 1 小时 |
| 阶段 3：API Routes 迁移 | 1.5 小时 |
| 阶段 4：页面迁移 | 2 小时 |
| 阶段 5：组件开发 | 1.5 小时 |
| 阶段 6：测试与优化 | 1 小时 |
| **总计** | **约 7.5 小时** |

---

## 十、待确认事项

在开始迁移之前，请确认以下事项：

1. **是否同意整体迁移方案？**
2. **是否需要保留 API 文档页面？**（可选）
3. **是否需要保留定价页面？**（可选）
4. **是否有其他功能需要优先考虑？**

---

**请审阅此迁移计划，确认后我将开始执行。**
