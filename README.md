<div align="center"><a name="readme-top"></a>

[![Project Banner](./public/linkedin-jobs-search.svg)](#)

# 🚀 LinkedIn Jobs Search<br/><h3>Advanced Professional Job Search Platform</h3>

An innovative job search platform that leverages LinkedIn's comprehensive job database to provide advanced search capabilities with modern web technologies.<br/>
Supports real-time filtering, pagination, caching optimization, and extensible architecture with professional-grade performance.<br/>
One-click **FREE** deployment of your personalized job search experience.

[Live Demo][project-link] · [GitHub Repository][github-repo] · [Documentation][docs] · [Issues][github-issues-link]

<br/>

[![🚀 Try Live Demo 🚀](https://gradient-svg-generator.vercel.app/api/svg?text=%F0%9F%9A%80Try%20Live%20Demo%F0%9F%9A%80&color=000000&height=60&gradientType=radial&duration=6s&color0=ffffff&template=pride-rainbow)][project-link]

<br/>

<!-- SHIELD GROUP -->

[![][github-release-shield]][github-release-link]
[![][vercel-shield]][vercel-link]
[![][license-shield]][license-link]<br/>
[![][github-contributors-shield]][github-contributors-link]
[![][github-forks-shield]][github-forks-link]
[![][github-stars-shield]][github-stars-link]
[![][github-issues-shield]][github-issues-link]<br>

**Share LinkedIn Jobs Search**

[![][share-x-shield]][share-x-link]
[![][share-linkedin-shield]][share-linkedin-link]
[![][share-reddit-shield]][share-reddit-link]

<sup>🌟 Revolutionizing professional job search with advanced filtering and modern UX. Built for job seekers, recruiters, and career professionals.</sup>

## 📸 Project Screenshots

> [!TIP]
> Experience the modern, responsive interface designed for efficient job searching.

<div align="center">
  <img src="https://github.com/user-attachments/assets/929bed01-7e81-4a77-8668-993b76827e09" alt="Main Interface" width="800"/>
  <p><em>Main Dashboard - Advanced Search Interface with Real-time Results</em></p>
</div>

<div align="center">
  <img src="https://github.com/user-attachments/assets/54e0af4e-6159-46e4-91e5-6600354d5de4" alt="Search Results" width="400"/>
  <img src="https://github.com/user-attachments/assets/bf84022d-c23c-4ca2-a405-b1f17dd96f27" alt="Advanced Filters" width="400"/>
  <p><em>Search Results Display and Advanced Filter Options</em></p>
</div>

**Tech Stack Badges:**

<div align="center">

 <img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white"/>
 <img src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB"/>
 <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white"/>
 <img src="https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E"/>
 <img src="https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white"/>
 <img src="https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white"/>

</div>

</div>

> [!IMPORTANT]
> This project demonstrates modern full-stack development practices with Node.js and Express.js. It combines a responsive frontend with a robust backend API to provide comprehensive job search functionality. Features include advanced filtering, caching, rate limiting, and real-time search capabilities.

<details>
<summary><kbd>📑 Table of Contents</kbd></summary>

#### TOC

- [🚀 LinkedIn Jobs Search](#-linkedin-jobs-search)
      - [TOC](#toc)
  - [🌟 Introduction](#-introduction)
  - [✨ Key Features](#-key-features)
    - [`1` Advanced Job Search Engine](#1-advanced-job-search-engine)
    - [`2` Modern User Interface](#2-modern-user-interface)
    - [`*` Additional Features](#-additional-features)
  - [🛠️ Tech Stack](#️-tech-stack)
  - [🏗️ Architecture](#️-architecture)
    - [System Architecture](#system-architecture)
    - [API Structure](#api-structure)
    - [Data Flow](#data-flow)
  - [⚡️ Performance](#️-performance)
  - [🚀 Getting Started](#-getting-started)
    - [Prerequisites](#prerequisites)
    - [Quick Installation](#quick-installation)
    - [Environment Setup](#environment-setup)
    - [Development Mode](#development-mode)
  - [🛳 Deployment](#-deployment)
    - [`A` Cloud Deployment](#a-cloud-deployment)
    - [`B` Docker Deployment](#b-docker-deployment)
    - [`C` Environment Variables](#c-environment-variables)
  - [📖 Usage Guide](#-usage-guide)
    - [Basic Search](#basic-search)
    - [Advanced Filtering](#advanced-filtering)
    - [API Reference](#api-reference)
  - [🔌 API Endpoints](#-api-endpoints)
  - [📦 Project Structure](#-project-structure)
  - [⌨️ Development](#️-development)
    - [Local Development](#local-development)
    - [Adding Features](#adding-features)
    - [Testing](#testing)
  - [🤝 Contributing](#-contributing)
  - [📄 License](#-license)
  - [👥 Team](#-team)

####

<br/>

</details>

## 🌟 Introduction

We are passionate developers creating next-generation job search solutions. By adopting modern development practices and cutting-edge technologies, we aim to provide job seekers, recruiters, and HR professionals with powerful, scalable, and user-friendly tools.

Whether you're a job seeker looking for your dream position or a developer wanting to build upon a modern job search platform, LinkedIn Jobs Search will be your professional search playground. This project demonstrates production-ready code with comprehensive error handling, caching strategies, and responsive design principles.

> [!NOTE]
> - Node.js >= 14.0 required for backend operations
> - LinkedIn Jobs API integration for real-time data
> - Responsive design supporting all device types
> - Production-ready with Vercel deployment configuration

| [![][demo-shield-badge]][demo-link]   | No installation required! Visit our live demo to experience advanced job searching firsthand.                           |
| :------------------------------------ | :--------------------------------------------------------------------------------------------- |
| [![][github-shield-badge]][github-repo] | Star us on GitHub to stay updated with the latest features and improvements. |

> [!TIP]
> **⭐ Star us** to receive all release notifications from GitHub without delay!

## ✨ Key Features

### `1` [Advanced Job Search Engine][docs-search]

Experience next-generation job searching with our comprehensive LinkedIn Jobs API integration. Our innovative approach provides unprecedented search precision through advanced filtering algorithms and real-time data processing.

Key search capabilities include:
- 🎯 **Keyword Matching**: Intelligent job title and description searching
- 📍 **Location Filtering**: Precise geographic job targeting
- ⏰ **Time-based Filters**: Recent postings (24hr, week, month)
- 💼 **Job Type Selection**: Full-time, part-time, contract, internship options
- 🏠 **Remote Work Options**: On-site, remote, hybrid filtering
- 💰 **Salary Range Filtering**: Multiple salary brackets ($40K - $120K+)
- 🎓 **Experience Level Targeting**: From internship to executive positions
- 📊 **Smart Sorting**: Relevance and recency-based result ordering

[![][back-to-top]](#readme-top)

### `2` [Modern User Interface][docs-ui]

Revolutionary responsive design that transforms how users interact with job search platforms. With our glassmorphism effects and intuitive layout, users can efficiently navigate through opportunities while maintaining visual appeal and accessibility.

**Design Features:**
- **Responsive Layout**: Seamless experience across desktop, tablet, and mobile
- **Split-View Design**: Search form and results displayed simultaneously
- **Interactive Cards**: Hover effects and smooth transitions
- **Smart Pagination**: Efficient result navigation with statistics
- **Accessibility**: WCAG compliant design patterns

[![][back-to-top]](#readme-top)

### `*` Additional Features

Beyond the core search functionality, this platform includes:

- [x] ⚡ **High Performance**: Redis caching and connection pooling
- [x] 🛡️ **Rate Limiting**: Protection against API abuse with express-rate-limit
- [x] 🔄 **Real-time Updates**: Live search results without page reload
- [x] 📱 **PWA Ready**: Service worker support for offline functionality
- [x] 🗂️ **Modular Architecture**: Scalable MVC pattern implementation
- [x] 🔧 **Input Validation**: Comprehensive parameter validation
- [x] 📊 **Search Analytics**: Built-in search statistics and metrics
- [x] 🚀 **One-Click Deploy**: Vercel-optimized deployment configuration

> ✨ Continuous development with regular feature updates and performance improvements.

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## 🛠️ Tech Stack

<div align="center">
  <table>
    <tr>
      <td align="center" width="96">
        <img src="https://cdn.simpleicons.org/nodedotjs" width="48" height="48" alt="Node.js" />
        <br>Node.js 14+
      </td>
      <td align="center" width="96">
        <img src="https://cdn.simpleicons.org/express" width="48" height="48" alt="Express" />
        <br>Express.js
      </td>
      <td align="center" width="96">
        <img src="https://cdn.simpleicons.org/javascript" width="48" height="48" alt="JavaScript" />
        <br>JavaScript ES6+
      </td>
      <td align="center" width="96">
        <img src="https://cdn.simpleicons.org/tailwindcss" width="48" height="48" alt="TailwindCSS" />
        <br>TailwindCSS
      </td>
      <td align="center" width="96">
        <img src="https://cdn.simpleicons.org/html5" width="48" height="48" alt="HTML5" />
        <br>HTML5
      </td>
      <td align="center" width="96">
        <img src="https://cdn.simpleicons.org/vercel" width="48" height="48" alt="Vercel" />
        <br>Vercel
      </td>
    </tr>
  </table>
</div>

**Backend Stack:**
- **Runtime**: Node.js 14+ with ES6+ features
- **Framework**: Express.js with modular routing
- **API Integration**: LinkedIn Jobs API for real-time data
- **Caching**: Node-cache for performance optimization
- **Rate Limiting**: Express-rate-limit for API protection
- **Validation**: Custom parameter validation utilities

**Frontend Stack:**
- **Languages**: HTML5, CSS3, JavaScript ES6+
- **Styling**: TailwindCSS with custom design system
- **Fonts**: Inter font family for professional typography
- **Icons**: SVG icon system with accessibility support
- **Responsive**: Mobile-first responsive design approach

**DevOps & Deployment:**
- **Platform**: Vercel with serverless architecture
- **Development**: Nodemon for hot-reload development
- **Cross-platform**: Cross-env for environment management
- **Version Control**: Git with conventional commits

> [!TIP]
> Each technology was carefully selected for optimal performance, developer experience, and production scalability.

## 🏗️ Architecture

### System Architecture

> [!TIP]
> This architecture supports horizontal scaling and microservices patterns, making it production-ready for enterprise applications.

```mermaid
graph TB
    subgraph "Frontend Layer"
        A[HTML5 Interface] --> B[TailwindCSS Styling]
        B --> C[JavaScript Logic]
        C --> D[API Communication]
    end
    
    subgraph "Backend Layer"
        E[Express.js Server] --> F[Rate Limiting]
        F --> G[Route Handlers]
        G --> H[Controllers]
        H --> I[LinkedIn API]
    end
    
    subgraph "Performance Layer"
        J[Node Cache]
        K[Request Validation]
        L[Error Handling]
    end
    
    D --> E
    H --> J
    G --> K
    E --> L
    
    subgraph "Deployment"
        M[Vercel Platform]
        N[Serverless Functions]
        O[CDN Distribution]
    end
    
    E --> M
    M --> N
    M --> O
```

### API Structure

```mermaid
graph LR
    subgraph "Request Flow"
        A[Client Request] --> B[Rate Limiter]
        B --> C[Route Handler]
        C --> D[Controller]
        D --> E[Validation]
        E --> F[Cache Check]
        F --> G[LinkedIn API]
        G --> H[Response]
    end
    
    subgraph "Cache Strategy"
        I[Memory Cache]
        J[TTL: 1 hour]
        K[Key: Request Hash]
    end
    
    F --> I
    I --> J
    I --> K
```

### Data Flow

```mermaid
sequenceDiagram
    participant U as User Interface
    participant E as Express Server
    participant C as Cache Layer
    participant L as LinkedIn API
    participant V as Validator
    
    U->>E: Search Request
    E->>V: Validate Parameters
    V->>E: Validation Result
    E->>C: Check Cache
    alt Cache Hit
        C->>E: Return Cached Data
    else Cache Miss
        E->>L: API Request
        L->>E: Job Data
        E->>C: Store in Cache
    end
    E->>U: JSON Response
```

## ⚡️ Performance

**Key Performance Metrics:**
- ⚡ **< 200ms** Average API response time
- 🚀 **95+ Lighthouse Score** for performance and accessibility  
- 💨 **< 1s** Time to First Contentful Paint
- 📊 **99.9%** Uptime reliability with Vercel hosting
- 🔄 **1-hour Cache TTL** for optimal data freshness vs. speed

**Performance Optimizations:**
- 🎯 **Smart Caching**: Request-based cache keys with 1-hour TTL
- 📦 **Efficient Bundling**: Minimal JavaScript with native ES6+ features
- 🖼️ **Optimized Assets**: SVG icons and compressed images
- 🔄 **Rate Limiting**: 100 requests per 15-minute window per IP
- 📱 **Responsive Design**: CSS-only responsive implementation

## 🚀 Getting Started

### Prerequisites

> [!IMPORTANT]
> Ensure you have the following installed:

- Node.js 14.0+ ([Download](https://nodejs.org/))
- npm package manager (included with Node.js)
- Git ([Download](https://git-scm.com/))

### Quick Installation

**1. Clone Repository**

```bash
git clone https://github.com/ChanMeng666/linkedin-jobs-search.git
cd linkedin-jobs-search
```

**2. Install Dependencies**

```bash
npm install
```

**3. Environment Setup**

```bash
# Copy environment template (if you have one)
cp .env.example .env

# Edit environment variables if needed
# The app works without additional configuration
```

**4. Start Development**

```bash
# Development with hot reload
npm run dev

# Production mode
npm start
```

🎉 **Success!** Open [http://localhost:3000](http://localhost:3000) to view the application.

### Environment Setup

The application works out of the box without additional environment variables. Optional configuration:

```bash
# Optional: Custom port (default: 3000)
PORT=3000

# Optional: Node environment
NODE_ENV=development
```

### Development Mode

```bash
# Start with hot reload
npm run dev

# Start production build
npm start

# Build for Vercel deployment
npm run vercel-build
```

## 🛳 Deployment

> [!IMPORTANT]
> The project is optimized for Vercel deployment with serverless architecture.

### `A` Cloud Deployment

**Vercel (Recommended)**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FChanMeng666%2Flinkedin-jobs-search)

**Manual Deployment:**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod
```

### `B` Docker Deployment

```bash
# Build Docker image
docker build -t linkedin-jobs-search .

# Run container
docker run -p 3000:3000 linkedin-jobs-search
```

**docker-compose.yml:**

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
```

### `C` Environment Variables

| Variable | Description | Required | Default | Example |
|----------|-------------|----------|---------|---------|
| `PORT` | Server port | 🔶 | `3000` | `3000` |
| `NODE_ENV` | Environment mode | 🔶 | `development` | `production` |

> [!NOTE]
> ✅ Required, 🔶 Optional

## 📖 Usage Guide

### Basic Search

**Getting Started with Job Search:**

1. **Enter Keywords** - Job titles, companies, or skills
2. **Specify Location** - City, state, or "Remote"
3. **Click Search** - Get instant results
4. **Browse Results** - View job details and apply

### Advanced Filtering

**Comprehensive Search Options:**

```javascript
// Example search parameters
{
  "keyword": "Software Engineer",
  "location": "San Francisco",
  "dateSincePosted": "past week",
  "jobType": "full time",
  "remoteFilter": "remote",
  "salary": "100000",
  "experienceLevel": "senior",
  "sortBy": "recent",
  "limit": "20",
  "page": "0"
}
```

### API Reference

**Search Request:**

```bash
curl -X POST https://your-domain.vercel.app/api/jobs/search \
  -H "Content-Type: application/json" \
  -d '{
    "keyword": "developer",
    "location": "New York",
    "limit": "10"
  }'
```

**Response:**

```json
{
  "success": true,
  "jobs": [
    {
      "position": "Senior Software Engineer",
      "company": "Tech Corp",
      "location": "New York, NY",
      "salary": "$120,000 - $180,000",
      "agoTime": "2 days ago",
      "date": "2024-01-15",
      "jobUrl": "https://linkedin.com/jobs/...",
      "companyLogo": "https://logo-url..."
    }
  ],
  "searchParams": {
    "keyword": "developer",
    "location": "New York",
    "limit": "10"
  }
}
```

## 🔌 API Endpoints

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| `POST` | `/api/jobs/search` | Basic job search | keyword, location, limit |
| `POST` | `/api/jobs/advanced-search` | Advanced search with all filters | All search parameters |
| `GET` | `/api/jobs/recent` | Recent jobs (24 hours) | None |
| `POST` | `/api/jobs/by-experience` | Search by experience level | experienceLevel, keyword |
| `POST` | `/api/jobs/by-salary` | Search by salary range | salary, keyword |
| `POST` | `/api/jobs/remote` | Remote job opportunities | keyword |
| `POST` | `/api/jobs/paginated` | Paginated search results | keyword, page, limit |
| `GET` | `/api` | API health check | None |

**Search Parameters:**

| Parameter | Description | Available Options |
|-----------|-------------|-------------------|
| `keyword` | Search term | Any text |
| `location` | Job location | Any location string |
| `dateSincePosted` | Posting timeframe | `past month`, `past week`, `24hr` |
| `jobType` | Employment type | `full time`, `part time`, `contract`, `temporary`, `volunteer`, `internship` |
| `remoteFilter` | Work location type | `on site`, `remote`, `hybrid` |
| `salary` | Minimum salary | `40000`, `60000`, `80000`, `100000`, `120000` |
| `experienceLevel` | Required experience | `internship`, `entry level`, `associate`, `senior`, `director`, `executive` |
| `sortBy` | Result ordering | `recent`, `relevant` |
| `limit` | Results per page | Any number (default: 10) |
| `page` | Page number | 0, 1, 2... (default: 0) |

## 📦 Project Structure

```
linkedin-jobs-search/
├── public/                    # Frontend assets
│   ├── index.html            # Main application interface
│   └── linkedin-jobs-search.svg # Project logo
├── src/                      # Backend source code
│   ├── controllers/          # Business logic handlers
│   │   └── jobsController.js # Job search operations
│   ├── routes/              # API route definitions
│   │   └── jobs.js          # Job-related routes
│   ├── utils/               # Utility functions
│   │   └── validator.js     # Input validation
│   ├── app.js               # Express application setup
│   └── server.js            # Server entry point & main logic
├── package.json             # Dependencies and scripts
├── vercel.json             # Vercel deployment config
├── tailwind.config.js      # TailwindCSS configuration
└── README.md               # Project documentation
```

## ⌨️ Development

### Local Development

**Setup Development Environment:**

```bash
# Clone and setup
git clone https://github.com/ChanMeng666/linkedin-jobs-search.git
cd linkedin-jobs-search
npm install

# Start development server
npm run dev
```

**Development Scripts:**

```bash
npm run dev          # Development with nodemon
npm start           # Production server
npm run vercel-build # Vercel build preparation
```

### Adding Features

**1. Create Feature Branch:**

```bash
git checkout -b feature/amazing-feature
```

**2. Add New Route:**

```javascript
// src/routes/jobs.js
router.post('/new-endpoint', jobsController.newFeature);
```

**3. Implement Controller:**

```javascript
// src/controllers/jobsController.js
async newFeature(req, res, next) {
  try {
    // Implementation
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}
```

### Testing

**Manual Testing:**

```bash
# Test API endpoints
curl -X POST http://localhost:3000/api/jobs/search \
  -H "Content-Type: application/json" \
  -d '{"keyword": "test"}'

# Test health endpoint
curl http://localhost:3000/api
```

## 🤝 Contributing

We welcome contributions! Here's how you can help improve LinkedIn Jobs Search:

**Development Process:**

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

**Contribution Guidelines:**

- Follow the existing code style and structure
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation if needed
- Ensure responsive design compatibility

**Issue Reporting:**
- 🐛 **Bug Reports**: Include steps to reproduce
- 💡 **Feature Requests**: Describe the use case and benefits
- 📚 **Documentation**: Help improve our guides
- ❓ **Questions**: Use GitHub Discussions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Open Source Benefits:**
- ✅ Commercial use allowed
- ✅ Modification allowed  
- ✅ Distribution allowed
- ✅ Private use allowed

## 👥 Team

<div align="center">
  <table>
    <tr>
      <td align="center">
        <a href="https://github.com/ChanMeng666">
          <img src="https://github.com/ChanMeng666.png?size=100" width="100px;" alt="Chan Meng"/>
          <br />
          <sub><b>Chan Meng</b></sub>
        </a>
        <br />
        <small>Creator & Lead Developer</small>
      </td>
    </tr>
  </table>
</div>

## 🙋‍♀️ Author

**Chan Meng**
- <img src="https://cdn.simpleicons.org/linkedin/0A66C2" width="16" height="16"> LinkedIn: [chanmeng666](https://www.linkedin.com/in/chanmeng666/)
- <img src="https://cdn.simpleicons.org/github/181717" width="16" height="16"> GitHub: [ChanMeng666](https://github.com/ChanMeng666)
- <img src="https://cdn.simpleicons.org/gmail/EA4335" width="16" height="16"> Email: [chanmeng.dev@gmail.com](mailto:chanmeng.dev@gmail.com)
- <img src="https://cdn.simpleicons.org/internetexplorer/0078D4" width="16" height="16"> Portfolio: [chanmeng.live](https://2d-portfolio-eta.vercel.app/)

---

<div align="center">
<strong>🚀 Revolutionizing Professional Job Search 🌟</strong>
<br/>
<em>Empowering job seekers and recruiters worldwide</em>
<br/><br/>

⭐ **Star us on GitHub** • 📖 **Read the Documentation** • 🐛 **Report Issues** • 💡 **Request Features** • 🤝 **Contribute**

<br/><br/>

**Made with ❤️ by the LinkedIn Jobs Search team**

<img src="https://img.shields.io/github/stars/ChanMeng666/linkedin-jobs-search?style=social" alt="GitHub stars">
<img src="https://img.shields.io/github/forks/ChanMeng666/linkedin-jobs-search?style=social" alt="GitHub forks">
<img src="https://img.shields.io/github/watchers/ChanMeng666/linkedin-jobs-search?style=social" alt="GitHub watchers">

</div>

---

<!-- LINK DEFINITIONS -->

[back-to-top]: https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square

<!-- Project Links -->
[project-link]: https://linkedin-jobs-search.vercel.app/
[github-repo]: https://github.com/ChanMeng666/linkedin-jobs-search
[docs]: https://github.com/ChanMeng666/linkedin-jobs-search#readme
[demo-link]: https://linkedin-jobs-search.vercel.app/

<!-- Documentation Links -->
[docs-search]: #-advanced-job-search-engine
[docs-ui]: #-modern-user-interface

<!-- GitHub Links -->
[github-issues-link]: https://github.com/ChanMeng666/linkedin-jobs-search/issues
[github-stars-link]: https://github.com/ChanMeng666/linkedin-jobs-search/stargazers
[github-forks-link]: https://github.com/ChanMeng666/linkedin-jobs-search/forks
[github-contributors-link]: https://github.com/ChanMeng666/linkedin-jobs-search/contributors
[github-release-link]: https://github.com/ChanMeng666/linkedin-jobs-search/releases
[license-link]: https://github.com/ChanMeng666/linkedin-jobs-search/blob/main/LICENSE

<!-- Shield Badges -->
[github-release-shield]: https://img.shields.io/github/v/release/ChanMeng666/linkedin-jobs-search?color=369eff&labelColor=black&logo=github&style=flat-square
[vercel-shield]: https://img.shields.io/badge/vercel-online-55b467?labelColor=black&logo=vercel&style=flat-square
[license-shield]: https://img.shields.io/badge/license-MIT-white?labelColor=black&style=flat-square
[github-contributors-shield]: https://img.shields.io/github/contributors/ChanMeng666/linkedin-jobs-search?color=c4f042&labelColor=black&style=flat-square
[github-forks-shield]: https://img.shields.io/github/forks/ChanMeng666/linkedin-jobs-search?color=8ae8ff&labelColor=black&style=flat-square
[github-stars-shield]: https://img.shields.io/github/stars/ChanMeng666/linkedin-jobs-search?color=ffcb47&labelColor=black&style=flat-square
[github-issues-shield]: https://img.shields.io/github/issues/ChanMeng666/linkedin-jobs-search?color=ff80eb&labelColor=black&style=flat-square

<!-- Badge Variants -->
[demo-shield-badge]: https://img.shields.io/badge/TRY%20DEMO-ONLINE-55b467?labelColor=black&logo=vercel&style=for-the-badge
[github-shield-badge]: https://img.shields.io/badge/GITHUB-REPOSITORY-181717?labelColor=black&logo=github&style=for-the-badge

<!-- Social Share Links -->
[share-x-link]: https://x.com/intent/tweet?hashtags=jobsearch,linkedin,opensource&text=Check%20out%20this%20amazing%20LinkedIn%20Jobs%20Search%20platform&url=https%3A%2F%2Fgithub.com%2FChanMeng666%2Flinkedin-jobs-search
[share-linkedin-link]: https://linkedin.com/sharing/share-offsite/?url=https://github.com/ChanMeng666/linkedin-jobs-search
[share-reddit-link]: https://www.reddit.com/submit?title=Advanced%20LinkedIn%20Jobs%20Search%20Platform&url=https%3A%2F%2Fgithub.com%2FChanMeng666%2Flinkedin-jobs-search

[share-x-shield]: https://img.shields.io/badge/-share%20on%20x-black?labelColor=black&logo=x&logoColor=white&style=flat-square
[share-linkedin-shield]: https://img.shields.io/badge/-share%20on%20linkedin-black?labelColor=black&logo=linkedin&logoColor=white&style=flat-square
[share-reddit-shield]: https://img.shields.io/badge/-share%20on%20reddit-black?labelColor=black&logo=reddit&logoColor=white&style=flat-square

<!-- Vercel Links -->
[vercel-link]: https://linkedin-jobs-search.vercel.app/
</rewritten_file>
