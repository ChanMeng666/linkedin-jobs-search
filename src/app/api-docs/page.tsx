"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function ApiDocsPage() {
  const [activeTab, setActiveTab] = useState<'javascript' | 'python' | 'curl'>('javascript');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="card p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-stone-900 mb-4">Documentation</h2>
              <nav className="space-y-1">
                <SidebarLink href="#introduction">Introduction</SidebarLink>
                <SidebarLink href="#authentication">Authentication</SidebarLink>
                <SidebarLink href="#endpoints">Endpoints</SidebarLink>
                <SidebarLink href="#search">Search Jobs</SidebarLink>
                <SidebarLink href="#parameters">Parameters</SidebarLink>
                <SidebarLink href="#examples">Code Examples</SidebarLink>
                <SidebarLink href="#errors">Error Handling</SidebarLink>
                <SidebarLink href="#rate-limits">Rate Limits</SidebarLink>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Introduction */}
            <section id="introduction" className="mb-12">
              <h1 className="text-3xl font-bold text-stone-900 mb-4">API Documentation</h1>
              <p className="text-stone-600 mb-6">
                Welcome to the JobSearch API! Our RESTful API allows you to integrate LinkedIn job search capabilities directly into your application.
              </p>
              <div className="card p-4 flex items-start gap-3 bg-blue-50 border-blue-200">
                <span className="text-xl">ℹ️</span>
                <div>
                  <h3 className="font-semibold text-stone-900">Base URL</h3>
                  <code className="text-sm bg-white px-2 py-1 rounded border border-stone-200">
                    https://linkedin-jobs-search.vercel.app/api
                  </code>
                </div>
              </div>
            </section>

            {/* Authentication */}
            <section id="authentication" className="mb-12">
              <h2 className="text-2xl font-bold text-stone-900 mb-4">Authentication</h2>
              <p className="text-stone-600 mb-4">
                Currently, the API does not require authentication for basic usage. Premium features require an API key.
              </p>
              <CodeBlock
                code={`// Include API key in headers (for premium users)
headers: {
  'Authorization': 'Bearer YOUR_API_KEY',
  'Content-Type': 'application/json'
}`}
                id="auth-code"
                copiedCode={copiedCode}
                onCopy={copyCode}
              />
            </section>

            {/* Endpoints */}
            <section id="endpoints" className="mb-12">
              <h2 className="text-2xl font-bold text-stone-900 mb-4">Available Endpoints</h2>
              <div className="space-y-3">
                <EndpointCard method="GET" path="/api" description="Health check and API information" />
                <EndpointCard method="POST" path="/api/jobs/search" description="Search for jobs with advanced filters" />
                <EndpointCard method="GET" path="/api/geo-stats" description="Get GEO monitoring statistics" />
              </div>
            </section>

            {/* Search Endpoint */}
            <section id="search" className="mb-12">
              <h2 className="text-2xl font-bold text-stone-900 mb-4">POST /api/jobs/search</h2>
              <p className="text-stone-600 mb-6">
                Search for jobs with comprehensive filtering options.
              </p>

              <h3 className="text-lg font-semibold text-stone-900 mb-3">Request Body</h3>
              <CodeBlock
                code={`{
  "keyword": "software engineer",
  "location": "San Francisco",
  "dateSincePosted": "past week",
  "jobType": "full time",
  "remoteFilter": "remote",
  "salary": "100000",
  "experienceLevel": "senior",
  "sortBy": "recent",
  "limit": "10",
  "page": "0"
}`}
                id="request-body"
                copiedCode={copiedCode}
                onCopy={copyCode}
              />

              <h3 className="text-lg font-semibold text-stone-900 mb-3 mt-6">Response</h3>
              <CodeBlock
                code={`{
  "success": true,
  "data": [
    {
      "jobTitle": "Senior Software Engineer",
      "company": "Tech Company Inc.",
      "location": "San Francisco, CA",
      "salary": "$120K - $180K",
      "jobType": "Full-time",
      "posted": "2 days ago",
      "link": "https://linkedin.com/jobs/...",
      "description": "..."
    }
  ],
  "totalResults": 156,
  "page": 0,
  "limit": 10
}`}
                id="response-body"
                copiedCode={copiedCode}
                onCopy={copyCode}
              />
            </section>

            {/* Parameters */}
            <section id="parameters" className="mb-12">
              <h2 className="text-2xl font-bold text-stone-900 mb-4">Search Parameters</h2>
              <div className="card overflow-hidden">
                <table className="w-full">
                  <thead className="bg-stone-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-stone-900">Parameter</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-stone-900">Type</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-stone-900">Description</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-stone-900">Example</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    <ParamRow param="keyword" type="string" desc="Job title or skills to search" example='"software developer"' />
                    <ParamRow param="location" type="string" desc='City, state, or "Remote"' example='"New York"' />
                    <ParamRow param="dateSincePosted" type="string" desc="Time filter" example='"past week", "24hr"' />
                    <ParamRow param="salary" type="string" desc="Minimum salary" example='"80000", "100000"' />
                    <ParamRow param="jobType" type="string" desc="Employment type" example='"full time", "contract"' />
                    <ParamRow param="remoteFilter" type="string" desc="Work location type" example='"remote", "hybrid"' />
                    <ParamRow param="experienceLevel" type="string" desc="Required experience" example='"senior", "entry level"' />
                    <ParamRow param="sortBy" type="string" desc="Sort order" example='"recent", "relevant"' />
                    <ParamRow param="limit" type="string" desc="Results per page" example='"10", "50"' />
                    <ParamRow param="page" type="string" desc="Page number (0-indexed)" example='"0", "1"' />
                  </tbody>
                </table>
              </div>
            </section>

            {/* Code Examples */}
            <section id="examples" className="mb-12">
              <h2 className="text-2xl font-bold text-stone-900 mb-4">Code Examples</h2>

              {/* Language Tabs */}
              <div className="flex gap-2 mb-4">
                <TabButton active={activeTab === 'javascript'} onClick={() => setActiveTab('javascript')}>
                  JavaScript
                </TabButton>
                <TabButton active={activeTab === 'python'} onClick={() => setActiveTab('python')}>
                  Python
                </TabButton>
                <TabButton active={activeTab === 'curl'} onClick={() => setActiveTab('curl')}>
                  cURL
                </TabButton>
              </div>

              {activeTab === 'javascript' && (
                <CodeBlock
                  code={`// Fetch API example
const searchJobs = async () => {
  const response = await fetch('https://linkedin-jobs-search.vercel.app/api/jobs/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      keyword: 'frontend developer',
      location: 'San Francisco',
      remoteFilter: 'remote',
      salary: '100000',
      limit: '20'
    })
  });

  const data = await response.json();
  console.log(data);
};

searchJobs();`}
                  id="js-example"
                  copiedCode={copiedCode}
                  onCopy={copyCode}
                />
              )}

              {activeTab === 'python' && (
                <CodeBlock
                  code={`import requests

url = 'https://linkedin-jobs-search.vercel.app/api/jobs/search'

payload = {
    'keyword': 'frontend developer',
    'location': 'San Francisco',
    'remoteFilter': 'remote',
    'salary': '100000',
    'limit': '20'
}

response = requests.post(url, json=payload)
data = response.json()

print(data)`}
                  id="py-example"
                  copiedCode={copiedCode}
                  onCopy={copyCode}
                />
              )}

              {activeTab === 'curl' && (
                <CodeBlock
                  code={`curl -X POST https://linkedin-jobs-search.vercel.app/api/jobs/search \\
  -H "Content-Type: application/json" \\
  -d '{
    "keyword": "frontend developer",
    "location": "San Francisco",
    "remoteFilter": "remote",
    "salary": "100000",
    "limit": "20"
  }'`}
                  id="curl-example"
                  copiedCode={copiedCode}
                  onCopy={copyCode}
                />
              )}
            </section>

            {/* Errors */}
            <section id="errors" className="mb-12">
              <h2 className="text-2xl font-bold text-stone-900 mb-4">Error Handling</h2>
              <p className="text-stone-600 mb-6">
                The API uses standard HTTP status codes to indicate success or failure.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <ErrorCard code="200" title="OK" description="Request successful" color="green" />
                <ErrorCard code="400" title="Bad Request" description="Invalid parameters" color="yellow" />
                <ErrorCard code="429" title="Too Many Requests" description="Rate limit exceeded" color="orange" />
                <ErrorCard code="500" title="Server Error" description="Internal server error" color="red" />
              </div>
            </section>

            {/* Rate Limits */}
            <section id="rate-limits" className="mb-12">
              <h2 className="text-2xl font-bold text-stone-900 mb-4">Rate Limits</h2>
              <p className="text-stone-600 mb-6">
                To ensure fair usage, API requests are rate limited based on your plan.
              </p>

              <div className="card overflow-hidden mb-8">
                <table className="w-full">
                  <thead className="bg-stone-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-stone-900">Plan</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-stone-900">Requests</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-stone-900">Window</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    <tr>
                      <td className="px-4 py-3 font-medium text-stone-900">Free</td>
                      <td className="px-4 py-3 text-stone-600">100 requests</td>
                      <td className="px-4 py-3 text-stone-600">per 15 minutes</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-stone-900">Pro</td>
                      <td className="px-4 py-3 text-stone-600">1000 requests</td>
                      <td className="px-4 py-3 text-stone-600">per 15 minutes</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-stone-900">Enterprise</td>
                      <td className="px-4 py-3 text-stone-600">Custom</td>
                      <td className="px-4 py-3 text-stone-600">-</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="card p-6 bg-gradient-to-r from-brand-primary to-brand-secondary text-white">
                <h3 className="text-xl font-bold mb-2">Need higher limits?</h3>
                <p className="text-white/80 mb-4">Upgrade to Pro or contact us for Enterprise pricing.</p>
                <div className="flex gap-3">
                  <Link href="/pricing" className="px-4 py-2 bg-white text-brand-primary font-semibold rounded-lg hover:bg-stone-100 transition-colors">
                    View Pricing
                  </Link>
                  <a href="mailto:chanmeng.dev@gmail.com" className="px-4 py-2 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors">
                    Contact Sales
                  </a>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

function SidebarLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="block px-3 py-2 text-sm text-stone-600 hover:text-brand-primary hover:bg-blue-50 rounded-lg transition-colors"
    >
      {children}
    </a>
  );
}

function EndpointCard({ method, path, description }: { method: string; path: string; description: string }) {
  const methodColors = {
    GET: 'bg-emerald-100 text-emerald-700',
    POST: 'bg-blue-100 text-blue-700',
  };

  return (
    <div className="card p-4 flex items-center gap-4">
      <span className={`px-3 py-1 text-xs font-bold rounded ${methodColors[method as keyof typeof methodColors]}`}>
        {method}
      </span>
      <div>
        <code className="text-stone-900 font-medium">{path}</code>
        <p className="text-sm text-stone-500">{description}</p>
      </div>
    </div>
  );
}

function CodeBlock({ code, id, copiedCode, onCopy }: {
  code: string;
  id: string;
  copiedCode: string | null;
  onCopy: (code: string, id: string) => void;
}) {
  return (
    <div className="relative">
      <button
        onClick={() => onCopy(code, id)}
        className={`absolute top-3 right-3 px-3 py-1 text-xs font-medium rounded transition-colors ${
          copiedCode === id
            ? 'bg-emerald-100 text-emerald-700'
            : 'bg-stone-700 text-stone-300 hover:bg-stone-600'
        }`}
      >
        {copiedCode === id ? 'Copied!' : 'Copy'}
      </button>
      <pre className="bg-stone-800 text-stone-100 p-4 rounded-xl overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function ParamRow({ param, type, desc, example }: {
  param: string;
  type: string;
  desc: string;
  example: string;
}) {
  return (
    <tr>
      <td className="px-4 py-3">
        <code className="text-sm bg-stone-100 px-2 py-1 rounded">{param}</code>
      </td>
      <td className="px-4 py-3 text-sm text-stone-600">{type}</td>
      <td className="px-4 py-3 text-sm text-stone-600">{desc}</td>
      <td className="px-4 py-3 text-sm text-stone-500">{example}</td>
    </tr>
  );
}

function TabButton({ active, onClick, children }: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
        active
          ? 'bg-brand-primary text-white'
          : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
      }`}
    >
      {children}
    </button>
  );
}

function ErrorCard({ code, title, description, color }: {
  code: string;
  title: string;
  description: string;
  color: 'green' | 'yellow' | 'orange' | 'red';
}) {
  const colorClasses = {
    green: 'bg-emerald-100 text-emerald-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    orange: 'bg-orange-100 text-orange-700',
    red: 'bg-red-100 text-red-700',
  };

  return (
    <div className="card p-4 flex items-center gap-4">
      <span className={`px-3 py-2 text-lg font-bold rounded ${colorClasses[color]}`}>
        {code}
      </span>
      <div>
        <h4 className="font-semibold text-stone-900">{title}</h4>
        <p className="text-sm text-stone-500">{description}</p>
      </div>
    </div>
  );
}
