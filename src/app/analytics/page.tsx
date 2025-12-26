import { redirect } from 'next/navigation';
import { stackServerApp } from '@/lib/stack';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  const user = await stackServerApp.getUser();

  if (!user) {
    redirect('/login?from=analytics');
  }

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-900 mb-2">Market Analytics</h1>
          <p className="text-stone-600">Insights and trends from the job market</p>
        </div>

        {/* Coming Soon */}
        <div className="card p-12 text-center">
          <div className="w-20 h-20 rounded-2xl bg-brand-primary/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-stone-900 mb-3">Analytics Coming Soon</h2>
          <p className="text-stone-600 max-w-md mx-auto mb-6">
            We&apos;re building powerful market analytics to help you understand salary trends,
            demand insights, and location-based job market data.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/search" className="btn btn-primary">
              Search Jobs
            </Link>
            <Link href="/dashboard" className="btn btn-secondary">
              View Dashboard
            </Link>
          </div>
        </div>

        {/* Preview Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <FeaturePreview
            title="Salary Trends"
            description="Track salary ranges and compensation trends across industries"
            icon={<DollarIcon />}
          />
          <FeaturePreview
            title="Demand Insights"
            description="See which skills and roles are most in-demand"
            icon={<TrendIcon />}
          />
          <FeaturePreview
            title="Location Analysis"
            description="Compare job markets across different cities and countries"
            icon={<MapIcon />}
          />
        </div>
      </div>
    </div>
  );
}

function FeaturePreview({ title, description, icon }: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="card p-6 opacity-75">
      <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center text-stone-400 mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-stone-700 mb-2">{title}</h3>
      <p className="text-sm text-stone-500">{description}</p>
      <span className="inline-block mt-3 text-xs font-medium text-brand-primary bg-blue-50 px-2 py-1 rounded">
        Coming Soon
      </span>
    </div>
  );
}

function DollarIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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

function MapIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
    </svg>
  );
}
