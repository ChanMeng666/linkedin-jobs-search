import Link from 'next/link';
import { Column, Flex, Heading, Text, Button, Badge, Line, RevealFx } from '@once-ui-system/core';

export default function HomePage() {
  return (
    <Column maxWidth="l" gap="104" paddingY="xl">
      {/* Hero Section */}
      <Column gap="xl" horizontal="center" paddingTop="64">
        {/* Badge */}
        <RevealFx translateY="4">
          <Badge
            background="success-alpha-weak"
            paddingX="12"
            paddingY="4"
            arrow={false}
          >
            <Flex gap="8" vertical="center">
              <svg style={{ width: 16, height: 16, color: 'var(--success-on-background-strong)' }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <Text variant="label-default-s" onBackground="success-strong">
                100% Free - No LinkedIn Premium Required
              </Text>
            </Flex>
          </Badge>
        </RevealFx>

        {/* Title */}
        <RevealFx translateY="8" delay={0.1}>
          <Heading
            variant="display-strong-xl"
            wrap="balance"
            align="center"
          >
            Discover Your Dream Job with{' '}
            <Text as="span" variant="display-strong-xl" onBackground="brand-strong">
              Advanced LinkedIn Search
            </Text>
          </Heading>
        </RevealFx>

        {/* Description */}
        <RevealFx translateY="12" delay={0.2}>
          <Text
            variant="heading-default-l"
            onBackground="neutral-weak"
            align="center"
            wrap="balance"
            style={{ maxWidth: 680 }}
          >
            Professional job search platform with powerful filtering by salary,
            experience level, location, and remote options. Get instant access to thousands of opportunities.
          </Text>
        </RevealFx>

        {/* CTA Buttons */}
        <RevealFx delay={0.3}>
          <Flex gap="16" wrap horizontal="center">
            <Link href="/search" style={{ textDecoration: 'none' }}>
              <Button variant="primary" size="l" arrowIcon className="glow-button">
                Start Searching Now
              </Button>
            </Link>
            <Link href="/api-docs" style={{ textDecoration: 'none' }}>
              <Button variant="secondary" size="l">
                <svg style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                View API Docs
              </Button>
            </Link>
          </Flex>
        </RevealFx>

        {/* Stats */}
        <RevealFx delay={0.4}>
          <Flex gap="40" horizontal="center" vertical="center" wrap paddingTop="24">
            <StatItem value="100K+" label="Active Jobs" />
            <Line vert maxHeight="48" background="neutral-alpha-medium" />
            <StatItem value="500+" label="Companies" />
            <Line vert maxHeight="48" background="neutral-alpha-medium" />
            <StatItem value="24/7" label="Real-time Updates" />
          </Flex>
        </RevealFx>
      </Column>

      {/* Features Section */}
      <Column gap="xl" horizontal="center">
        <Column gap="16" horizontal="center">
          <Heading variant="display-strong-m" align="center">
            Powerful Features for Job Seekers
          </Heading>
          <Text
            variant="body-default-l"
            onBackground="neutral-weak"
            align="center"
            style={{ maxWidth: 600 }}
          >
            Everything you need to find your perfect job opportunity
          </Text>
        </Column>

        <Flex gap="24" wrap horizontal="center" fillWidth>
          <FeatureCard
            icon={<SearchIcon />}
            title="Advanced Search Filters"
            description="Filter by salary range ($40K-$120K+), experience level, job type, remote options, and more."
            link="/search"
            linkText="Try it now"
          />
          <FeatureCard
            icon={<DashboardIcon />}
            title="Personal Dashboard"
            description="Track your search history, save favorite jobs, and monitor your application progress."
            link="/dashboard"
            linkText="View dashboard"
          />
          <FeatureCard
            icon={<CodeIcon />}
            title="Developer API"
            description="Full REST API access for developers. Build your own job search applications."
            link="/api-docs"
            linkText="Read docs"
          />
          <FeatureCard
            icon={<GlobeIcon />}
            title="Multi-Country Search"
            description="Search jobs across 12+ countries including US, UK, Canada, Germany, and more."
            link="/search"
            linkText="Search globally"
          />
          <FeatureCard
            icon={<ExportIcon />}
            title="Export Results"
            description="Download your search results as CSV, Excel, or PDF for offline analysis."
            link="/search"
            linkText="Export jobs"
          />
          <FeatureCard
            icon={<ChartIcon />}
            title="Market Analytics"
            description="View salary trends, demand insights, and location-based job market data."
            link="/analytics"
            linkText="View analytics"
          />
        </Flex>
      </Column>

      {/* CTA Section */}
      <Flex
        fillWidth
        padding="xl"
        radius="xl"
        horizontal="center"
        background="brand-strong"
        className="glass-card"
        style={{
          background: 'linear-gradient(135deg, var(--brand-solid-strong) 0%, var(--accent-solid-strong) 100%)',
        }}
      >
        <Column gap="24" horizontal="center" maxWidth="m">
          <Heading variant="display-strong-m" align="center" onSolid="neutral-strong">
            Ready to Find Your Next Opportunity?
          </Heading>
          <Text
            variant="heading-default-m"
            align="center"
            onSolid="neutral-medium"
          >
            Start searching now and discover thousands of job opportunities tailored to your skills.
          </Text>
          <Link href="/search" style={{ textDecoration: 'none' }}>
            <Button variant="secondary" size="l" arrowIcon>
              Start Your Job Search
            </Button>
          </Link>
        </Column>
      </Flex>
    </Column>
  );
}

// Stat Item Component
function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <Column gap="4" horizontal="center">
      <Text variant="display-strong-m" onBackground="neutral-strong">
        {value}
      </Text>
      <Text variant="body-default-s" onBackground="neutral-weak">
        {label}
      </Text>
    </Column>
  );
}

// Feature Card Component
function FeatureCard({
  icon,
  title,
  description,
  link,
  linkText,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  linkText: string;
}) {
  return (
    <Column
      padding="24"
      gap="16"
      radius="l"
      border="neutral-alpha-weak"
      background="surface"
      className="glass-card hover-lift"
      style={{
        flex: '1 1 320px',
        maxWidth: 400,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <Flex
        padding="12"
        radius="m"
        background="brand-alpha-weak"
        style={{ width: 48, height: 48 }}
        horizontal="center"
        vertical="center"
      >
        {icon}
      </Flex>
      <Column gap="8">
        <Heading variant="heading-strong-m">{title}</Heading>
        <Text variant="body-default-s" onBackground="neutral-weak">
          {description}
        </Text>
      </Column>
      <Link href={link} style={{ textDecoration: 'none' }}>
        <Flex gap="4" vertical="center">
          <Text variant="label-strong-s" onBackground="brand-strong">
            {linkText}
          </Text>
          <svg style={{ width: 16, height: 16, color: 'var(--brand-on-background-strong)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Flex>
      </Link>
    </Column>
  );
}

// Icons
function SearchIcon() {
  return (
    <svg style={{ width: 24, height: 24, color: 'var(--brand-on-background-strong)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg style={{ width: 24, height: 24, color: 'var(--brand-on-background-strong)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg style={{ width: 24, height: 24, color: 'var(--brand-on-background-strong)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg style={{ width: 24, height: 24, color: 'var(--brand-on-background-strong)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ExportIcon() {
  return (
    <svg style={{ width: 24, height: 24, color: 'var(--brand-on-background-strong)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg style={{ width: 24, height: 24, color: 'var(--brand-on-background-strong)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}
