"use client";

import { useState, useEffect, Suspense } from 'react';
import { useUser } from '@stackframe/stack';
import { useSearchParams } from 'next/navigation';
import { LINKEDIN_HOSTS } from '@/lib/linkedin/api';
import type { Job } from '@/lib/linkedin/api';
import { Column, Flex, Heading, Text, Button, Input, Select, Badge, Line, Avatar, RevealFx } from '@once-ui-system/core';

type SearchPreset = {
  id: string;
  name: string;
  keyword: string | null;
  location: string | null;
  country: string | null;
  jobType: string | null;
  experienceLevel: string | null;
  salary: string | null;
  remoteFilter: string | null;
  dateSincePosted: string | null;
};

function SearchContent() {
  const user = useUser();
  const searchParamsHook = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [presets, setPresets] = useState<SearchPreset[]>([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());

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

  // Load URL params and presets on mount
  useEffect(() => {
    const keyword = searchParamsHook.get('keyword');
    const location = searchParamsHook.get('location');
    const country = searchParamsHook.get('country');
    const jobType = searchParamsHook.get('jobType');
    const experienceLevel = searchParamsHook.get('experienceLevel');

    if (keyword || location || country || jobType || experienceLevel) {
      setSearchParams(prev => ({
        ...prev,
        keyword: keyword || prev.keyword,
        location: location || prev.location,
        country: country || prev.country,
        jobType: jobType || prev.jobType,
        experienceLevel: experienceLevel || prev.experienceLevel,
      }));
    }

    if (user) {
      loadPresets();
      loadSavedJobIds();
    }
  }, [searchParamsHook, user]);

  const loadPresets = async () => {
    try {
      const response = await fetch('/api/user/presets');
      const data = await response.json();
      if (data.success) {
        setPresets(data.presets || []);
      }
    } catch (error) {
      console.error('Failed to load presets:', error);
    }
  };

  const loadSavedJobIds = async () => {
    try {
      const response = await fetch('/api/user/saved-jobs');
      const data = await response.json();
      if (data.success && data.jobs) {
        const ids = new Set<string>(data.jobs.map((j: { jobId: string }) => j.jobId));
        setSavedJobIds(ids);
      }
    } catch (error) {
      console.error('Failed to load saved jobs:', error);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

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

    const jobId = job.jobUrl?.match(/(\d+)/)?.[1];
    if (!jobId) return;

    if (savedJobIds.has(jobId)) {
      showToast('Job already saved', 'error');
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
        setSavedJobIds(prev => new Set([...Array.from(prev), jobId]));
        showToast('Job saved!', 'success');
      }
    } catch (err) {
      console.error('Failed to save job:', err);
      showToast('Failed to save job', 'error');
    }
  };

  const applyPreset = (preset: SearchPreset) => {
    setSearchParams({
      keyword: preset.keyword || '',
      location: preset.location || '',
      country: preset.country || 'us',
      jobType: preset.jobType || '',
      experienceLevel: preset.experienceLevel || '',
      salary: preset.salary || '',
      remoteFilter: preset.remoteFilter || '',
      dateSincePosted: preset.dateSincePosted || '',
      limit: '20',
    });
    showToast(`Preset "${preset.name}" applied`, 'success');
  };

  const saveAsPreset = async () => {
    if (!presetName.trim()) {
      showToast('Please enter a preset name', 'error');
      return;
    }

    try {
      const response = await fetch('/api/user/presets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: presetName, ...searchParams }),
      });

      const data = await response.json();
      if (data.success) {
        setPresets(prev => [...prev, data.preset]);
        setShowSaveModal(false);
        setPresetName('');
        showToast('Preset saved!', 'success');
      } else {
        showToast(data.error || 'Failed to save preset', 'error');
      }
    } catch (error) {
      console.error('Save preset error:', error);
      showToast('Failed to save preset', 'error');
    }
  };

  return (
    <Column fillWidth maxWidth="l" gap="24" paddingTop="80">
      {/* Toast Notification */}
      {toast && (
        <Flex
          position="fixed"
          zIndex={100}
          padding="16"
          radius="m"
          shadow="l"
          background={toast.type === 'success' ? 'success-strong' : 'danger-strong'}
          style={{ top: 24, right: 24 }}
          className="animate-fade-in-up"
        >
          <Text onSolid="neutral-strong">{toast.message}</Text>
        </Flex>
      )}

      {/* Header */}
      <Column gap="8">
        <Heading variant="display-strong-m">Search Jobs</Heading>
        <Text variant="body-default-l" onBackground="neutral-weak">
          Find your next opportunity from LinkedIn
        </Text>
      </Column>

      <Flex gap="32" mobileDirection="column-reverse">
        {/* Results Section */}
        <Column flex={3} gap="16">
          {error && (
            <Flex padding="16" radius="m" background="danger-alpha-weak" border="danger-alpha-medium">
              <Text onBackground="danger-strong">{error}</Text>
            </Flex>
          )}

          {loading ? (
            <Flex horizontal="center" vertical="center" padding="80">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--brand-solid-strong)' }} />
            </Flex>
          ) : jobs.length > 0 ? (
            <Column gap="16">
              <Text variant="body-default-s" onBackground="neutral-weak">
                {jobs.length} jobs found
              </Text>
              {jobs.map((job, index) => {
                const jobId = job.jobUrl?.match(/(\d+)/)?.[1];
                const isSaved = jobId ? savedJobIds.has(jobId) : false;
                return (
                  <RevealFx key={index} translateY="8" delay={index * 0.05}>
                    <JobCard job={job} onSave={() => handleSaveJob(job)} isSaved={isSaved} />
                  </RevealFx>
                );
              })}
            </Column>
          ) : (
            <Column
              padding="64"
              horizontal="center"
              gap="16"
              background="surface"
              border="neutral-alpha-weak"
              radius="l"
              className="glass-card"
            >
              <svg style={{ width: 64, height: 64, color: 'var(--neutral-alpha-medium)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <Heading variant="heading-strong-m">Start Your Search</Heading>
              <Text onBackground="neutral-weak">Enter keywords and filters to find jobs</Text>
            </Column>
          )}
        </Column>

        {/* Search Form Sidebar */}
        <Column
          flex={1}
          gap="16"
          padding="24"
          radius="l"
          border="neutral-alpha-weak"
          background="surface"
          position="sticky"
          style={{ top: 100, height: 'fit-content', backdropFilter: 'blur(12px)' }}
          className="glass-card"
        >
          <Flex horizontal="space-between" vertical="center">
            <Heading variant="heading-strong-m">Filters</Heading>
            {user && (
              <Button variant="tertiary" size="s" onClick={() => setShowSaveModal(true)}>
                Save Preset
              </Button>
            )}
          </Flex>

          {/* Presets */}
          {user && presets.length > 0 && (
            <Column padding="12" radius="m" background="brand-alpha-weak" gap="8">
              <Text variant="label-strong-s" onBackground="brand-strong">Quick Presets</Text>
              <Flex gap="8" wrap>
                {presets.slice(0, 3).map(preset => (
                  <Button
                    key={preset.id}
                    variant="secondary"
                    size="s"
                    onClick={() => applyPreset(preset)}
                  >
                    {preset.name}
                  </Button>
                ))}
                {presets.length > 3 && (
                  <Text variant="body-default-xs" onBackground="brand-weak">
                    +{presets.length - 3} more
                  </Text>
                )}
              </Flex>
            </Column>
          )}

          <form onSubmit={handleSearch}>
            <Column gap="16">
              {/* Keyword */}
              <Column gap="4">
                <Text variant="label-default-s">Keyword</Text>
                <input
                  type="text"
                  value={searchParams.keyword}
                  onChange={(e) => setSearchParams({ ...searchParams, keyword: e.target.value })}
                  placeholder="e.g., Software Engineer"
                  className="w-full px-3 py-2 bg-transparent border rounded-lg focus:ring-2 focus:ring-blue-500"
                  style={{
                    borderColor: 'var(--neutral-alpha-medium)',
                    color: 'var(--neutral-on-background-strong)',
                  }}
                />
              </Column>

              {/* Location */}
              <Column gap="4">
                <Text variant="label-default-s">Location</Text>
                <input
                  type="text"
                  value={searchParams.location}
                  onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
                  placeholder="e.g., San Francisco"
                  className="w-full px-3 py-2 bg-transparent border rounded-lg focus:ring-2 focus:ring-blue-500"
                  style={{
                    borderColor: 'var(--neutral-alpha-medium)',
                    color: 'var(--neutral-on-background-strong)',
                  }}
                />
              </Column>

              {/* Country */}
              <Column gap="4">
                <Text variant="label-default-s">Country</Text>
                <select
                  value={searchParams.country}
                  onChange={(e) => setSearchParams({ ...searchParams, country: e.target.value })}
                  className="w-full px-3 py-2 bg-transparent border rounded-lg focus:ring-2 focus:ring-blue-500"
                  style={{
                    borderColor: 'var(--neutral-alpha-medium)',
                    color: 'var(--neutral-on-background-strong)',
                  }}
                >
                  {Object.entries(LINKEDIN_HOSTS).map(([code, { name, flag }]) => (
                    <option key={code} value={code}>{flag} {name}</option>
                  ))}
                </select>
              </Column>

              {/* Experience Level */}
              <Column gap="4">
                <Text variant="label-default-s">Experience Level</Text>
                <select
                  value={searchParams.experienceLevel}
                  onChange={(e) => setSearchParams({ ...searchParams, experienceLevel: e.target.value })}
                  className="w-full px-3 py-2 bg-transparent border rounded-lg focus:ring-2 focus:ring-blue-500"
                  style={{
                    borderColor: 'var(--neutral-alpha-medium)',
                    color: 'var(--neutral-on-background-strong)',
                  }}
                >
                  <option value="">Any</option>
                  <option value="internship">Internship</option>
                  <option value="entry level">Entry Level</option>
                  <option value="associate">Associate</option>
                  <option value="senior">Senior</option>
                  <option value="director">Director</option>
                  <option value="executive">Executive</option>
                </select>
              </Column>

              {/* Job Type */}
              <Column gap="4">
                <Text variant="label-default-s">Job Type</Text>
                <select
                  value={searchParams.jobType}
                  onChange={(e) => setSearchParams({ ...searchParams, jobType: e.target.value })}
                  className="w-full px-3 py-2 bg-transparent border rounded-lg focus:ring-2 focus:ring-blue-500"
                  style={{
                    borderColor: 'var(--neutral-alpha-medium)',
                    color: 'var(--neutral-on-background-strong)',
                  }}
                >
                  <option value="">Any</option>
                  <option value="full time">Full Time</option>
                  <option value="part time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="temporary">Temporary</option>
                  <option value="internship">Internship</option>
                </select>
              </Column>

              {/* Remote */}
              <Column gap="4">
                <Text variant="label-default-s">Work Type</Text>
                <select
                  value={searchParams.remoteFilter}
                  onChange={(e) => setSearchParams({ ...searchParams, remoteFilter: e.target.value })}
                  className="w-full px-3 py-2 bg-transparent border rounded-lg focus:ring-2 focus:ring-blue-500"
                  style={{
                    borderColor: 'var(--neutral-alpha-medium)',
                    color: 'var(--neutral-on-background-strong)',
                  }}
                >
                  <option value="">Any</option>
                  <option value="remote">Remote</option>
                  <option value="on site">On Site</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </Column>

              {/* Salary */}
              <Column gap="4">
                <Text variant="label-default-s">Minimum Salary</Text>
                <select
                  value={searchParams.salary}
                  onChange={(e) => setSearchParams({ ...searchParams, salary: e.target.value })}
                  className="w-full px-3 py-2 bg-transparent border rounded-lg focus:ring-2 focus:ring-blue-500"
                  style={{
                    borderColor: 'var(--neutral-alpha-medium)',
                    color: 'var(--neutral-on-background-strong)',
                  }}
                >
                  <option value="">Any</option>
                  <option value="40000">$40,000+</option>
                  <option value="60000">$60,000+</option>
                  <option value="80000">$80,000+</option>
                  <option value="100000">$100,000+</option>
                  <option value="120000">$120,000+</option>
                </select>
              </Column>

              {/* Date Posted */}
              <Column gap="4">
                <Text variant="label-default-s">Date Posted</Text>
                <select
                  value={searchParams.dateSincePosted}
                  onChange={(e) => setSearchParams({ ...searchParams, dateSincePosted: e.target.value })}
                  className="w-full px-3 py-2 bg-transparent border rounded-lg focus:ring-2 focus:ring-blue-500"
                  style={{
                    borderColor: 'var(--neutral-alpha-medium)',
                    color: 'var(--neutral-on-background-strong)',
                  }}
                >
                  <option value="">Any Time</option>
                  <option value="24hr">Last 24 Hours</option>
                  <option value="past week">Past Week</option>
                  <option value="past month">Past Month</option>
                </select>
              </Column>

              <Button
                type="submit"
                variant="primary"
                size="l"
                fillWidth
                disabled={loading}
              >
                {loading ? 'Searching...' : 'Search Jobs'}
              </Button>
            </Column>
          </form>
        </Column>
      </Flex>

      {/* Save Preset Modal */}
      {showSaveModal && (
        <Flex
          position="fixed"
          zIndex={50}
          horizontal="center"
          vertical="center"
          padding="16"
          style={{ inset: 0, background: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowSaveModal(false)}
        >
          <Column
            padding="24"
            radius="xl"
            background="surface"
            shadow="xl"
            gap="16"
            style={{ maxWidth: 400, width: '100%' }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card animate-fade-in-up"
          >
            <Heading variant="heading-strong-l">Save as Preset</Heading>

            <Column gap="4">
              <Text variant="label-default-s">Preset Name</Text>
              <input
                type="text"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                placeholder="e.g., Remote Frontend Jobs"
                className="w-full px-3 py-2 bg-transparent border rounded-lg focus:ring-2 focus:ring-blue-500"
                style={{
                  borderColor: 'var(--neutral-alpha-medium)',
                  color: 'var(--neutral-on-background-strong)',
                }}
              />
            </Column>

            <Column padding="12" radius="m" background="neutral-alpha-weak" gap="8">
              <Text variant="label-strong-s">Current filters:</Text>
              <Column gap="4">
                {searchParams.keyword && <Text variant="body-default-xs">Keyword: {searchParams.keyword}</Text>}
                {searchParams.location && <Text variant="body-default-xs">Location: {searchParams.location}</Text>}
                {searchParams.jobType && <Text variant="body-default-xs">Type: {searchParams.jobType}</Text>}
                {searchParams.experienceLevel && <Text variant="body-default-xs">Level: {searchParams.experienceLevel}</Text>}
                {searchParams.remoteFilter && <Text variant="body-default-xs">Work: {searchParams.remoteFilter}</Text>}
              </Column>
            </Column>

            <Flex gap="12" horizontal="end">
              <Button variant="secondary" onClick={() => setShowSaveModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={saveAsPreset}>
                Save Preset
              </Button>
            </Flex>
          </Column>
        </Flex>
      )}
    </Column>
  );
}

function JobCard({ job, onSave, isSaved }: { job: Job; onSave: () => void; isSaved: boolean }) {
  return (
    <Flex
      gap="16"
      padding="20"
      radius="l"
      border="neutral-alpha-weak"
      background="surface"
      className="glass-card card-interactive"
      style={{ backdropFilter: 'blur(12px)' }}
    >
      {job.companyLogo && (
        <Avatar
          src={job.companyLogo}
          size="l"
          style={{ borderRadius: 8, flexShrink: 0 }}
        />
      )}

      <Column flex={1} gap="8" style={{ minWidth: 0 }}>
        <Flex horizontal="space-between" gap="16">
          <Column gap="4">
            <a
              href={job.jobUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <Heading variant="heading-strong-m" className="card-interactive">
                {job.position}
              </Heading>
            </a>
            <Text variant="body-default-s" onBackground="neutral-weak">
              {job.company}
            </Text>
          </Column>

          <Button
            variant={isSaved ? 'primary' : 'tertiary'}
            size="s"
            onClick={onSave}
            disabled={isSaved}
            style={{ flexShrink: 0 }}
          >
            <svg
              style={{ width: 20, height: 20 }}
              fill={isSaved ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </Button>
        </Flex>

        <Flex gap="16" wrap>
          {job.location && (
            <Flex gap="4" vertical="center">
              <svg style={{ width: 16, height: 16, color: 'var(--neutral-on-background-weak)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <Text variant="body-default-xs" onBackground="neutral-weak">{job.location}</Text>
            </Flex>
          )}
          {job.salary && (
            <Flex gap="4" vertical="center">
              <svg style={{ width: 16, height: 16, color: 'var(--success-on-background-strong)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <Text variant="label-strong-xs" onBackground="success-strong">{job.salary}</Text>
            </Flex>
          )}
          {job.agoTime && (
            <Flex gap="4" vertical="center">
              <svg style={{ width: 16, height: 16, color: 'var(--neutral-on-background-weak)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <Text variant="body-default-xs" onBackground="neutral-weak">{job.agoTime}</Text>
            </Flex>
          )}
        </Flex>
      </Column>
    </Flex>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <Flex fillWidth horizontal="center" vertical="center" padding="80">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--brand-solid-strong)' }} />
      </Flex>
    }>
      <SearchContent />
    </Suspense>
  );
}
