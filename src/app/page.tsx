import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 gradient-hero -z-10" />
        <div className="absolute inset-0 opacity-30 -z-10">
          <div className="absolute top-20 right-20 w-72 h-72 bg-brand-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-72 h-72 bg-brand-secondary/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium mb-8">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>100% Free &bull; No LinkedIn Premium Required</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-900 mb-6 leading-tight">
              Discover Your Dream Job with{' '}
              <span className="bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
                Advanced LinkedIn Search
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-stone-600 mb-10 max-w-2xl mx-auto">
              Professional job search platform with powerful filtering by salary, experience level,
              location, and remote options. Get instant access to thousands of opportunities.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link
                href="/search"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-white bg-brand-primary rounded-xl hover:bg-blue-700 transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                Start Searching Now
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/api-docs"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-stone-700 bg-white border-2 border-stone-200 rounded-xl hover:border-stone-300 hover:bg-stone-50 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                View API Docs
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 sm:gap-16">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-stone-900">100K+</div>
                <div className="text-sm text-stone-500">Active Jobs</div>
              </div>
              <div className="w-px h-12 bg-stone-200" />
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-stone-900">500+</div>
                <div className="text-sm text-stone-500">Companies</div>
              </div>
              <div className="w-px h-12 bg-stone-200" />
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-stone-900">24/7</div>
                <div className="text-sm text-stone-500">Real-time Updates</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-4">
              Powerful Features for Job Seekers
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Everything you need to find your perfect job opportunity
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<SearchIcon />}
              title="Advanced Search Filters"
              description="Filter by salary range ($40K-$120K+), experience level, job type, remote options, and more."
              link="/search"
              linkText="Try it now"
              color="blue"
            />
            <FeatureCard
              icon={<DashboardIcon />}
              title="Personal Dashboard"
              description="Track your search history, save favorite jobs, and monitor your application progress."
              link="/dashboard"
              linkText="View dashboard"
              color="pink"
            />
            <FeatureCard
              icon={<CodeIcon />}
              title="Developer API"
              description="Full REST API access for developers. Build your own job search applications."
              link="/api-docs"
              linkText="Read docs"
              color="purple"
            />
            <FeatureCard
              icon={<GlobeIcon />}
              title="Multi-Country Search"
              description="Search jobs across 12+ countries including US, UK, Canada, Germany, and more."
              link="/search"
              linkText="Search globally"
              color="green"
            />
            <FeatureCard
              icon={<ExportIcon />}
              title="Export Results"
              description="Download your search results as CSV, Excel, or PDF for offline analysis."
              link="/search"
              linkText="Export jobs"
              color="orange"
            />
            <FeatureCard
              icon={<ChartIcon />}
              title="Market Analytics"
              description="View salary trends, demand insights, and location-based job market data."
              link="/analytics"
              linkText="View analytics"
              color="cyan"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-brand">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Find Your Next Opportunity?
          </h2>
          <p className="text-xl text-white/80 mb-10">
            Start searching now and discover thousands of job opportunities tailored to your skills.
          </p>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-brand-primary bg-white rounded-xl hover:bg-stone-50 transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            Start Your Job Search
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}

// Feature Card Component
function FeatureCard({
  icon,
  title,
  description,
  link,
  linkText,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  linkText: string;
  color: 'blue' | 'pink' | 'purple' | 'green' | 'orange' | 'cyan';
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-brand-primary',
    pink: 'bg-pink-50 text-pink-500',
    purple: 'bg-purple-50 text-purple-500',
    green: 'bg-emerald-50 text-emerald-500',
    orange: 'bg-orange-50 text-orange-500',
    cyan: 'bg-cyan-50 text-cyan-500',
  };

  return (
    <div className="card p-6 card-hover">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colorClasses[color]}`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-stone-900 mb-2">{title}</h3>
      <p className="text-stone-600 text-sm mb-4">{description}</p>
      <Link
        href={link}
        className="inline-flex items-center text-sm font-medium text-brand-primary hover:text-blue-700"
      >
        {linkText}
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}

// Icons
function SearchIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ExportIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}
