"use client";

import { useState, useEffect, Suspense } from 'react';
import { useUser } from '@stackframe/stack';
import { useSearchParams } from 'next/navigation';
import { LINKEDIN_HOSTS } from '@/lib/linkedin/api';
import type { Job } from '@/lib/linkedin/api';
import { Column, Flex, Heading, Text, Button, Badge, Avatar, RevealFx, IconButton, Line } from '@once-ui-system/core';
import { Spinner } from '@/components/common/Spinner';

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
  const [filtersExpanded, setFiltersExpanded] = useState(true);

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

  // 计算活跃筛选数量
  const activeFilterCount = [
    searchParams.keyword,
    searchParams.location,
    searchParams.jobType,
    searchParams.experienceLevel,
    searchParams.salary,
    searchParams.remoteFilter,
    searchParams.dateSincePosted,
  ].filter(Boolean).length;

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
    // 搜索时自动收起筛选栏
    setFiltersExpanded(false);

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

  const clearFilters = () => {
    setSearchParams({
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
  };

  // 输入框样式
  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    backgroundColor: 'transparent',
    border: '1px solid var(--neutral-alpha-medium)',
    borderRadius: '8px',
    color: 'var(--neutral-on-background-strong)',
    fontSize: '14px',
  };

  return (
    <Column fillWidth maxWidth="l" gap="24" paddingY="xl">
      {/* Toast Notification */}
      {toast && (
        <Flex
          position="fixed"
          padding="16"
          radius="m"
          shadow="l"
          background={toast.type === 'success' ? 'success-strong' : 'danger-strong'}
          style={{ top: 24, right: 24, zIndex: 100 }}
          className="animate-fade-in-up"
        >
          <Text onSolid="neutral-strong">{toast.message}</Text>
        </Flex>
      )}

      {/* 页面标题 */}
      <Column gap="8" horizontal="center">
        <Heading variant="display-strong-m" align="center">Search Jobs</Heading>
        <Text variant="body-default-l" onBackground="neutral-weak" align="center">
          Find your next opportunity from LinkedIn
        </Text>
      </Column>

      {/* 顶部可折叠筛选栏 */}
      <Column
        fillWidth
        gap="16"
        padding="20"
        radius="l"
        border="neutral-alpha-weak"
        background="surface"
        className="glass-card"
      >
        {/* 筛选栏头部 */}
        <Flex fillWidth horizontal="between" vertical="center">
          <Flex gap="12" vertical="center">
            <Heading variant="heading-strong-m">Filters</Heading>
            {activeFilterCount > 0 && (
              <Badge>{activeFilterCount} active</Badge>
            )}
          </Flex>
          <Flex gap="8">
            {activeFilterCount > 0 && (
              <Button variant="tertiary" size="s" onClick={clearFilters}>
                Clear All
              </Button>
            )}
            {user && (
              <Button variant="tertiary" size="s" onClick={() => setShowSaveModal(true)}>
                Save Preset
              </Button>
            )}
            <Button
              variant="secondary"
              size="s"
              onClick={() => setFiltersExpanded(!filtersExpanded)}
            >
              {filtersExpanded ? 'Collapse' : 'Expand'}
            </Button>
          </Flex>
        </Flex>

        {/* Presets */}
        {user && presets.length > 0 && (
          <Flex gap="8" wrap vertical="center">
            <Text variant="label-default-s" onBackground="neutral-weak">Quick:</Text>
            {presets.slice(0, 4).map(preset => (
              <Button
                key={preset.id}
                variant="secondary"
                size="s"
                onClick={() => applyPreset(preset)}
              >
                {preset.name}
              </Button>
            ))}
          </Flex>
        )}

        {/* 展开的筛选表单 */}
        {filtersExpanded && (
          <form onSubmit={handleSearch}>
            <Flex gap="16" wrap fillWidth>
              {/* Keyword */}
              <Column gap="4" style={{ flex: '1 1 200px', minWidth: 180 }}>
                <Text variant="label-default-s">Keyword</Text>
                <input
                  type="text"
                  value={searchParams.keyword}
                  onChange={(e) => setSearchParams({ ...searchParams, keyword: e.target.value })}
                  placeholder="e.g., Software Engineer"
                  style={inputStyle}
                />
              </Column>

              {/* Location */}
              <Column gap="4" style={{ flex: '1 1 200px', minWidth: 180 }}>
                <Text variant="label-default-s">Location</Text>
                <input
                  type="text"
                  value={searchParams.location}
                  onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
                  placeholder="e.g., San Francisco"
                  style={inputStyle}
                />
              </Column>

              {/* Country */}
              <Column gap="4" style={{ flex: '1 1 160px', minWidth: 140 }}>
                <Text variant="label-default-s">Country</Text>
                <select
                  value={searchParams.country}
                  onChange={(e) => setSearchParams({ ...searchParams, country: e.target.value })}
                  style={inputStyle}
                >
                  {Object.entries(LINKEDIN_HOSTS).map(([code, { name, flag }]) => (
                    <option key={code} value={code}>{flag} {name}</option>
                  ))}
                </select>
              </Column>

              {/* Experience Level */}
              <Column gap="4" style={{ flex: '1 1 160px', minWidth: 140 }}>
                <Text variant="label-default-s">Experience</Text>
                <select
                  value={searchParams.experienceLevel}
                  onChange={(e) => setSearchParams({ ...searchParams, experienceLevel: e.target.value })}
                  style={inputStyle}
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
              <Column gap="4" style={{ flex: '1 1 140px', minWidth: 120 }}>
                <Text variant="label-default-s">Job Type</Text>
                <select
                  value={searchParams.jobType}
                  onChange={(e) => setSearchParams({ ...searchParams, jobType: e.target.value })}
                  style={inputStyle}
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
              <Column gap="4" style={{ flex: '1 1 140px', minWidth: 120 }}>
                <Text variant="label-default-s">Work Type</Text>
                <select
                  value={searchParams.remoteFilter}
                  onChange={(e) => setSearchParams({ ...searchParams, remoteFilter: e.target.value })}
                  style={inputStyle}
                >
                  <option value="">Any</option>
                  <option value="remote">Remote</option>
                  <option value="on site">On Site</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </Column>

              {/* Salary */}
              <Column gap="4" style={{ flex: '1 1 140px', minWidth: 120 }}>
                <Text variant="label-default-s">Min Salary</Text>
                <select
                  value={searchParams.salary}
                  onChange={(e) => setSearchParams({ ...searchParams, salary: e.target.value })}
                  style={inputStyle}
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
              <Column gap="4" style={{ flex: '1 1 140px', minWidth: 120 }}>
                <Text variant="label-default-s">Posted</Text>
                <select
                  value={searchParams.dateSincePosted}
                  onChange={(e) => setSearchParams({ ...searchParams, dateSincePosted: e.target.value })}
                  style={inputStyle}
                >
                  <option value="">Any Time</option>
                  <option value="24hr">Last 24h</option>
                  <option value="past week">Past Week</option>
                  <option value="past month">Past Month</option>
                </select>
              </Column>
            </Flex>

            {/* 搜索按钮 */}
            <Flex paddingTop="16">
              <Button
                type="submit"
                variant="primary"
                size="l"
                disabled={loading}
              >
                {loading ? 'Searching...' : 'Search Jobs'}
              </Button>
            </Flex>
          </form>
        )}

        {/* 折叠时显示简化搜索 */}
        {!filtersExpanded && (
          <form onSubmit={handleSearch}>
            <Flex gap="12" vertical="center">
              <input
                type="text"
                value={searchParams.keyword}
                onChange={(e) => setSearchParams({ ...searchParams, keyword: e.target.value })}
                placeholder="Search keywords..."
                style={{ ...inputStyle, flex: 1 }}
              />
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </Flex>
          </form>
        )}
      </Column>

      {/* 搜索结果 */}
      <Column gap="16" fillWidth>
        {error && (
          <Flex padding="16" radius="m" background="danger-alpha-weak" border="danger-alpha-medium">
            <Text onBackground="danger-strong">{error}</Text>
          </Flex>
        )}

        {loading ? (
          <Flex horizontal="center" vertical="center" padding="80">
            <Spinner size="l" />
          </Flex>
        ) : jobs.length > 0 ? (
          <Column gap="16">
            <Text variant="body-default-s" onBackground="neutral-weak">
              {jobs.length} jobs found
            </Text>
            <Flex gap="16" wrap fillWidth>
              {jobs.map((job, index) => {
                const jobId = job.jobUrl?.match(/(\d+)/)?.[1];
                const isSaved = jobId ? savedJobIds.has(jobId) : false;
                return (
                  <RevealFx
                    key={index}
                    translateY="8"
                    delay={index * 0.03}
                    style={{ flex: '1 1 360px', maxWidth: 600, minWidth: 320 }}
                  >
                    <JobCard job={job} onSave={() => handleSaveJob(job)} isSaved={isSaved} />
                  </RevealFx>
                );
              })}
            </Flex>
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

      {/* Save Preset Modal */}
      {showSaveModal && (
        <Flex
          position="fixed"
          horizontal="center"
          vertical="center"
          padding="16"
          style={{ inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50 }}
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
                style={inputStyle}
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
      style={{ backdropFilter: 'blur(12px)', height: '100%' }}
      fillWidth
    >
      {job.companyLogo && (
        <Avatar
          src={job.companyLogo}
          size="l"
          style={{ borderRadius: 8, flexShrink: 0 }}
        />
      )}

      <Column flex={1} gap="8" style={{ minWidth: 0 }}>
        <Flex horizontal="between" gap="16">
          <Column gap="4" style={{ minWidth: 0, flex: 1 }}>
            <a
              href={job.jobUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <Text
                variant="heading-strong-s"
                onBackground="neutral-strong"
                className="card-interactive"
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  display: 'block',
                }}
              >
                {job.position}
              </Text>
            </a>
            <Text variant="body-default-s" onBackground="neutral-weak">
              {job.company}
            </Text>
          </Column>

          <IconButton
            icon={isSaved ? 'bookmarkFilled' : 'bookmark'}
            variant={isSaved ? 'primary' : 'tertiary'}
            size="s"
            onClick={onSave}
            disabled={isSaved}
            tooltip={isSaved ? 'Saved' : 'Save job'}
          />
        </Flex>

        <Flex gap="12" wrap>
          {job.location && (
            <Flex gap="4" vertical="center">
              <svg style={{ width: 14, height: 14, color: 'var(--neutral-on-background-weak)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <Text variant="body-default-xs" onBackground="neutral-weak">{job.location}</Text>
            </Flex>
          )}
          {job.salary && (
            <Flex gap="4" vertical="center">
              <svg style={{ width: 14, height: 14, color: 'var(--success-on-background-strong)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <Text variant="label-strong-xs" onBackground="success-strong">{job.salary}</Text>
            </Flex>
          )}
          {job.agoTime && (
            <Flex gap="4" vertical="center">
              <svg style={{ width: 14, height: 14, color: 'var(--neutral-on-background-weak)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <Spinner size="l" />
      </Flex>
    }>
      <SearchContent />
    </Suspense>
  );
}
