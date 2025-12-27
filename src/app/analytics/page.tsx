"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@stackframe/stack';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  const hasData = savedJobs.length > 0 || searchHistory.length > 0;

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-900 mb-2">Analytics</h1>
          <p className="text-stone-600">Insights from your job search activity</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
          </div>
        ) : !hasData ? (
          <div className="card p-12 text-center">
            <div className="w-20 h-20 rounded-2xl bg-brand-primary/10 flex items-center justify-center mx-auto mb-6">
              <ChartIcon className="w-10 h-10 text-brand-primary" />
            </div>
            <h2 className="text-2xl font-bold text-stone-900 mb-3">No Data Yet</h2>
            <p className="text-stone-600 max-w-md mx-auto mb-6">
              Start searching and saving jobs to see insights and analytics about your job search activity.
            </p>
            <Link href="/search" className="btn btn-primary">
              Start Searching
            </Link>
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
            </div>

            {/* Charts Grid */}
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              {/* Application Status */}
              {analytics && analytics.statusDistribution.length > 0 && (
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-stone-900 mb-4">Application Status</h3>
                  <div className="space-y-3">
                    {analytics.statusDistribution.map(({ status, count }) => (
                      <div key={status}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize text-stone-600">{status}</span>
                          <span className="font-medium text-stone-900">{count}</span>
                        </div>
                        <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${getStatusColor(status)}`}
                            style={{ width: `${(count / savedJobs.length) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Weekly Activity */}
              {analytics && (
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-stone-900 mb-4">Weekly Activity</h3>
                  <div className="flex items-end justify-between h-40 gap-2">
                    {analytics.activityByDay.map(({ date, searches, saves }) => {
                      const maxVal = Math.max(...analytics.activityByDay.map(d => d.searches + d.saves), 1);
                      const height = ((searches + saves) / maxVal) * 100;
                      return (
                        <div key={date} className="flex-1 flex flex-col items-center">
                          <div className="w-full flex flex-col items-center" style={{ height: '120px' }}>
                            <div className="w-full flex-1 flex items-end gap-0.5">
                              <div
                                className="flex-1 bg-brand-primary rounded-t"
                                style={{ height: `${(searches / maxVal) * 100}%`, minHeight: searches > 0 ? '4px' : 0 }}
                                title={`Searches: ${searches}`}
                              />
                              <div
                                className="flex-1 bg-emerald-500 rounded-t"
                                style={{ height: `${(saves / maxVal) * 100}%`, minHeight: saves > 0 ? '4px' : 0 }}
                                title={`Saves: ${saves}`}
                              />
                            </div>
                          </div>
                          <span className="text-xs text-stone-500 mt-2">{date}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-center gap-6 mt-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-brand-primary rounded" />
                      <span className="text-stone-600">Searches</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-emerald-500 rounded" />
                      <span className="text-stone-600">Saves</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Top Locations */}
              {analytics && analytics.locationDistribution.length > 0 && (
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-stone-900 mb-4">Top Locations</h3>
                  <div className="space-y-3">
                    {analytics.locationDistribution.map(({ location, count }, index) => (
                      <div key={location} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-sm font-medium text-stone-500">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <span className="text-stone-900">{location}</span>
                            <span className="text-stone-500">{count} jobs</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Salary Distribution */}
              {analytics && analytics.salaryRanges.some(r => r.count > 0) && (
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-stone-900 mb-4">Salary Distribution</h3>
                  <div className="space-y-3">
                    {analytics.salaryRanges.map(({ range, count }) => (
                      <div key={range}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-stone-600">{range}</span>
                          <span className="font-medium text-stone-900">{count}</span>
                        </div>
                        <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${(count / savedJobs.length) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Section */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Top Companies */}
              {analytics && analytics.topCompanies.length > 0 && (
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-stone-900 mb-4">Top Companies</h3>
                  <div className="space-y-3">
                    {analytics.topCompanies.map(({ company, count }) => (
                      <div key={company} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                        <span className="font-medium text-stone-900">{company}</span>
                        <span className="text-sm text-stone-500">{count} {count === 1 ? 'job' : 'jobs'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Search Keywords */}
              {analytics && analytics.searchKeywords.length > 0 && (
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-stone-900 mb-4">Top Search Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {analytics.searchKeywords.map(({ keyword, count }) => (
                      <Link
                        key={keyword}
                        href={`/search?keyword=${encodeURIComponent(keyword)}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/10 text-brand-primary rounded-full hover:bg-brand-primary/20 transition-colors"
                      >
                        <span className="capitalize">{keyword}</span>
                        <span className="text-xs bg-brand-primary text-white px-2 py-0.5 rounded-full">{count}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'saved': return 'bg-stone-400';
    case 'applied': return 'bg-blue-500';
    case 'interviewing': return 'bg-purple-500';
    case 'offered': return 'bg-emerald-500';
    case 'rejected': return 'bg-red-400';
    default: return 'bg-stone-400';
  }
}

function SummaryCard({ title, value, icon, color }: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'orange';
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-brand-primary',
    green: 'bg-emerald-50 text-emerald-500',
    purple: 'bg-purple-50 text-purple-500',
    orange: 'bg-orange-50 text-orange-500',
  };

  return (
    <div className="card p-6">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-stone-900">{value}</p>
          <p className="text-sm text-stone-500">{title}</p>
        </div>
      </div>
    </div>
  );
}

// Icons
function ChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
  );
}

function PaperIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function TrendIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );
}
