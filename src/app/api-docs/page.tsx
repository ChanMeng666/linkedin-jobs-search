"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Column, Flex, Heading, Text, Button, Line } from '@once-ui-system/core';

export default function ApiDocsPage() {
  const [activeTab, setActiveTab] = useState<'javascript' | 'python' | 'curl'>('javascript');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <Column maxWidth="l" gap="xl" paddingY="xl" fillWidth>
      <Flex gap="32" wrap>
        {/* Sidebar */}
        <Column
          padding="24"
          gap="16"
          radius="l"
          border="neutral-alpha-weak"
          background="surface"
          className="glass-card s-flex-hide"
          style={{ flex: '0 0 240px', position: 'sticky', top: 100, alignSelf: 'flex-start' }}
        >
          <Text variant="heading-strong-m">Documentation</Text>
          <Column gap="4">
            <SidebarLink href="#introduction">Introduction</SidebarLink>
            <SidebarLink href="#authentication">Authentication</SidebarLink>
            <SidebarLink href="#endpoints">Endpoints</SidebarLink>
            <SidebarLink href="#search">Search Jobs</SidebarLink>
            <SidebarLink href="#parameters">Parameters</SidebarLink>
            <SidebarLink href="#examples">Code Examples</SidebarLink>
            <SidebarLink href="#errors">Error Handling</SidebarLink>
            <SidebarLink href="#rate-limits">Rate Limits</SidebarLink>
          </Column>
        </Column>

        {/* Main Content */}
        <Column gap="48" style={{ flex: '1 1 600px', minWidth: 0 }}>
          {/* Introduction */}
          <Column id="introduction" gap="16">
            <Heading variant="display-strong-l">API Documentation</Heading>
            <Text variant="body-default-l" onBackground="neutral-weak">
              Welcome to the JobSearch API! Our RESTful API allows you to integrate LinkedIn job search capabilities directly into your application.
            </Text>
            <Flex
              padding="16"
              gap="12"
              radius="l"
              background="info-alpha-weak"
              border="info-alpha-medium"
              vertical="center"
            >
              <Text variant="body-default-l">ℹ️</Text>
              <Column gap="4">
                <Text variant="heading-strong-s">Base URL</Text>
                <Flex
                  padding="8"
                  paddingX="12"
                  radius="m"
                  background="surface"
                  border="neutral-alpha-weak"
                >
                  <code style={{ fontSize: 14 }}>https://linkedin-jobs-search.vercel.app/api</code>
                </Flex>
              </Column>
            </Flex>
          </Column>

          {/* Authentication */}
          <Column id="authentication" gap="16">
            <Heading variant="heading-strong-l">Authentication</Heading>
            <Text variant="body-default-m" onBackground="neutral-weak">
              Currently, the API does not require authentication for basic usage. Premium features require an API key.
            </Text>
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
          </Column>

          {/* Endpoints */}
          <Column id="endpoints" gap="16">
            <Heading variant="heading-strong-l">Available Endpoints</Heading>
            <Column gap="12">
              <EndpointCard method="GET" path="/api" description="Health check and API information" />
              <EndpointCard method="POST" path="/api/jobs/search" description="Search for jobs with advanced filters" />
              <EndpointCard method="GET" path="/api/geo-stats" description="Get GEO monitoring statistics" />
            </Column>
          </Column>

          {/* Search Endpoint */}
          <Column id="search" gap="16">
            <Heading variant="heading-strong-l">POST /api/jobs/search</Heading>
            <Text variant="body-default-m" onBackground="neutral-weak">
              Search for jobs with comprehensive filtering options.
            </Text>

            <Text variant="heading-strong-m">Request Body</Text>
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

            <Text variant="heading-strong-m">Response</Text>
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
          </Column>

          {/* Parameters */}
          <Column id="parameters" gap="16">
            <Heading variant="heading-strong-l">Search Parameters</Heading>
            <Column
              radius="l"
              border="neutral-alpha-weak"
              background="surface"
              className="glass-card"
              style={{ overflow: 'hidden' }}
            >
              <Flex padding="16" background="neutral-alpha-weak">
                <Flex style={{ flex: 2 }}><Text variant="label-strong-s">Parameter</Text></Flex>
                <Flex style={{ flex: 1 }}><Text variant="label-strong-s">Type</Text></Flex>
                <Flex style={{ flex: 3 }}><Text variant="label-strong-s">Description</Text></Flex>
                <Flex style={{ flex: 2 }} className="s-flex-hide"><Text variant="label-strong-s">Example</Text></Flex>
              </Flex>
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
            </Column>
          </Column>

          {/* Code Examples */}
          <Column id="examples" gap="16">
            <Heading variant="heading-strong-l">Code Examples</Heading>

            {/* Language Tabs */}
            <Flex gap="8">
              <TabButton active={activeTab === 'javascript'} onClick={() => setActiveTab('javascript')}>
                JavaScript
              </TabButton>
              <TabButton active={activeTab === 'python'} onClick={() => setActiveTab('python')}>
                Python
              </TabButton>
              <TabButton active={activeTab === 'curl'} onClick={() => setActiveTab('curl')}>
                cURL
              </TabButton>
            </Flex>

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
          </Column>

          {/* Errors */}
          <Column id="errors" gap="16">
            <Heading variant="heading-strong-l">Error Handling</Heading>
            <Text variant="body-default-m" onBackground="neutral-weak">
              The API uses standard HTTP status codes to indicate success or failure.
            </Text>
            <Flex gap="16" wrap fillWidth>
              <ErrorCard code="200" title="OK" description="Request successful" color="success" />
              <ErrorCard code="400" title="Bad Request" description="Invalid parameters" color="warning" />
              <ErrorCard code="429" title="Too Many Requests" description="Rate limit exceeded" color="warning" />
              <ErrorCard code="500" title="Server Error" description="Internal server error" color="danger" />
            </Flex>
          </Column>

          {/* Rate Limits */}
          <Column id="rate-limits" gap="16">
            <Heading variant="heading-strong-l">Rate Limits</Heading>
            <Text variant="body-default-m" onBackground="neutral-weak">
              To ensure fair usage, API requests are rate limited based on your plan.
            </Text>

            <Column
              radius="l"
              border="neutral-alpha-weak"
              background="surface"
              className="glass-card"
              style={{ overflow: 'hidden' }}
            >
              <Flex padding="16" background="neutral-alpha-weak">
                <Flex style={{ flex: 1 }}><Text variant="label-strong-s">Plan</Text></Flex>
                <Flex style={{ flex: 1 }}><Text variant="label-strong-s">Requests</Text></Flex>
                <Flex style={{ flex: 1 }}><Text variant="label-strong-s">Window</Text></Flex>
              </Flex>
              <Flex padding="16" border="neutral-alpha-weak" style={{ borderWidth: '1px 0 0 0' }}>
                <Flex style={{ flex: 1 }}><Text variant="body-default-s" onBackground="neutral-strong">Free</Text></Flex>
                <Flex style={{ flex: 1 }}><Text variant="body-default-s" onBackground="neutral-weak">100 requests</Text></Flex>
                <Flex style={{ flex: 1 }}><Text variant="body-default-s" onBackground="neutral-weak">per 15 minutes</Text></Flex>
              </Flex>
              <Flex padding="16" border="neutral-alpha-weak" style={{ borderWidth: '1px 0 0 0' }}>
                <Flex style={{ flex: 1 }}><Text variant="body-default-s" onBackground="neutral-strong">Pro</Text></Flex>
                <Flex style={{ flex: 1 }}><Text variant="body-default-s" onBackground="neutral-weak">1000 requests</Text></Flex>
                <Flex style={{ flex: 1 }}><Text variant="body-default-s" onBackground="neutral-weak">per 15 minutes</Text></Flex>
              </Flex>
              <Flex padding="16" border="neutral-alpha-weak" style={{ borderWidth: '1px 0 0 0' }}>
                <Flex style={{ flex: 1 }}><Text variant="body-default-s" onBackground="neutral-strong">Enterprise</Text></Flex>
                <Flex style={{ flex: 1 }}><Text variant="body-default-s" onBackground="neutral-weak">Custom</Text></Flex>
                <Flex style={{ flex: 1 }}><Text variant="body-default-s" onBackground="neutral-weak">-</Text></Flex>
              </Flex>
            </Column>

            <Flex
              padding="24"
              gap="16"
              radius="l"
              background="brand-strong"
              style={{ flexDirection: 'column' }}
            >
              <Column gap="8">
                <Heading variant="heading-strong-m" style={{ color: 'white' }}>Need higher limits?</Heading>
                <Text variant="body-default-m" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  Upgrade to Pro or contact us for Enterprise pricing.
                </Text>
              </Column>
              <Flex gap="12" wrap>
                <Link href="/pricing" style={{ textDecoration: 'none' }}>
                  <Button variant="secondary" size="m">
                    View Pricing
                  </Button>
                </Link>
                <a href="mailto:chanmeng.dev@gmail.com" style={{ textDecoration: 'none' }}>
                  <Button variant="tertiary" size="m" style={{ borderColor: 'white', color: 'white' }}>
                    Contact Sales
                  </Button>
                </a>
              </Flex>
            </Flex>
          </Column>
        </Column>
      </Flex>
    </Column>
  );
}

function SidebarLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      style={{ textDecoration: 'none' }}
    >
      <Flex
        padding="8"
        paddingX="12"
        radius="m"
        className="card-interactive"
      >
        <Text variant="body-default-s" onBackground="neutral-weak">
          {children}
        </Text>
      </Flex>
    </a>
  );
}

function EndpointCard({ method, path, description }: { method: string; path: string; description: string }) {
  const methodColors: Record<string, { bg: string; text: string }> = {
    GET: { bg: 'var(--success-alpha-medium)', text: 'var(--success-on-background-strong)' },
    POST: { bg: 'var(--brand-alpha-medium)', text: 'var(--brand-on-background-strong)' },
  };

  return (
    <Flex
      padding="16"
      gap="16"
      radius="l"
      border="neutral-alpha-weak"
      background="surface"
      className="glass-card"
      vertical="center"
    >
      <Flex
        padding="4"
        paddingX="12"
        radius="m"
        style={{ background: methodColors[method]?.bg, color: methodColors[method]?.text }}
      >
        <Text variant="label-strong-xs">{method}</Text>
      </Flex>
      <Column gap="2">
        <code style={{ fontWeight: 500, color: 'var(--neutral-on-background-strong)' }}>{path}</code>
        <Text variant="body-default-s" onBackground="neutral-weak">{description}</Text>
      </Column>
    </Flex>
  );
}

