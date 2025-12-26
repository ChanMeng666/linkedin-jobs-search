"use client";

import { useState } from 'react';
import { useUser } from '@stackframe/stack';
import { LINKEDIN_HOSTS } from '@/lib/linkedin/api';
import type { Job } from '@/lib/linkedin/api';

export default function SearchPage() {
  const user = useUser();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    location: '',
    country: 'us',
    jobType: '',
    experienceLevel: '',
    salary: '',
    remoteFilter: '',
    dateSincePosted: '',
    limit: '20',
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchParams),
      });

      const data = await response.json();

      if (data.success) {
        setJobs(data.jobs || []);

        // Save to history if logged in
        if (user) {
          fetch('/api/user/search-history', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...searchParams, resultsCount: data.count }),
          }).catch(console.error);
        }
      } else {
        setError(data.error || 'Search failed');
      }
    } catch (err) {
      setError('Failed to search jobs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveJob = async (job: Job) => {
    if (!user) {
      window.location.href = '/login?from=save';
      return;
    }

    try {
      const response = await fetch('/api/user/saved-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(job),
      });

      const data = await response.json();
      if (data.success) {
        alert('Job saved!');
      }
    } catch (err) {
      console.error('Failed to save job:', err);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-900 mb-2">Search Jobs</h1>
          <p className="text-stone-600">Find your next opportunity from LinkedIn</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Search Filters */}
          <div className="lg:col-span-1">
            <form onSubmit={handleSearch} className="card p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-stone-900 mb-4">Filters</h2>

              {/* Keyword */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-stone-700 mb-1">Keyword</label>
                <input
                  type="text"
                  value={searchParams.keyword}
                  onChange={(e) => setSearchParams({ ...searchParams, keyword: e.target.value })}
                  placeholder="e.g., Software Engineer"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
              </div>

              {/* Location */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-stone-700 mb-1">Location</label>
                <input
                  type="text"
                  value={searchParams.location}
                  onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
                  placeholder="e.g., San Francisco"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
              </div>

              {/* Country */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-stone-700 mb-1">Country</label>
                <select
                  value={searchParams.country}
                  onChange={(e) => setSearchParams({ ...searchParams, country: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                >
                  {Object.entries(LINKEDIN_HOSTS).map(([code, { name, flag }]) => (
                    <option key={code} value={code}>{flag} {name}</option>
                  ))}
                </select>
              </div>

              {/* Experience Level */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-stone-700 mb-1">Experience Level</label>
                <select
                  value={searchParams.experienceLevel}
                  onChange={(e) => setSearchParams({ ...searchParams, experienceLevel: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                >
                  <option value="">Any</option>
                  <option value="internship">Internship</option>
                  <option value="entry level">Entry Level</option>
                  <option value="associate">Associate</option>
                  <option value="senior">Senior</option>
                  <option value="director">Director</option>
                  <option value="executive">Executive</option>
                </select>
              </div>

              {/* Job Type */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-stone-700 mb-1">Job Type</label>
                <select
                  value={searchParams.jobType}
                  onChange={(e) => setSearchParams({ ...searchParams, jobType: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                >
                  <option value="">Any</option>
                  <option value="full time">Full Time</option>
                  <option value="part time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="temporary">Temporary</option>
                  <option value="internship">Internship</option>
                </select>
              </div>

              {/* Remote */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-stone-700 mb-1">Work Type</label>
                <select
                  value={searchParams.remoteFilter}
                  onChange={(e) => setSearchParams({ ...searchParams, remoteFilter: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                >
                  <option value="">Any</option>
                  <option value="remote">Remote</option>
                  <option value="on site">On Site</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              {/* Salary */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-stone-700 mb-1">Minimum Salary</label>
                <select
                  value={searchParams.salary}
                  onChange={(e) => setSearchParams({ ...searchParams, salary: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                >
                  <option value="">Any</option>
                  <option value="40000">$40,000+</option>
                  <option value="60000">$60,000+</option>
                  <option value="80000">$80,000+</option>
                  <option value="100000">$100,000+</option>
                  <option value="120000">$120,000+</option>
                </select>
              </div>

              {/* Date Posted */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-stone-700 mb-1">Date Posted</label>
                <select
                  value={searchParams.dateSincePosted}
                  onChange={(e) => setSearchParams({ ...searchParams, dateSincePosted: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                >
                  <option value="">Any Time</option>
                  <option value="24hr">Last 24 Hours</option>
                  <option value="past week">Past Week</option>
                  <option value="past month">Past Month</option>
                </select>
              </div>

              {/* Search Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn btn-primary disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Search Jobs'}
              </button>
            </form>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
              </div>
            ) : jobs.length > 0 ? (
              <div className="space-y-4">
                <p className="text-sm text-stone-500">{jobs.length} jobs found</p>
                {jobs.map((job, index) => (
                  <JobCard key={index} job={job} onSave={() => handleSaveJob(job)} />
                ))}
              </div>
            ) : (
              <div className="card p-12 text-center">
                <svg className="w-16 h-16 text-stone-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-lg font-medium text-stone-900 mb-2">Start Your Search</h3>
                <p className="text-stone-500">Enter keywords and filters to find jobs</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function JobCard({ job, onSave }: { job: Job; onSave: () => void }) {
  return (
    <div className="card p-6 card-hover">
      <div className="flex gap-4">
        {job.companyLogo && (
          <img
            src={job.companyLogo}
            alt={job.company}
            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-stone-900 mb-1">
                <a href={job.jobUrl} target="_blank" rel="noopener noreferrer" className="hover:text-brand-primary">
                  {job.position}
                </a>
              </h3>
              <p className="text-stone-600">{job.company}</p>
            </div>
            <button
              onClick={onSave}
              className="p-2 text-stone-400 hover:text-brand-primary hover:bg-blue-50 rounded-lg transition-colors"
              title="Save job"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-stone-500">
            {job.location && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {job.location}
              </span>
            )}
            {job.salary && (
              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {job.salary}
              </span>
            )}
            {job.agoTime && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {job.agoTime}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
