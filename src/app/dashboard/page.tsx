import { redirect } from 'next/navigation';
import { stackServerApp } from '@/lib/stack';
import { db, savedJobs, searchHistory } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const user = await stackServerApp.getUser();

  if (!user) {
    redirect('/login?from=dashboard');
  }

  // Fetch user's saved jobs
  const userSavedJobs = await db
    .select()
    .from(savedJobs)
    .where(eq(savedJobs.userId, user.id))
    .orderBy(desc(savedJobs.createdAt))
    .limit(10);

  // Fetch user's search history
  const userSearchHistory = await db
    .select()
    .from(searchHistory)
    .where(eq(searchHistory.userId, user.id))
    .orderBy(desc(searchHistory.createdAt))
    .limit(5);

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-900 mb-2">
            Welcome back, {user.displayName || user.primaryEmail?.split('@')[0] || 'User'}!
          </h1>
          <p className="text-stone-600">Manage your job search from your personal dashboard</p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Saved Jobs"
            value={userSavedJobs.length.toString()}
            icon={<BookmarkIcon />}
            color="blue"
          />
          <StatCard
            title="Applications"
            value={userSavedJobs.filter(j => j.status === 'applied').length.toString()}
            icon={<PaperIcon />}
            color="green"
          />
          <StatCard
            title="Interviews"
            value={userSavedJobs.filter(j => j.status === 'interviewing').length.toString()}
            icon={<CalendarIcon />}
            color="purple"
          />
          <StatCard
            title="Searches"
            value={userSearchHistory.length.toString()}
            icon={<SearchIcon />}
            color="orange"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Saved Jobs */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-stone-900">Saved Jobs</h2>
              <Link href="/search" className="text-sm text-brand-primary hover:underline">
                Search more
              </Link>
            </div>

            {userSavedJobs.length > 0 ? (
              <div className="space-y-4">
                {userSavedJobs.map((job) => (
                  <div key={job.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-stone-50">
                    {job.companyLogo && (
                      <img src={job.companyLogo} alt={job.company} className="w-10 h-10 rounded" />
                    )}
                    <div className="flex-1 min-w-0">
                      <a
                        href={job.jobUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-stone-900 hover:text-brand-primary truncate block"
                      >
                        {job.position}
                      </a>
                      <p className="text-sm text-stone-500">{job.company}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      job.status === 'applied' ? 'bg-green-100 text-green-700' :
                      job.status === 'interviewing' ? 'bg-purple-100 text-purple-700' :
                      'bg-stone-100 text-stone-600'
                    }`}>
                      {job.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-stone-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <p className="text-stone-500 mb-3">No saved jobs yet</p>
                <Link href="/search" className="btn btn-primary">
                  Start Searching
                </Link>
              </div>
            )}
          </div>

          {/* Search History */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-stone-900">Recent Searches</h2>
            </div>

            {userSearchHistory.length > 0 ? (
              <div className="space-y-3">
                {userSearchHistory.map((search) => (
                  <Link
                    key={search.id}
                    href={`/search?keyword=${encodeURIComponent(search.keyword || '')}&location=${encodeURIComponent(search.location || '')}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-stone-50 group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center text-stone-500 group-hover:bg-brand-primary group-hover:text-white transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-stone-900 truncate">
                        {search.keyword || 'All Jobs'}
                      </p>
                      <p className="text-sm text-stone-500">
                        {search.location || 'Any location'} • {search.resultsCount || 0} results
                      </p>
                    </div>
                    <svg className="w-4 h-4 text-stone-400 group-hover:text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-stone-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-stone-500 mb-3">No search history</p>
                <Link href="/search" className="btn btn-primary">
                  Search Jobs
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: {
  title: string;
  value: string;
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

function CalendarIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