function CodeBlock({ code, id, copiedCode, onCopy }: {
  code: string;
  id: string;
  copiedCode: string | null;
  onCopy: (code: string, id: string) => void;
}) {
  return (
    <Column style={{ position: 'relative' }}>
      <button
        onClick={() => onCopy(code, id)}
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          padding: '4px 12px',
          fontSize: 12,
          fontWeight: 500,
          borderRadius: 6,
          border: 'none',
          cursor: 'pointer',
          background: copiedCode === id ? 'var(--success-alpha-medium)' : 'var(--neutral-alpha-medium)',
          color: copiedCode === id ? 'var(--success-on-background-strong)' : 'var(--neutral-on-background-weak)',
          transition: 'all 0.2s',
        }}
      >
        {copiedCode === id ? 'Copied!' : 'Copy'}
      </button>
      <pre style={{
        background: 'var(--neutral-solid-strong)',
        color: 'var(--static-white)',
        padding: 16,
        borderRadius: 12,
        overflow: 'auto',
        fontSize: 14,
        margin: 0,
      }}>
        <code>{code}</code>
      </pre>
    </Column>
  );
}

function ParamRow({ param, type, desc, example }: {
  param: string;
  type: string;
  desc: string;
  example: string;
}) {
  return (
    <Flex
      padding="16"
      border="neutral-alpha-weak"
      style={{ borderWidth: '1px 0 0 0' }}
      vertical="center"
    >
      <Flex style={{ flex: 2 }}>
        <Flex padding="4" paddingX="8" radius="m" background="neutral-alpha-weak">
          <code style={{ fontSize: 13 }}>{param}</code>
        </Flex>
      </Flex>
      <Flex style={{ flex: 1 }}>
        <Text variant="body-default-s" onBackground="neutral-weak">{type}</Text>
      </Flex>
      <Flex style={{ flex: 3 }}>
        <Text variant="body-default-s" onBackground="neutral-weak">{desc}</Text>
      </Flex>
      <Flex style={{ flex: 2 }} className="s-flex-hide">
        <Text variant="body-default-s" onBackground="neutral-weak">{example}</Text>
      </Flex>
    </Flex>
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
      style={{
        padding: '8px 16px',
        fontSize: 14,
        fontWeight: 500,
        borderRadius: 8,
        border: 'none',
        cursor: 'pointer',
        background: active ? 'var(--brand-solid-strong)' : 'var(--neutral-alpha-weak)',
        color: active ? 'white' : 'var(--neutral-on-background-weak)',
        transition: 'all 0.2s',
      }}
    >
      {children}
    </button>
  );
}

function ErrorCard({ code, title, description, color }: {
  code: string;
  title: string;
  description: string;
  color: 'success' | 'warning' | 'danger';
}) {
  const colorMap = {
    success: { bg: 'var(--success-alpha-weak)', text: 'var(--success-on-background-strong)' },
    warning: { bg: 'var(--warning-alpha-weak)', text: 'var(--warning-on-background-strong)' },
    danger: { bg: 'var(--danger-alpha-weak)', text: 'var(--danger-on-background-strong)' },
  };

  return (
    <Flex
      padding="16"
      gap="16"
      radius="l"
      border="neutral-alpha-weak"
      background="surface"
      className="glass-card"
      vertical="center"
      style={{ flex: '1 1 200px', minWidth: 200 }}
    >
      <Flex
        padding="8"
        paddingX="12"
        radius="m"
        style={{ background: colorMap[color].bg, color: colorMap[color].text }}
      >
        <Text variant="heading-strong-m">{code}</Text>
      </Flex>
      <Column gap="2">
        <Text variant="heading-strong-s">{title}</Text>
        <Text variant="body-default-s" onBackground="neutral-weak">{description}</Text>
      </Column>
    </Flex>
  );
}
