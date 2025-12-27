"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@stackframe/stack';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Column, Flex, Text, Heading, Button, Tag, Line, RevealFx } from '@once-ui-system/core';
import { Spinner } from '@/components/common/Spinner';

type SavedJob = {
  id: string;
  jobId: string;
  position: string;
  company: string;
  location: string | null;
  salary: string | null;
  jobUrl: string;
  companyLogo: string | null;
  status: string;
  notes: string | null;
  createdAt: string;
};

type SearchHistoryItem = {
  id: string;
  keyword: string | null;
  location: string | null;
  resultsCount: number | null;
  createdAt: string;
};

type SearchPreset = {
  id: string;
  name: string;
  description: string | null;
  keyword: string | null;
  location: string | null;
  country: string | null;
  jobType: string | null;
  experienceLevel: string | null;
  isDefault: boolean;
};

const JOB_STATUSES = [
  { value: 'saved', label: 'Saved', color: 'neutral' },
  { value: 'applied', label: 'Applied', color: 'brand' },
  { value: 'interviewing', label: 'Interviewing', color: 'accent' },
  { value: 'offered', label: 'Offered', color: 'success' },
  { value: 'rejected', label: 'Rejected', color: 'danger' },
] as const;

export default function DashboardPage() {
  const user = useUser();
  const router = useRouter();
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [presets, setPresets] = useState<SearchPreset[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'jobs' | 'history' | 'presets'>('jobs');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modal states
  const [editingJob, setEditingJob] = useState<SavedJob | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showPresetModal, setShowPresetModal] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login?from=dashboard');
      return;
    }
    loadData();
  }, [user, router]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [jobsRes, historyRes, presetsRes] = await Promise.all([
        fetch('/api/user/saved-jobs'),
        fetch('/api/user/search-history?limit=10'),
        fetch('/api/user/presets'),
      ]);

      const [jobsData, historyData, presetsData] = await Promise.all([
        jobsRes.json(),
        historyRes.json(),
        presetsRes.json(),
      ]);

      if (jobsData.success) setSavedJobs(jobsData.jobs || []);
      if (historyData.success) setSearchHistory(historyData.history || []);
      if (presetsData.success) setPresets(presetsData.presets || []);
    } catch (error) {
      console.error('Failed to load data:', error);
      showToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const updateJobStatus = async (jobId: string, status: string, notes?: string) => {
    try {
      const response = await fetch('/api/user/saved-jobs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: jobId, status, notes }),
      });

      const data = await response.json();
      if (data.success) {
        setSavedJobs(jobs => jobs.map(j => j.id === jobId ? { ...j, status, notes: notes ?? j.notes } : j));
        showToast('Job updated successfully', 'success');
        setEditingJob(null);
      } else {
        showToast(data.error || 'Failed to update', 'error');
      }
    } catch (error) {
      console.error('Update error:', error);
      showToast('Failed to update job', 'error');
    }
  };

  const deleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to remove this job?')) return;

    try {
      const response = await fetch(`/api/user/saved-jobs?id=${jobId}`, { method: 'DELETE' });
      const data = await response.json();

      if (data.success) {
        setSavedJobs(jobs => jobs.filter(j => j.id !== jobId));
        showToast('Job removed', 'success');
      } else {
        showToast(data.error || 'Failed to delete', 'error');
      }
    } catch (error) {
      console.error('Delete error:', error);
      showToast('Failed to delete job', 'error');
    }
  };

  const clearHistory = async () => {
    if (!confirm('Clear all search history?')) return;

    try {
      const response = await fetch('/api/user/search-history', { method: 'DELETE' });
      const data = await response.json();

      if (data.success) {
        setSearchHistory([]);
        showToast('History cleared', 'success');
      } else {
        showToast(data.error || 'Failed to clear', 'error');
      }
    } catch (error) {
      console.error('Clear error:', error);
      showToast('Failed to clear history', 'error');
    }
  };

  const exportJobs = async (format: 'csv' | 'json') => {
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format, jobs: savedJobs }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `saved-jobs-${new Date().toISOString().split('T')[0]}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast(`Exported as ${format.toUpperCase()}`, 'success');
        setShowExportModal(false);
      } else {
        showToast('Export failed', 'error');
      }
    } catch (error) {
      console.error('Export error:', error);
      showToast('Export failed', 'error');
    }
  };

  const createPreset = async () => {
    if (!newPresetName.trim()) {
      showToast('Please enter a preset name', 'error');
      return;
    }

    try {
      const response = await fetch('/api/user/presets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newPresetName }),
      });

      const data = await response.json();
      if (data.success) {
        setPresets(p => [...p, data.preset]);
        setNewPresetName('');
        setShowPresetModal(false);
        showToast('Preset created', 'success');
      } else {
        showToast(data.error || 'Failed to create preset', 'error');
      }
    } catch (error) {
      console.error('Create preset error:', error);
      showToast('Failed to create preset', 'error');
    }
  };

  const deletePreset = async (presetId: string) => {
    if (!confirm('Delete this preset?')) return;

    try {
      const response = await fetch(`/api/user/presets?id=${presetId}`, { method: 'DELETE' });
      const data = await response.json();

      if (data.success) {
        setPresets(p => p.filter(preset => preset.id !== presetId));
        showToast('Preset deleted', 'success');
      } else {
        showToast(data.error || 'Failed to delete', 'error');
      }
    } catch (error) {
      console.error('Delete preset error:', error);
      showToast('Failed to delete preset', 'error');
    }
  };

  const applyPreset = (preset: SearchPreset) => {
    const params = new URLSearchParams();
    if (preset.keyword) params.set('keyword', preset.keyword);
    if (preset.location) params.set('location', preset.location);
    if (preset.country) params.set('country', preset.country);
    if (preset.jobType) params.set('jobType', preset.jobType);
    if (preset.experienceLevel) params.set('experienceLevel', preset.experienceLevel);
    router.push(`/search?${params.toString()}`);
  };

  const filteredJobs = statusFilter === 'all'
    ? savedJobs
    : savedJobs.filter(j => j.status === statusFilter);

  const stats = {
    saved: savedJobs.filter(j => j.status === 'saved').length,
    applied: savedJobs.filter(j => j.status === 'applied').length,
    interviewing: savedJobs.filter(j => j.status === 'interviewing').length,
    offered: savedJobs.filter(j => j.status === 'offered').length,
  };

  if (!user) {
    return (
      <Flex fillWidth fillHeight horizontal="center" vertical="center" paddingY="104">
        <Spinner size="l" />
      </Flex>
    );
  }

  return (
    <Column maxWidth="l" gap="32" paddingY="xl">
      {/* Toast Notification */}
      {toast && (
        <Flex
          position="fixed"
          padding="16"
          paddingX="24"
          radius="l"
          shadow="l"
          background={toast.type === 'success' ? 'success-strong' : 'danger-strong'}
          style={{ top: 80, right: 24, zIndex: 50 }}
          className="animate-fade-in-up"
        >
          <Text variant="body-default-s" onSolid="neutral-strong">
            {toast.message}
          </Text>
        </Flex>
      )}

      {/* Header */}
      <RevealFx translateY="4">
        <Flex fillWidth horizontal="space-between" vertical="center" gap="24" mobileDirection="column">
          <Column gap="8">
            <Heading variant="display-strong-m">
              Welcome back, {user.displayName || user.primaryEmail?.split('@')[0] || 'User'}!
            </Heading>
            <Text variant="body-default-l" onBackground="neutral-weak">
              Manage your job search from your personal dashboard
            </Text>
          </Column>
          <Flex gap="12">
            <Button
              variant="secondary"
              size="m"
              onClick={() => setShowExportModal(true)}
              disabled={savedJobs.length === 0}
            >
              <DownloadIcon />
              Export
            </Button>
            <Link href="/search" style={{ textDecoration: 'none' }}>
              <Button variant="primary" size="m">
                Search Jobs
              </Button>
            </Link>
          </Flex>
        </Flex>
      </RevealFx>

      {/* Stats Grid */}
      <RevealFx translateY="8" delay={0.1}>
        <Flex gap="24" wrap fillWidth>
          <StatCard title="Saved Jobs" value={savedJobs.length} icon={<BookmarkIcon />} color="brand" />
          <StatCard title="Applications" value={stats.applied} icon={<PaperIcon />} color="success" />
          <StatCard title="Interviews" value={stats.interviewing} icon={<CalendarIcon />} color="accent" />
          <StatCard title="Offers" value={stats.offered} icon={<StarIcon />} color="warning" />
        </Flex>
      </RevealFx>

      {/* Tab Navigation */}
      <RevealFx translateY="12" delay={0.2}>
        <Column gap="24" fillWidth>
          <Flex gap="8" fillWidth>
            {[
              { id: 'jobs', label: 'Saved Jobs', count: savedJobs.length },
              { id: 'history', label: 'Search History', count: searchHistory.length },
              { id: 'presets', label: 'Search Presets', count: presets.length },
            ].map(tab => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'primary' : 'tertiary'}
                size="m"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
              >
                <Flex gap="8" vertical="center">
                  <span>{tab.label}</span>
                  <Tag size="s" variant={activeTab === tab.id ? 'neutral' : 'neutral'}>
                    {tab.count}
                  </Tag>
                </Flex>
              </Button>
            ))}
          </Flex>

          <Line background="neutral-alpha-weak" />

          {loading ? (
            <Flex fillWidth horizontal="center" paddingY="64">
              <Spinner size="l" />
            </Flex>
          ) : (
            <>
              {/* Saved Jobs Tab */}
              {activeTab === 'jobs' && (
                <Column gap="24" fillWidth>
                  {/* Status Filter */}
                  <Flex gap="8" wrap>
                    <Button
                      variant={statusFilter === 'all' ? 'primary' : 'tertiary'}
                      size="s"
                      onClick={() => setStatusFilter('all')}
                    >
                      All ({savedJobs.length})
                    </Button>
                    {JOB_STATUSES.map(status => (
                      <Button
                        key={status.value}
                        variant={statusFilter === status.value ? 'primary' : 'tertiary'}
                        size="s"
                        onClick={() => setStatusFilter(status.value)}
                      >
                        {status.label} ({savedJobs.filter(j => j.status === status.value).length})
                      </Button>
                    ))}
                  </Flex>

                  {filteredJobs.length > 0 ? (
                    <Column gap="16" fillWidth>
                      {filteredJobs.map(job => (
                        <Flex
                          key={job.id}
                          padding="24"
                          radius="l"
                          border="neutral-alpha-weak"
                          background="surface"
                          gap="16"
                          fillWidth
                          className="glass-card hover-lift"
                          style={{
                            backdropFilter: 'blur(12px)',
                            WebkitBackdropFilter: 'blur(12px)',
                          }}
                        >
                          {job.companyLogo && (
                            <img
                              src={job.companyLogo}
                              alt={job.company}
                              style={{
                                width: 48,
                                height: 48,
                                borderRadius: 12,
                                objectFit: 'cover',
                                flexShrink: 0,
                              }}
                            />
                          )}
                          <Column flex={1} gap="8" style={{ minWidth: 0 }}>
                            <Flex horizontal="space-between" vertical="start" gap="16" mobileDirection="column">
                              <Column gap="4">
                                <a
                                  href={job.jobUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ textDecoration: 'none' }}
                                >
                                  <Text variant="heading-strong-m" onBackground="neutral-strong" className="card-interactive">
                                    {job.position}
                                  </Text>
                                </a>
                                <Text variant="body-default-m" onBackground="neutral-medium">{job.company}</Text>
                                {job.location && (
                                  <Text variant="body-default-s" onBackground="neutral-weak">{job.location}</Text>
                                )}
                              </Column>
                              <Flex gap="8" vertical="center">
                                <select
                                  value={job.status}
                                  onChange={(e) => updateJobStatus(job.id, e.target.value)}
                                  style={{
                                    padding: '8px 12px',
                                    fontSize: 14,
                                    border: '1px solid var(--neutral-alpha-weak)',
                                    borderRadius: 8,
                                    background: 'var(--surface-background)',
                                    color: 'var(--neutral-on-background-strong)',
                                    cursor: 'pointer',
                                  }}
                                >
                                  {JOB_STATUSES.map(s => (
                                    <option key={s.value} value={s.value}>{s.label}</option>
                                  ))}
                                </select>
                                <button
                                  onClick={() => setEditingJob(job)}
                                  className="card-interactive"
                                  style={{
                                    padding: 8,
                                    borderRadius: 8,
                                    border: 'none',
                                    background: 'transparent',
                                    cursor: 'pointer',
                                    color: 'var(--neutral-on-background-weak)',
                                  }}
                                  title="Edit notes"
                                >
                                  <EditIcon />
                                </button>
                                <button
                                  onClick={() => deleteJob(job.id)}
                                  className="card-interactive"
                                  style={{
                                    padding: 8,
                                    borderRadius: 8,
                                    border: 'none',
                                    background: 'transparent',
                                    cursor: 'pointer',
                                    color: 'var(--neutral-on-background-weak)',
                                  }}
                                  title="Remove"
                                >
                                  <TrashIcon />
                                </button>
                              </Flex>
                            </Flex>
                            {job.notes && (
                              <Text
                                variant="body-default-s"
                                onBackground="neutral-weak"
                                style={{
                                  marginTop: 8,
                                  padding: 12,
                                  background: 'var(--neutral-alpha-weak)',
                                  borderRadius: 8,
                                }}
                              >
                                {job.notes}
                              </Text>
                            )}
                          </Column>
                        </Flex>
                      ))}
                    </Column>
                  ) : (
                    <EmptyState
                      icon={<BookmarkIcon />}
                      title="No saved jobs"
                      description="Start searching and save jobs you're interested in"
                      actionLabel="Search Jobs"
                      actionHref="/search"
                    />
                  )}
                </Column>
              )}

              {/* Search History Tab */}
              {activeTab === 'history' && (
                <Column gap="16" fillWidth>
                  <Flex horizontal="space-between" vertical="center">
                    <Text variant="body-default-s" onBackground="neutral-weak">
                      {searchHistory.length} recent searches
                    </Text>
                    {searchHistory.length > 0 && (
                      <Button variant="danger" size="s" onClick={clearHistory}>
                        <TrashIcon /> Clear History
                      </Button>
                    )}
                  </Flex>

                  {searchHistory.length > 0 ? (
                    <Column gap="12" fillWidth>
                      {searchHistory.map(search => (
                        <Link
                          key={search.id}
                          href={`/search?keyword=${encodeURIComponent(search.keyword || '')}&location=${encodeURIComponent(search.location || '')}`}
                          style={{ textDecoration: 'none' }}
                        >
                          <Flex
                            padding="16"
                            radius="l"
                            border="neutral-alpha-weak"
                            background="surface"
                            gap="16"
                            vertical="center"
                            fillWidth
                            className="glass-card hover-lift"
                            style={{
                              backdropFilter: 'blur(12px)',
                              WebkitBackdropFilter: 'blur(12px)',
                            }}
                          >
                            <Flex
                              padding="12"
                              radius="m"
                              background="brand-alpha-weak"
                              horizontal="center"
                              vertical="center"
                              style={{ width: 44, height: 44 }}
                            >
                              <SearchIcon />
                            </Flex>
                            <Column flex={1} gap="4">
                              <Text variant="heading-strong-s" onBackground="neutral-strong">
                                {search.keyword || 'All Jobs'}
                              </Text>
                              <Text variant="body-default-s" onBackground="neutral-weak">
                                {search.location || 'Any location'} &bull; {search.resultsCount || 0} results
                              </Text>
                            </Column>
                            <Text variant="body-default-xs" onBackground="neutral-weak">
                              {new Date(search.createdAt).toLocaleDateString()}
                            </Text>
                          </Flex>
                        </Link>
                      ))}
                    </Column>
                  ) : (
                    <EmptyState
                      icon={<SearchIcon />}
                      title="No search history"
                      description="Your recent searches will appear here"
                      actionLabel="Search Jobs"
                      actionHref="/search"
                    />
                  )}
                </Column>
              )}

              {/* Search Presets Tab */}
              {activeTab === 'presets' && (
                <Column gap="16" fillWidth>
                  <Flex horizontal="space-between" vertical="center">
                    <Text variant="body-default-s" onBackground="neutral-weak">
                      {presets.length} saved presets
                    </Text>
                    <Button variant="primary" size="s" onClick={() => setShowPresetModal(true)}>
                      <PlusIcon /> New Preset
                    </Button>
                  </Flex>

                  {presets.length > 0 ? (
                    <Flex gap="16" wrap fillWidth>
                      {presets.map(preset => (
                        <Column
                          key={preset.id}
                          padding="20"
                          radius="l"
                          border="neutral-alpha-weak"
                          background="surface"
                          gap="12"
                          className="glass-card hover-lift"
                          style={{
                            flex: '1 1 280px',
                            maxWidth: 360,
                            backdropFilter: 'blur(12px)',
                            WebkitBackdropFilter: 'blur(12px)',
                          }}
                        >
                          <Flex horizontal="space-between" vertical="start">
                            <Text variant="heading-strong-m" onBackground="neutral-strong">
                              {preset.name}
                            </Text>
                            <button
                              onClick={() => deletePreset(preset.id)}
                              className="card-interactive"
                              style={{
                                padding: 4,
                                borderRadius: 4,
                                border: 'none',
                                background: 'transparent',
                                cursor: 'pointer',
                                color: 'var(--neutral-on-background-weak)',
                              }}
                            >
                              <TrashIcon />
                            </button>
                          </Flex>
                          <Column gap="4">
                            {preset.keyword && (
                              <Text variant="body-default-s" onBackground="neutral-weak">
                                Keyword: {preset.keyword}
                              </Text>
                            )}
                            {preset.location && (
                              <Text variant="body-default-s" onBackground="neutral-weak">
                                Location: {preset.location}
                              </Text>
                            )}
                            {preset.jobType && (
                              <Text variant="body-default-s" onBackground="neutral-weak">
                                Type: {preset.jobType}
                              </Text>
                            )}
                            {preset.experienceLevel && (
                              <Text variant="body-default-s" onBackground="neutral-weak">
                                Level: {preset.experienceLevel}
                              </Text>
                            )}
                          </Column>
                          <Button
                            variant="secondary"
                            size="s"
                            fillWidth
                            onClick={() => applyPreset(preset)}
                          >
                            Apply Preset
                          </Button>
                        </Column>
                      ))}
                    </Flex>
                  ) : (
                    <EmptyState
                      icon={<BookmarkIcon />}
                      title="No presets saved"
                      description="Save your frequent search configurations for quick access"
                      actionLabel="Create Preset"
                      onClick={() => setShowPresetModal(true)}
                    />
                  )}
                </Column>
              )}
            </>
          )}
        </Column>
      </RevealFx>

      {/* Edit Job Modal */}
      {editingJob && (
        <Modal onClose={() => setEditingJob(null)} title="Edit Job Notes">
          <Column gap="16">
            <Column gap="8">
              <Text variant="label-strong-s">Status</Text>
              <select
                defaultValue={editingJob.status}
                id="editStatus"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: 14,
                  border: '1px solid var(--neutral-alpha-weak)',
                  borderRadius: 12,
                  background: 'var(--surface-background)',
                  color: 'var(--neutral-on-background-strong)',
                }}
              >
                {JOB_STATUSES.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </Column>
            <Column gap="8">
              <Text variant="label-strong-s">Notes</Text>
              <textarea
                id="editNotes"
                defaultValue={editingJob.notes || ''}
                placeholder="Add personal notes about this job..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: 14,
                  border: '1px solid var(--neutral-alpha-weak)',
                  borderRadius: 12,
                  background: 'var(--surface-background)',
                  color: 'var(--neutral-on-background-strong)',
                  resize: 'vertical',
                }}
              />
            </Column>
            <Flex gap="12" horizontal="end">
              <Button variant="tertiary" size="m" onClick={() => setEditingJob(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="m"
                onClick={() => {
                  const status = (document.getElementById('editStatus') as HTMLSelectElement).value;
                  const notes = (document.getElementById('editNotes') as HTMLTextAreaElement).value;
                  updateJobStatus(editingJob.id, status, notes);
                }}
              >
                Save Changes
              </Button>
            </Flex>
          </Column>
        </Modal>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <Modal onClose={() => setShowExportModal(false)} title="Export Saved Jobs">
          <Column gap="24">
            <Text variant="body-default-m" onBackground="neutral-medium">
              Choose a format to export your {savedJobs.length} saved jobs:
            </Text>
            <Flex gap="16" mobileDirection="column">
              <Flex
                padding="20"
                radius="l"
                border="neutral-alpha-weak"
                flex={1}
                direction="column"
                gap="8"
                onClick={() => exportJobs('csv')}
                className="card-interactive"
                style={{ cursor: 'pointer' }}
              >
                <Text variant="heading-strong-s" onBackground="neutral-strong">
                  CSV Format
                </Text>
                <Text variant="body-default-s" onBackground="neutral-weak">
                  Compatible with Excel, Google Sheets
                </Text>
              </Flex>
              <Flex
                padding="20"
                radius="l"
                border="neutral-alpha-weak"
                flex={1}
                direction="column"
                gap="8"
                onClick={() => exportJobs('json')}
                className="card-interactive"
                style={{ cursor: 'pointer' }}
              >
                <Text variant="heading-strong-s" onBackground="neutral-strong">
                  JSON Format
                </Text>
                <Text variant="body-default-s" onBackground="neutral-weak">
                  For developers and data processing
                </Text>
              </Flex>
            </Flex>
          </Column>
        </Modal>
      )}

      {/* Create Preset Modal */}
      {showPresetModal && (
        <Modal onClose={() => setShowPresetModal(false)} title="Create Search Preset">
          <Column gap="16">
            <Column gap="8">
              <Text variant="label-strong-s">Preset Name</Text>
              <input
                type="text"
                value={newPresetName}
                onChange={(e) => setNewPresetName(e.target.value)}
                placeholder="e.g., Remote Frontend Jobs"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: 14,
                  border: '1px solid var(--neutral-alpha-weak)',
                  borderRadius: 12,
                  background: 'var(--surface-background)',
                  color: 'var(--neutral-on-background-strong)',
                }}
              />
            </Column>
            <Text variant="body-default-s" onBackground="neutral-weak">
              Go to the Search page to set up your filters, then save them as a preset.
            </Text>
            <Flex gap="12" horizontal="end">
              <Button variant="tertiary" size="m" onClick={() => setShowPresetModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="m" onClick={createPreset}>
                Create Preset
              </Button>
            </Flex>
          </Column>
        </Modal>
      )}
    </Column>
  );
}

// Stat Card Component
function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: 'brand' | 'success' | 'accent' | 'warning';
}) {
  const colorMap = {
    brand: 'brand-alpha-weak',
    success: 'success-alpha-weak',
    accent: 'accent-alpha-weak',
    warning: 'warning-alpha-weak',
  } as const;

  return (
    <Flex
      padding="24"
      radius="l"
      border="neutral-alpha-weak"
      background="surface"
      gap="16"
      vertical="center"
      className="glass-card hover-lift"
      style={{
        flex: '1 1 220px',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <Flex
        padding="12"
        radius="m"
        background={colorMap[color]}
        horizontal="center"
        vertical="center"
        style={{ width: 48, height: 48 }}
      >
        {icon}
      </Flex>
      <Column gap="4">
        <Text variant="display-strong-m" onBackground="neutral-strong">
          {value}
        </Text>
        <Text variant="body-default-s" onBackground="neutral-weak">
          {title}
        </Text>
      </Column>
    </Flex>
  );
}

// Modal Component
function Modal({
  children,
  onClose,
  title,
}: {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
}) {
  return (
    <Flex
      position="fixed"
      horizontal="center"
      vertical="center"
      padding="24"
      style={{
        inset: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        zIndex: 50,
      }}
      onClick={onClose}
    >
      <Column
        padding="24"
        radius="xl"
        background="surface"
        shadow="xl"
        gap="20"
        onClick={(e) => e.stopPropagation()}
        className="glass-card animate-fade-in-up"
        style={{
          maxWidth: 480,
          width: '100%',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
        }}
      >
        <Flex horizontal="space-between" vertical="center">
          <Heading variant="heading-strong-l">{title}</Heading>
          <button
            onClick={onClose}
            style={{
              padding: 4,
              borderRadius: 8,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: 'var(--neutral-on-background-weak)',
            }}
            className="card-interactive"
          >
            <CloseIcon />
          </button>
        </Flex>
        {children}
      </Column>
    </Flex>
  );
}

// Empty State Component
function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel: string;
  actionHref?: string;
  onClick?: () => void;
}) {
  return (
    <Column
      padding="48"
      radius="l"
      border="neutral-alpha-weak"
      background="surface"
      gap="16"
      horizontal="center"
      className="glass-card"
      style={{
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <Flex
        padding="16"
        radius="full"
        background="neutral-alpha-weak"
        horizontal="center"
        vertical="center"
        style={{ width: 64, height: 64, color: 'var(--neutral-on-background-weak)' }}
      >
        {icon}
      </Flex>
      <Heading variant="heading-strong-m" align="center">
        {title}
      </Heading>
      <Text variant="body-default-m" onBackground="neutral-weak" align="center">
        {description}
      </Text>
      {actionHref ? (
        <Link href={actionHref} style={{ textDecoration: 'none' }}>
          <Button variant="primary" size="m">
            {actionLabel}
          </Button>
        </Link>
      ) : (
        <Button variant="primary" size="m" onClick={onClick}>
          {actionLabel}
        </Button>
      )}
    </Column>
  );
}

// Icons
function BookmarkIcon() {
  return (
    <svg style={{ width: 24, height: 24 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
  );
}

function PaperIcon() {
  return (
    <svg style={{ width: 24, height: 24, color: 'var(--success-on-background-strong)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg style={{ width: 24, height: 24, color: 'var(--accent-on-background-strong)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg style={{ width: 24, height: 24, color: 'var(--warning-on-background-strong)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg style={{ width: 20, height: 20, color: 'var(--brand-on-background-strong)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
