"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@stackframe/stack';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
  { value: 'saved', label: 'Saved', color: 'bg-stone-100 text-stone-600' },
  { value: 'applied', label: 'Applied', color: 'bg-blue-100 text-blue-700' },
  { value: 'interviewing', label: 'Interviewing', color: 'bg-purple-100 text-purple-700' },
  { value: 'offered', label: 'Offered', color: 'bg-emerald-100 text-emerald-700' },
  { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-700' },
];

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
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Toast Notification */}
        {toast && (
          <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all ${
            toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
          }`}>
            {toast.message}
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-stone-900 mb-2">
              Welcome back, {user.displayName || user.primaryEmail?.split('@')[0] || 'User'}!
            </h1>
            <p className="text-stone-600">Manage your job search from your personal dashboard</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowExportModal(true)}
              className="btn btn-secondary flex items-center gap-2"
              disabled={savedJobs.length === 0}
            >
              <DownloadIcon />
              Export
            </button>
            <Link href="/search" className="btn btn-primary">
              Search Jobs
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Saved Jobs" value={savedJobs.length.toString()} icon={<BookmarkIcon />} color="blue" />
          <StatCard title="Applications" value={stats.applied.toString()} icon={<PaperIcon />} color="green" />
          <StatCard title="Interviews" value={stats.interviewing.toString()} icon={<CalendarIcon />} color="purple" />
          <StatCard title="Offers" value={stats.offered.toString()} icon={<StarIcon />} color="orange" />
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 mb-6">
          {[
            { id: 'jobs', label: 'Saved Jobs', count: savedJobs.length },
            { id: 'history', label: 'Search History', count: searchHistory.length },
            { id: 'presets', label: 'Search Presets', count: presets.length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-6 py-3 font-medium transition-colors relative ${
                activeTab === tab.id
                  ? 'text-brand-primary'
                  : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              {tab.label}
              <span className="ml-2 text-xs bg-stone-100 px-2 py-0.5 rounded-full">{tab.count}</span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
          </div>
        ) : (
          <>
            {/* Saved Jobs Tab */}
            {activeTab === 'jobs' && (
              <div>
                {/* Status Filter */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <button
                    onClick={() => setStatusFilter('all')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      statusFilter === 'all' ? 'bg-brand-primary text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    All ({savedJobs.length})
                  </button>
                  {JOB_STATUSES.map(status => (
                    <button
                      key={status.value}
                      onClick={() => setStatusFilter(status.value)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        statusFilter === status.value ? 'bg-brand-primary text-white' : `${status.color} hover:opacity-80`
                      }`}
                    >
                      {status.label} ({savedJobs.filter(j => j.status === status.value).length})
                    </button>
                  ))}
                </div>

                {filteredJobs.length > 0 ? (
                  <div className="space-y-4">
                    {filteredJobs.map(job => (
                      <div key={job.id} className="card p-6 hover:shadow-md transition-shadow">
                        <div className="flex gap-4">
                          {job.companyLogo && (
                            <img src={job.companyLogo} alt={job.company} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <a
                                  href={job.jobUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-lg font-semibold text-stone-900 hover:text-brand-primary"
                                >
                                  {job.position}
                                </a>
                                <p className="text-stone-600">{job.company}</p>
                                {job.location && <p className="text-sm text-stone-500">{job.location}</p>}
                              </div>
                              <div className="flex items-center gap-2">
                                <select
                                  value={job.status}
                                  onChange={(e) => updateJobStatus(job.id, e.target.value)}
                                  className="px-3 py-1.5 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                                >
                                  {JOB_STATUSES.map(s => (
                                    <option key={s.value} value={s.value}>{s.label}</option>
                                  ))}
                                </select>
                                <button
                                  onClick={() => setEditingJob(job)}
                                  className="p-2 text-stone-400 hover:text-brand-primary hover:bg-blue-50 rounded-lg"
                                  title="Edit notes"
                                >
                                  <EditIcon />
                                </button>
                                <button
                                  onClick={() => deleteJob(job.id)}
                                  className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                                  title="Remove"
                                >
                                  <TrashIcon />
                                </button>
                              </div>
                            </div>
                            {job.notes && (
                              <p className="mt-2 text-sm text-stone-500 bg-stone-50 p-2 rounded">{job.notes}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={<BookmarkIcon />}
                    title="No saved jobs"
                    description="Start searching and save jobs you're interested in"
                    action={{ label: 'Search Jobs', href: '/search' }}
                  />
                )}
              </div>
            )}

            {/* Search History Tab */}
            {activeTab === 'history' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm text-stone-500">{searchHistory.length} recent searches</p>
                  {searchHistory.length > 0 && (
                    <button onClick={clearHistory} className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1">
                      <TrashIcon /> Clear History
                    </button>
                  )}
                </div>

                {searchHistory.length > 0 ? (
                  <div className="space-y-3">
                    {searchHistory.map(search => (
                      <Link
                        key={search.id}
                        href={`/search?keyword=${encodeURIComponent(search.keyword || '')}&location=${encodeURIComponent(search.location || '')}`}
                        className="card p-4 flex items-center gap-4 hover:shadow-md transition-shadow group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center text-stone-500 group-hover:bg-brand-primary group-hover:text-white transition-colors">
                          <SearchIcon />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-stone-900">{search.keyword || 'All Jobs'}</p>
                          <p className="text-sm text-stone-500">
                            {search.location || 'Any location'} • {search.resultsCount || 0} results
                          </p>
                        </div>
                        <span className="text-sm text-stone-400">
                          {new Date(search.createdAt).toLocaleDateString()}
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={<SearchIcon />}
                    title="No search history"
                    description="Your recent searches will appear here"
                    action={{ label: 'Search Jobs', href: '/search' }}
                  />
                )}
              </div>
            )}

            {/* Search Presets Tab */}
            {activeTab === 'presets' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm text-stone-500">{presets.length} saved presets</p>
                  <button
                    onClick={() => setShowPresetModal(true)}
                    className="btn btn-primary flex items-center gap-2"
                  >
                    <PlusIcon /> New Preset
                  </button>
                </div>

                {presets.length > 0 ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {presets.map(preset => (
                      <div key={preset.id} className="card p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-stone-900">{preset.name}</h3>
                          <button
                            onClick={() => deletePreset(preset.id)}
                            className="p-1 text-stone-400 hover:text-red-500"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                        <div className="text-sm text-stone-500 space-y-1 mb-3">
                          {preset.keyword && <p>Keyword: {preset.keyword}</p>}
                          {preset.location && <p>Location: {preset.location}</p>}
                          {preset.jobType && <p>Type: {preset.jobType}</p>}
                          {preset.experienceLevel && <p>Level: {preset.experienceLevel}</p>}
                        </div>
                        <button
                          onClick={() => applyPreset(preset)}
                          className="w-full btn btn-secondary text-sm"
                        >
                          Apply Preset
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={<BookmarkIcon />}
                    title="No presets saved"
                    description="Save your frequent search configurations for quick access"
                    action={{ label: 'Create Preset', onClick: () => setShowPresetModal(true) }}
                  />
                )}
              </div>
            )}
          </>
        )}

        {/* Edit Job Modal */}
        {editingJob && (
          <Modal onClose={() => setEditingJob(null)} title="Edit Job Notes">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Status</label>
                <select
                  defaultValue={editingJob.status}
                  id="editStatus"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                >
                  {JOB_STATUSES.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Notes</label>
                <textarea
                  id="editNotes"
                  defaultValue={editingJob.notes || ''}
                  placeholder="Add personal notes about this job..."
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  rows={4}
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setEditingJob(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const status = (document.getElementById('editStatus') as HTMLSelectElement).value;
                    const notes = (document.getElementById('editNotes') as HTMLTextAreaElement).value;
                    updateJobStatus(editingJob.id, status, notes);
                  }}
                  className="btn btn-primary"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* Export Modal */}
        {showExportModal && (
          <Modal onClose={() => setShowExportModal(false)} title="Export Saved Jobs">
            <p className="text-stone-600 mb-6">Choose a format to export your {savedJobs.length} saved jobs:</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <button
                onClick={() => exportJobs('csv')}
                className="p-4 border-2 border-stone-200 rounded-xl hover:border-brand-primary hover:bg-blue-50 transition-colors text-left"
              >
                <div className="font-semibold text-stone-900 mb-1">CSV Format</div>
                <p className="text-sm text-stone-500">Compatible with Excel, Google Sheets</p>
              </button>
              <button
                onClick={() => exportJobs('json')}
                className="p-4 border-2 border-stone-200 rounded-xl hover:border-brand-primary hover:bg-blue-50 transition-colors text-left"
              >
                <div className="font-semibold text-stone-900 mb-1">JSON Format</div>
                <p className="text-sm text-stone-500">For developers and data processing</p>
              </button>
            </div>
          </Modal>
        )}

        {/* Create Preset Modal */}
        {showPresetModal && (
          <Modal onClose={() => setShowPresetModal(false)} title="Create Search Preset">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Preset Name</label>
                <input
                  type="text"
                  value={newPresetName}
                  onChange={(e) => setNewPresetName(e.target.value)}
                  placeholder="e.g., Remote Frontend Jobs"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
              </div>
              <p className="text-sm text-stone-500">
                Go to the Search page to set up your filters, then save them as a preset.
              </p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowPresetModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button onClick={createPreset} className="btn btn-primary">
                  Create Preset
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}

// Reusable Components
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

function Modal({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-stone-900">{title}</h2>
          <button onClick={onClose} className="p-1 text-stone-400 hover:text-stone-600">
            <CloseIcon />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function EmptyState({ icon, title, description, action }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: { label: string; href?: string; onClick?: () => void };
}) {
  return (
    <div className="card p-12 text-center">
      <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4 text-stone-400">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-stone-900 mb-2">{title}</h3>
      <p className="text-stone-500 mb-4">{description}</p>
      {action.href ? (
        <Link href={action.href} className="btn btn-primary">{action.label}</Link>
      ) : (
        <button onClick={action.onClick} className="btn btn-primary">{action.label}</button>
      )}
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

function StarIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
