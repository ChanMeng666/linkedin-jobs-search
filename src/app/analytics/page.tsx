"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@stackframe/stack';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Column, Flex, Heading, Text, Button } from '@once-ui-system/core';
import { Spinner } from '@/components/common/Spinner';

type SavedJob = {
  id: string;
  position: string;
  company: string;
  location: string | null;
  salary: string | null;
  status: string;
  jobType: string | null;
  createdAt: string;
};

type SearchHistoryItem = {
  id: string;
  keyword: string | null;
  location: string | null;
  resultsCount: number | null;
  createdAt: string;
};

type AnalyticsData = {
  statusDistribution: { status: string; count: number }[];
  locationDistribution: { location: string; count: number }[];
  salaryRanges: { range: string; count: number }[];
  topCompanies: { company: string; count: number }[];
  searchKeywords: { keyword: string; count: number }[];
  activityByDay: { date: string; searches: number; saves: number }[];
};

export default function AnalyticsPage() {
  const user = useUser();
  const router = useRouter();
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login?from=analytics');
      return;
    }
    loadData();
  }, [user, router]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [jobsRes, historyRes] = await Promise.all([
        fetch('/api/user/saved-jobs'),
        fetch('/api/user/search-history?limit=100'),
      ]);

      const [jobsData, historyData] = await Promise.all([
        jobsRes.json(),
        historyRes.json(),
      ]);

      if (jobsData.success) setSavedJobs(jobsData.jobs || []);
      if (historyData.success) setSearchHistory(historyData.history || []);

      // Generate analytics from the data
      if (jobsData.success && historyData.success) {
        const analyticsData = generateAnalytics(jobsData.jobs || [], historyData.history || []);
        setAnalytics(analyticsData);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAnalytics = (jobs: SavedJob[], history: SearchHistoryItem[]): AnalyticsData => {
    // Status Distribution
    const statusCounts: Record<string, number> = {};
    jobs.forEach(job => {
      statusCounts[job.status] = (statusCounts[job.status] || 0) + 1;
    });
    const statusDistribution = Object.entries(statusCounts)
      .map(([status, count]) => ({ status, count }))
      .sort((a, b) => b.count - a.count);

    // Location Distribution
    const locationCounts: Record<string, number> = {};
    jobs.forEach(job => {
      if (job.location) {
        const city = job.location.split(',')[0].trim();
        locationCounts[city] = (locationCounts[city] || 0) + 1;
      }
    });
    const locationDistribution = Object.entries(locationCounts)
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Salary Ranges
    const salaryBuckets: Record<string, number> = {
      'Under $50K': 0,
      '$50K - $75K': 0,
      '$75K - $100K': 0,
      '$100K - $150K': 0,
      '$150K+': 0,
      'Not Specified': 0,
    };
    jobs.forEach(job => {
      if (!job.salary) {
        salaryBuckets['Not Specified']++;
      } else {
        const match = job.salary.match(/\$?([\d,]+)/);
        if (match) {
          const amount = parseInt(match[1].replace(/,/g, ''));
          if (amount < 50000) salaryBuckets['Under $50K']++;
          else if (amount < 75000) salaryBuckets['$50K - $75K']++;
          else if (amount < 100000) salaryBuckets['$75K - $100K']++;
          else if (amount < 150000) salaryBuckets['$100K - $150K']++;
          else salaryBuckets['$150K+']++;
        } else {
          salaryBuckets['Not Specified']++;
        }
      }
    });
    const salaryRanges = Object.entries(salaryBuckets)
      .map(([range, count]) => ({ range, count }))
      .filter(r => r.count > 0);

    // Top Companies
    const companyCounts: Record<string, number> = {};
    jobs.forEach(job => {
      companyCounts[job.company] = (companyCounts[job.company] || 0) + 1;
    });
    const topCompanies = Object.entries(companyCounts)
      .map(([company, count]) => ({ company, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Search Keywords
    const keywordCounts: Record<string, number> = {};
    history.forEach(search => {
      if (search.keyword) {
        const kw = search.keyword.toLowerCase();
        keywordCounts[kw] = (keywordCounts[kw] || 0) + 1;
      }
    });
    const searchKeywords = Object.entries(keywordCounts)
      .map(([keyword, count]) => ({ keyword, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Activity by Day (last 7 days)
    const activityByDay: { date: string; searches: number; saves: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const displayDate = date.toLocaleDateString('en-US', { weekday: 'short' });

      const searchesOnDay = history.filter(h =>
        h.createdAt && h.createdAt.startsWith(dateStr)
      ).length;
      const savesOnDay = jobs.filter(j =>
        j.createdAt && j.createdAt.startsWith(dateStr)
      ).length;

      activityByDay.push({ date: displayDate, searches: searchesOnDay, saves: savesOnDay });
    }

    return {
      statusDistribution,
      locationDistribution,
      salaryRanges,
      topCompanies,
      searchKeywords,
      activityByDay,
    };
  };

  if (!user) {
    return (
      <Flex fillWidth fillHeight horizontal="center" vertical="center" paddingY="104">
        <Spinner size="l" />
      </Flex>
    );
  }

  const hasData = savedJobs.length > 0 || searchHistory.length > 0;

  return (
    <Column maxWidth="l" gap="xl" paddingY="xl" fillWidth>
      {/* Header */}
      <Column gap="8">
        <Heading variant="display-strong-l">Analytics</Heading>
        <Text variant="body-default-l" onBackground="neutral-weak">
          Insights from your job search activity
        </Text>
      </Column>

      {loading ? (
        <Flex horizontal="center" vertical="center" paddingY="80">
          <Spinner size="l" />
        </Flex>
      ) : !hasData ? (
        <Column
          padding="48"
          radius="l"
          border="neutral-alpha-weak"
          background="surface"
          className="glass-card"
          horizontal="center"
          gap="24"
        >
          <Flex
            style={{ width: 80, height: 80 }}
            radius="l"
            background="brand-alpha-weak"
            horizontal="center"
            vertical="center"
          >
            <ChartIcon style={{ width: 40, height: 40, color: 'var(--brand-on-background-strong)' }} />
          </Flex>
          <Heading variant="heading-strong-l" align="center">No Data Yet</Heading>
          <Text variant="body-default-m" onBackground="neutral-weak" align="center" style={{ maxWidth: 400 }}>
            Start searching and saving jobs to see insights and analytics about your job search activity.
          </Text>
          <Link href="/search" style={{ textDecoration: 'none' }}>
            <Button variant="primary" size="l">
              Start Searching
            </Button>
          </Link>
        </Column>
      ) : (
        <Column gap="32">
          {/* Summary Stats */}
          <Flex gap="24" wrap fillWidth>
            <SummaryCard
              title="Total Saved Jobs"
              value={savedJobs.length}
              icon={<BookmarkIcon />}
              color="blue"
            />
            <SummaryCard
              title="Applications Sent"
              value={savedJobs.filter(j => j.status === 'applied').length}
              icon={<PaperIcon />}
              color="green"
            />
            <SummaryCard
              title="Total Searches"
              value={searchHistory.length}
              icon={<SearchIcon />}
              color="purple"
            />
            <SummaryCard
              title="Success Rate"
              value={savedJobs.length > 0
                ? `${Math.round((savedJobs.filter(j => j.status === 'offered').length / savedJobs.length) * 100)}%`
                : '0%'
              }
              icon={<TrendIcon />}
              color="orange"
            />
          </Flex>

          {/* Charts Grid */}
          <Flex gap="24" wrap fillWidth>
            {/* Application Status */}
            {analytics && analytics.statusDistribution.length > 0 && (
              <Column
                padding="24"
                gap="16"
                radius="l"
                border="neutral-alpha-weak"
                background="surface"
                className="glass-card"
                style={{ flex: '1 1 400px', minWidth: 300 }}
              >
                <Text variant="heading-strong-m">Application Status</Text>
                <Column gap="12">
                  {analytics.statusDistribution.map(({ status, count }) => (
                    <Column key={status} gap="4">
                      <Flex horizontal="between">
                        <Text variant="body-default-s" onBackground="neutral-weak" style={{ textTransform: 'capitalize' }}>
                          {status}
                        </Text>
                        <Text variant="body-default-s" onBackground="neutral-strong">{count}</Text>
                      </Flex>
                      <div style={{
                        height: 8,
                        background: 'var(--neutral-alpha-weak)',
                        borderRadius: 4,
                        overflow: 'hidden'
                      }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${(count / savedJobs.length) * 100}%`,
                            background: getStatusColor(status),
                            borderRadius: 4,
                          }}
                        />
                      </div>
                    </Column>
                  ))}
                </Column>
              </Column>
            )}

            {/* Weekly Activity */}
            {analytics && (
              <Column
                padding="24"
                gap="16"
                radius="l"
                border="neutral-alpha-weak"
                background="surface"
                className="glass-card"
                style={{ flex: '1 1 400px', minWidth: 300 }}
              >
                <Text variant="heading-strong-m">Weekly Activity</Text>
                <Flex vertical="end" horizontal="between" style={{ height: 160 }} gap="8">
                  {analytics.activityByDay.map(({ date, searches, saves }) => {
                    const maxVal = Math.max(...analytics.activityByDay.map(d => d.searches + d.saves), 1);
                    return (
                      <Column key={date} horizontal="center" style={{ flex: 1 }}>
                        <Flex vertical="end" gap="2" style={{ height: 120, width: '100%' }}>
                          <div
                            style={{
                              flex: 1,
                              background: 'var(--brand-solid-strong)',
                              borderRadius: '4px 4px 0 0',
                              height: `${(searches / maxVal) * 100}%`,
                              minHeight: searches > 0 ? 4 : 0,
                            }}
                            title={`Searches: ${searches}`}
                          />
                          <div
                            style={{
                              flex: 1,
                              background: 'var(--success-solid-strong)',
                              borderRadius: '4px 4px 0 0',
                              height: `${(saves / maxVal) * 100}%`,
                              minHeight: saves > 0 ? 4 : 0,
                            }}
                            title={`Saves: ${saves}`}
                          />
                        </Flex>
                        <Text variant="label-default-xs" onBackground="neutral-weak" style={{ marginTop: 8 }}>
                          {date}
                        </Text>
                      </Column>
                    );
                  })}
                </Flex>
                <Flex horizontal="center" gap="24">
                  <Flex gap="8" vertical="center">
                    <div style={{ width: 12, height: 12, background: 'var(--brand-solid-strong)', borderRadius: 4 }} />
                    <Text variant="body-default-s" onBackground="neutral-weak">Searches</Text>
                  </Flex>
                  <Flex gap="8" vertical="center">
                    <div style={{ width: 12, height: 12, background: 'var(--success-solid-strong)', borderRadius: 4 }} />
                    <Text variant="body-default-s" onBackground="neutral-weak">Saves</Text>
                  </Flex>
                </Flex>
              </Column>
            )}

            {/* Top Locations */}
            {analytics && analytics.locationDistribution.length > 0 && (
              <Column
                padding="24"
                gap="16"
                radius="l"
                border="neutral-alpha-weak"
                background="surface"
                className="glass-card"
                style={{ flex: '1 1 400px', minWidth: 300 }}
              >
                <Text variant="heading-strong-m">Top Locations</Text>
                <Column gap="12">
                  {analytics.locationDistribution.map(({ location, count }, index) => (
                    <Flex key={location} gap="12" vertical="center">
                      <Flex
                        style={{ width: 32, height: 32 }}
                        radius="m"
                        background="neutral-alpha-weak"
                        horizontal="center"
                        vertical="center"
                      >
                        <Text variant="label-default-s" onBackground="neutral-weak">{index + 1}</Text>
                      </Flex>
                      <Flex horizontal="between" fillWidth>
                        <Text variant="body-default-s" onBackground="neutral-strong">{location}</Text>
                        <Text variant="body-default-s" onBackground="neutral-weak">{count} jobs</Text>
                      </Flex>
                    </Flex>
                  ))}
                </Column>
              </Column>
            )}

            {/* Salary Distribution */}
            {analytics && analytics.salaryRanges.some(r => r.count > 0) && (
              <Column
                padding="24"
                gap="16"
                radius="l"
                border="neutral-alpha-weak"
                background="surface"
                className="glass-card"
                style={{ flex: '1 1 400px', minWidth: 300 }}
              >
                <Text variant="heading-strong-m">Salary Distribution</Text>
                <Column gap="12">
                  {analytics.salaryRanges.map(({ range, count }) => (
                    <Column key={range} gap="4">
                      <Flex horizontal="between">
                        <Text variant="body-default-s" onBackground="neutral-weak">{range}</Text>
                        <Text variant="body-default-s" onBackground="neutral-strong">{count}</Text>
                      </Flex>
                      <div style={{
                        height: 8,
                        background: 'var(--neutral-alpha-weak)',
                        borderRadius: 4,
                        overflow: 'hidden'
                      }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${(count / savedJobs.length) * 100}%`,
                            background: 'var(--success-solid-strong)',
                            borderRadius: 4,
                          }}
                        />
                      </div>
                    </Column>
                  ))}
                </Column>
              </Column>
            )}

            {/* Top Companies */}
            {analytics && analytics.topCompanies.length > 0 && (
              <Column
                padding="24"
                gap="16"
                radius="l"
                border="neutral-alpha-weak"
                background="surface"
                className="glass-card"
                style={{ flex: '1 1 400px', minWidth: 300 }}
              >
                <Text variant="heading-strong-m">Top Companies</Text>
                <Column gap="12">
                  {analytics.topCompanies.map(({ company, count }) => (
                    <Flex
                      key={company}
                      padding="12"
                      radius="m"
                      background="neutral-alpha-weak"
                      horizontal="between"
                      vertical="center"
                    >
                      <Text variant="body-default-s" onBackground="neutral-strong">{company}</Text>
                      <Text variant="body-default-s" onBackground="neutral-weak">
                        {count} {count === 1 ? 'job' : 'jobs'}
                      </Text>
                    </Flex>
                  ))}
                </Column>
              </Column>
            )}

            {/* Search Keywords */}
            {analytics && analytics.searchKeywords.length > 0 && (
              <Column
                padding="24"
                gap="16"
                radius="l"
                border="neutral-alpha-weak"
                background="surface"
                className="glass-card"
                style={{ flex: '1 1 400px', minWidth: 300 }}
              >
                <Text variant="heading-strong-m">Top Search Keywords</Text>
                <Flex gap="8" wrap>
                  {analytics.searchKeywords.map(({ keyword, count }) => (
                    <Link
                      key={keyword}
                      href={`/search?keyword=${encodeURIComponent(keyword)}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <Flex
                        gap="8"
                        vertical="center"
                        padding="8"
                        paddingX="12"
                        radius="full"
                        background="brand-alpha-weak"
                        className="card-interactive"
                      >
                        <Text
                          variant="body-default-s"
                          onBackground="brand-strong"
                          style={{ textTransform: 'capitalize' }}
                        >
                          {keyword}
                        </Text>
                        <Flex
                          padding="2"
                          paddingX="8"
                          radius="full"
                          background="brand-strong"
                        >
                          <Text variant="label-default-xs" onBackground="neutral-strong" style={{ color: 'white' }}>
                            {count}
                          </Text>
                        </Flex>
                      </Flex>
                    </Link>
                  ))}
                </Flex>
              </Column>
            )}
          </Flex>
        </Column>
      )}
    </Column>
  );
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'saved': return 'var(--neutral-solid-medium)';
    case 'applied': return 'var(--brand-solid-strong)';
    case 'interviewing': return 'var(--accent-solid-strong)';
    case 'offered': return 'var(--success-solid-strong)';
    case 'rejected': return 'var(--danger-solid-strong)';
    default: return 'var(--neutral-solid-medium)';
  }
}

function SummaryCard({ title, value, icon, color }: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'orange';
}) {
  const colorMap = {
    blue: { bg: 'var(--brand-alpha-weak)', text: 'var(--brand-on-background-strong)' },
    green: { bg: 'var(--success-alpha-weak)', text: 'var(--success-on-background-strong)' },
    purple: { bg: 'var(--accent-alpha-weak)', text: 'var(--accent-on-background-strong)' },
    orange: { bg: 'var(--warning-alpha-weak)', text: 'var(--warning-on-background-strong)' },
  };

  return (
    <Column
      padding="24"
      radius="l"
      border="neutral-alpha-weak"
      background="surface"
      className="glass-card"
      style={{ flex: '1 1 200px', minWidth: 200 }}
    >
      <Flex gap="16" vertical="center">
        <Flex
          style={{ width: 48, height: 48, background: colorMap[color].bg, color: colorMap[color].text }}
          radius="l"
          horizontal="center"
          vertical="center"
        >
          {icon}
        </Flex>
        <Column gap="4">
          <Text variant="display-strong-s">{value}</Text>
          <Text variant="body-default-s" onBackground="neutral-weak">{title}</Text>
        </Column>
      </Flex>
    </Column>
  );
}

// Icons
function ChartIcon({ style }: { style?: React.CSSProperties }) {
  return (
    <svg style={style || { width: 24, height: 24 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg style={{ width: 24, height: 24 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
  );
}

function PaperIcon() {
  return (
    <svg style={{ width: 24, height: 24 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg style={{ width: 24, height: 24 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function TrendIcon() {
  return (
    <svg style={{ width: 24, height: 24 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );
}
