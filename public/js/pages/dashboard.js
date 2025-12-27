/**
 * Dashboard Page JavaScript
 * Manages user statistics, saved jobs, search history, charts, and presets
 */

const Dashboard = {
    stats: null,
    savedJobs: [],
    searchHistory: [],
    presets: [],
    trends: [],
    statusDistribution: {},
    charts: {},
    currentFilter: 'all',
    editingPresetId: null,
    editingJobId: null,

    async init() {
        // Check authentication
        if (typeof Auth !== 'undefined') {
            await Auth.init();
            if (!Auth.isAuthenticated()) {
                window.location.href = '/login.html';
                return;
            }
            this.updateUserGreeting();
        }

        // Load dashboard data
        await this.loadDashboardData();
        this.setupEventListeners();
    },

    updateUserGreeting() {
        const titleEl = document.querySelector('.dashboard-title');
        if (titleEl && Auth.user) {
            const name = Auth.user.displayName || Auth.user.email.split('@')[0];
            titleEl.textContent = `Welcome back, ${name}!`;
        }
    },

    async loadDashboardData() {
        try {
            // Load all data in parallel
            const [statsRes, savedJobsRes, historyRes, presetsRes, trendsRes, statusRes] = await Promise.all([
                this.fetchWithAuth('/api/user/stats'),
                this.fetchWithAuth('/api/user/saved-jobs'),
                this.fetchWithAuth('/api/user/search-history'),
                this.fetchWithAuth('/api/user/presets'),
                this.fetchWithAuth('/api/user/trends?days=7'),
                this.fetchWithAuth('/api/user/job-status-distribution')
            ]);

            if (statsRes.success) {
                this.stats = statsRes.stats;
                this.updateStats();
            }

            if (savedJobsRes.success) {
                this.savedJobs = savedJobsRes.jobs || [];
                this.renderSavedJobs();
            }

            if (historyRes.success) {
                this.searchHistory = historyRes.history || [];
                this.renderSearchHistory();
            }

            if (presetsRes.success) {
                this.presets = presetsRes.presets || [];
                this.renderPresets();
            }

            if (trendsRes.success) {
                this.trends = trendsRes.trends || [];
                this.renderTrendsChart();
            }

            if (statusRes.success) {
                this.statusDistribution = statusRes.distribution || {};
                this.renderStatusChart();
            }
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
            this.showError('Failed to load dashboard data. Please refresh the page.');
        }
    },

    async fetchWithAuth(url, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...(typeof Auth !== 'undefined' ? Auth.getAuthHeaders() : {})
        };

        const response = await fetch(url, {
            ...options,
            headers: { ...headers, ...options.headers }
        });

        return response.json();
    },

    updateStats() {
        const stats = this.stats || {
            totalSearches: 0,
            savedJobs: 0,
            appliedJobs: 0,
            thisMonth: 0,
            recentSaves: 0
        };

        this.animateValue('totalSearches', 0, stats.totalSearches || 0, 1000);
        this.animateValue('savedJobs', 0, stats.savedJobs || 0, 1000);
        this.animateValue('appliedJobs', 0, stats.appliedJobs || 0, 1000);
        this.animateValue('thisMonth', 0, stats.thisMonth || 0, 1000);

        // Update trend text
        const savesTrend = document.getElementById('savesTrend');
        if (savesTrend && stats.recentSaves !== undefined) {
            savesTrend.textContent = `+${stats.recentSaves} this week`;
        }

        const searchesTrend = document.getElementById('searchesTrend');
        if (searchesTrend && stats.thisMonth !== undefined) {
            searchesTrend.textContent = `${stats.thisMonth} this month`;
        }
    },

    animateValue(id, start, end, duration) {
        const element = document.getElementById(id);
        if (!element) return;

        const range = end - start;
        if (range === 0) {
            element.textContent = end;
            return;
        }

        const increment = end > start ? 1 : -1;
        const stepTime = Math.abs(Math.floor(duration / range));
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            element.textContent = current;
            if (current === end) {
                clearInterval(timer);
            }
        }, Math.max(stepTime, 10));
    },

    // ==================== CHARTS ====================

    renderTrendsChart() {
        const ctx = document.getElementById('trendsChart');
        if (!ctx || this.trends.length === 0) return;

        // Destroy existing chart if any
        if (this.charts.trends) {
            this.charts.trends.destroy();
        }

        const labels = this.trends.map(t => {
            const date = new Date(t.date);
            return date.toLocaleDateString('en-US', { weekday: 'short' });
        });

        this.charts.trends = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Searches',
                        data: this.trends.map(t => t.searches),
                        borderColor: '#0077B5',
                        backgroundColor: 'rgba(0, 119, 181, 0.1)',
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Saved Jobs',
                        data: this.trends.map(t => t.savedJobs),
                        borderColor: '#10B981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    },

    renderStatusChart() {
        const ctx = document.getElementById('statusChart');
        if (!ctx) return;

        // Destroy existing chart if any
        if (this.charts.status) {
            this.charts.status.destroy();
        }

        const labels = ['Saved', 'Applied', 'Interviewing', 'Offered', 'Rejected'];
        const data = [
            this.statusDistribution.saved || 0,
            this.statusDistribution.applied || 0,
            this.statusDistribution.interviewing || 0,
            this.statusDistribution.offered || 0,
            this.statusDistribution.rejected || 0
        ];

        // Check if there's any data
        const hasData = data.some(d => d > 0);

        this.charts.status = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels,
                datasets: [{
                    data: hasData ? data : [1],
                    backgroundColor: hasData ? [
                        '#fbbf24', // Saved - yellow
                        '#3b82f6', // Applied - blue
                        '#8b5cf6', // Interviewing - purple
                        '#10b981', // Offered - green
                        '#ef4444'  // Rejected - red
                    ] : ['#e5e5e5']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        });
    },

    // ==================== SEARCH HISTORY ====================

    renderSearchHistory() {
        const container = document.getElementById('searchHistoryTimeline');
        if (!container) return;

        if (this.searchHistory.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8 text-stone-500">
                    <p>No search history yet.</p>
                    <a href="/search.html" class="text-blue-600 hover:underline mt-2 inline-block">Start your first search</a>
                </div>
            `;
            return;
        }

        container.innerHTML = this.searchHistory.slice(0, 5).map(search => `
            <div class="timeline-item">
                <div class="timeline-marker"></div>
                <div class="timeline-content glass-card">
                    <div class="timeline-time">${this.formatTimeAgo(search.createdAt)}</div>
                    <h3 class="timeline-title">${this.escapeHTML(search.keyword || 'All Jobs')}</h3>
                    <p class="timeline-description">
                        ${search.location ? `Location: ${this.escapeHTML(search.location)} • ` : ''}
                        ${search.resultsCount || 0} results found
                    </p>
                    <div class="timeline-actions">
                        <button class="btn-timeline-primary" onclick="Dashboard.repeatSearch('${encodeURIComponent(JSON.stringify(search.searchParams || {}))}')">
                            Search Again
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    },

    // ==================== SAVED JOBS ====================

    renderSavedJobs() {
        const container = document.getElementById('savedJobsGrid');
        if (!container) return;

        // Filter jobs based on current filter
        let filteredJobs = this.savedJobs;
        if (this.currentFilter !== 'all') {
            filteredJobs = this.savedJobs.filter(job =>
                (job.status || 'saved') === this.currentFilter
            );
        }

        if (filteredJobs.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center py-8 text-stone-500">
                    <p>${this.currentFilter === 'all' ? 'No saved jobs yet.' : `No ${this.currentFilter} jobs.`}</p>
                    <a href="/search.html" class="text-blue-600 hover:underline mt-2 inline-block">Search for jobs to save</a>
                </div>
            `;
            return;
        }

        container.innerHTML = filteredJobs.slice(0, 9).map(job => `
            <div class="job-card feature-card" data-job-id="${job.id}">
                <div class="flex justify-between items-start mb-2">
                    <div class="job-company-logo">${this.getCompanyEmoji(job.company)}</div>
                    <span class="status-badge status-${job.status || 'saved'}">${this.getStatusLabel(job.status || 'saved')}</span>
                </div>
                <h3 class="job-title">${this.escapeHTML(job.position)}</h3>
                <p class="job-company">${this.escapeHTML(job.company)}</p>
                <div class="job-meta">
                    <span class="job-meta-item">${this.escapeHTML(job.location || 'Location not specified')}</span>
                    ${job.salary ? `<span class="job-meta-item">${this.escapeHTML(job.salary)}</span>` : ''}
                </div>
                <div class="job-actions mt-3">
                    <a href="${job.jobUrl}" target="_blank" class="btn-job-primary">View</a>
                    <button class="btn-job-secondary" onclick="Dashboard.openStatusModal('${job.id}')">Update</button>
                    <button class="btn-job-secondary text-red-600" onclick="Dashboard.removeJob('${job.id}')">Remove</button>
                </div>
            </div>
        `).join('');
    },

    getCompanyEmoji(company) {
        const name = (company || '').toLowerCase();
        if (name.includes('google')) return '<img src="https://logo.clearbit.com/google.com" class="w-8 h-8 rounded" onerror="this.textContent=\'G\'">';
        if (name.includes('microsoft')) return '<img src="https://logo.clearbit.com/microsoft.com" class="w-8 h-8 rounded" onerror="this.textContent=\'M\'">';
        if (name.includes('amazon')) return '<img src="https://logo.clearbit.com/amazon.com" class="w-8 h-8 rounded" onerror="this.textContent=\'A\'">';
        if (name.includes('apple')) return '<img src="https://logo.clearbit.com/apple.com" class="w-8 h-8 rounded" onerror="this.textContent=\'A\'">';
        if (name.includes('meta') || name.includes('facebook')) return '<img src="https://logo.clearbit.com/meta.com" class="w-8 h-8 rounded" onerror="this.textContent=\'M\'">';
        return company ? company.charAt(0).toUpperCase() : '?';
    },

    getStatusLabel(status) {
        const labels = {
            'saved': 'Saved',
            'applied': 'Applied',
            'interviewing': 'Interviewing',
            'offered': 'Offered',
            'rejected': 'Rejected'
        };
        return labels[status] || status;
    },

    // ==================== STATUS MODAL ====================

    openStatusModal(jobId) {
        const job = this.savedJobs.find(j => j.id === jobId);
        if (!job) return;

        this.editingJobId = jobId;
        document.getElementById('statusModalJobTitle').textContent = `${job.position} at ${job.company}`;
        document.getElementById('statusSelect').value = job.status || 'saved';
        document.getElementById('statusNotes').value = job.notes || '';
        document.getElementById('statusModal').classList.add('active');
    },

    closeStatusModal() {
        this.editingJobId = null;
        document.getElementById('statusModal').classList.remove('active');
    },

    async saveJobStatus() {
        if (!this.editingJobId) return;

        const status = document.getElementById('statusSelect').value;
        const notes = document.getElementById('statusNotes').value;

        try {
            const response = await this.fetchWithAuth(`/api/user/saved-jobs/${this.editingJobId}`, {
                method: 'PUT',
                body: JSON.stringify({ status, notes })
            });

            if (response.success) {
                // Update local data
                const job = this.savedJobs.find(j => j.id === this.editingJobId);
                if (job) {
                    job.status = status;
                    job.notes = notes;
                }

                this.closeStatusModal();
                this.renderSavedJobs();

                // Refresh charts
                const statusRes = await this.fetchWithAuth('/api/user/job-status-distribution');
                if (statusRes.success) {
                    this.statusDistribution = statusRes.distribution;
                    this.renderStatusChart();
                }
            }
        } catch (error) {
            console.error('Failed to update job status:', error);
            alert('Failed to update status. Please try again.');
        }
    },

    async removeJob(jobId) {
        if (!confirm('Remove this job from your saved list?')) return;

        try {
            const response = await this.fetchWithAuth(`/api/user/saved-jobs/${jobId}`, {
                method: 'DELETE'
            });

            if (response.success) {
                this.savedJobs = this.savedJobs.filter(j => j.id !== jobId);
                this.renderSavedJobs();

                // Refresh charts
                const statusRes = await this.fetchWithAuth('/api/user/job-status-distribution');
                if (statusRes.success) {
                    this.statusDistribution = statusRes.distribution;
                    this.renderStatusChart();
                }
            }
        } catch (error) {
            console.error('Failed to remove job:', error);
            alert('Failed to remove job. Please try again.');
        }
    },

    // ==================== PRESETS ====================

    renderPresets() {
        const container = document.getElementById('presetsGrid');
        if (!container) return;

        if (this.presets.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center py-8 text-stone-500">
                    <p>No search presets yet.</p>
                    <button onclick="Dashboard.openPresetModal()" class="text-blue-600 hover:underline mt-2 inline-block">Create your first preset</button>
                </div>
            `;
            return;
        }

        container.innerHTML = this.presets.map(preset => `
            <div class="preset-card ${preset.isDefault ? 'border-blue-500' : ''}">
                <div class="flex items-center gap-2">
                    <span class="preset-name">${this.escapeHTML(preset.name)}</span>
                    ${preset.isDefault ? '<span class="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">Default</span>' : ''}
                </div>
                <p class="preset-params">
                    ${preset.keyword ? this.escapeHTML(preset.keyword) : 'Any keyword'}
                    ${preset.location ? ` in ${this.escapeHTML(preset.location)}` : ''}
                    ${preset.remoteFilter ? ` (${preset.remoteFilter})` : ''}
                </p>
                <div class="preset-actions">
                    <button class="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700" onclick="Dashboard.applyPreset('${preset.id}')">
                        Use
                    </button>
                    <button class="px-3 py-1.5 border border-stone-300 text-sm rounded-lg hover:bg-stone-100" onclick="Dashboard.editPreset('${preset.id}')">
                        Edit
                    </button>
                    <button class="px-3 py-1.5 text-red-600 text-sm rounded-lg hover:bg-red-50" onclick="Dashboard.deletePreset('${preset.id}')">
                        Delete
                    </button>
                </div>
            </div>
        `).join('');
    },

    openPresetModal(presetId = null) {
        this.editingPresetId = presetId;
        const modal = document.getElementById('presetModal');
        const title = document.getElementById('presetModalTitle');

        if (presetId) {
            const preset = this.presets.find(p => p.id === presetId);
            if (preset) {
                title.textContent = 'Edit Preset';
                document.getElementById('presetName').value = preset.name || '';
                document.getElementById('presetKeyword').value = preset.keyword || '';
                document.getElementById('presetLocation').value = preset.location || '';
                document.getElementById('presetJobType').value = preset.jobType || '';
                document.getElementById('presetRemoteFilter').value = preset.remoteFilter || '';
                document.getElementById('presetIsDefault').checked = preset.isDefault || false;
            }
        } else {
            title.textContent = 'Create Preset';
            document.getElementById('presetName').value = '';
            document.getElementById('presetKeyword').value = '';
            document.getElementById('presetLocation').value = '';
            document.getElementById('presetJobType').value = '';
            document.getElementById('presetRemoteFilter').value = '';
            document.getElementById('presetIsDefault').checked = false;
        }

        modal.classList.add('active');
    },

    closePresetModal() {
        this.editingPresetId = null;
        document.getElementById('presetModal').classList.remove('active');
    },

    editPreset(presetId) {
        this.openPresetModal(presetId);
    },

    async savePreset() {
        const presetData = {
            name: document.getElementById('presetName').value,
            keyword: document.getElementById('presetKeyword').value,
            location: document.getElementById('presetLocation').value,
            jobType: document.getElementById('presetJobType').value,
            remoteFilter: document.getElementById('presetRemoteFilter').value,
            isDefault: document.getElementById('presetIsDefault').checked
        };

        if (!presetData.name) {
            alert('Please enter a preset name.');
            return;
        }

        try {
            const url = this.editingPresetId
                ? `/api/user/presets/${this.editingPresetId}`
                : '/api/user/presets';
            const method = this.editingPresetId ? 'PUT' : 'POST';

            const response = await this.fetchWithAuth(url, {
                method,
                body: JSON.stringify(presetData)
            });

            if (response.success) {
                this.closePresetModal();
                // Reload presets
                const presetsRes = await this.fetchWithAuth('/api/user/presets');
                if (presetsRes.success) {
                    this.presets = presetsRes.presets || [];
                    this.renderPresets();
                }
            }
        } catch (error) {
            console.error('Failed to save preset:', error);
            alert('Failed to save preset. Please try again.');
        }
    },

    async deletePreset(presetId) {
        if (!confirm('Delete this preset?')) return;

        try {
            const response = await this.fetchWithAuth(`/api/user/presets/${presetId}`, {
                method: 'DELETE'
            });

            if (response.success) {
                this.presets = this.presets.filter(p => p.id !== presetId);
                this.renderPresets();
            }
        } catch (error) {
            console.error('Failed to delete preset:', error);
            alert('Failed to delete preset. Please try again.');
        }
    },

    applyPreset(presetId) {
        const preset = this.presets.find(p => p.id === presetId);
        if (!preset) return;

        const params = new URLSearchParams();
        if (preset.keyword) params.set('keyword', preset.keyword);
        if (preset.location) params.set('location', preset.location);
        if (preset.jobType) params.set('jobType', preset.jobType);
        if (preset.remoteFilter) params.set('remoteFilter', preset.remoteFilter);
        if (preset.experienceLevel) params.set('experienceLevel', preset.experienceLevel);
        if (preset.salary) params.set('salary', preset.salary);

        window.location.href = `/search.html?${params.toString()}`;
    },

    // ==================== UTILITIES ====================

    formatTimeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} minutes ago`;
        if (diffHours < 24) return `${diffHours} hours ago`;
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString();
    },

    escapeHTML(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    repeatSearch(searchParamsJson) {
        try {
            const params = JSON.parse(decodeURIComponent(searchParamsJson));
            const queryString = new URLSearchParams(params).toString();
            window.location.href = `/search.html?${queryString}`;
        } catch (e) {
            window.location.href = '/search.html';
        }
    },

    setupEventListeners() {
        // Export saved jobs button
        const exportBtn = document.getElementById('exportSavedJobs');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportSavedJobs());
        }

        // Create preset button
        const createPresetBtn = document.getElementById('createPresetBtn');
        if (createPresetBtn) {
            createPresetBtn.addEventListener('click', () => this.openPresetModal());
        }

        // Status filter tabs
        const statusTabs = document.querySelectorAll('.status-tab');
        statusTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                statusTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.currentFilter = tab.dataset.status;
                this.renderSavedJobs();
            });
        });

        // Close modals on overlay click
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });
    },

    async exportSavedJobs() {
        if (this.savedJobs.length === 0) {
            alert('No saved jobs to export.');
            return;
        }

        try {
            const response = await fetch('/api/export/saved-jobs/excel', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...Auth.getAuthHeaders()
                },
                body: JSON.stringify({ jobs: this.savedJobs })
            });

            if (!response.ok) throw new Error('Export failed');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'saved-jobs.xlsx';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        } catch (error) {
            console.error('Export error:', error);
            alert('Failed to export. Please try again.');
        }
    },

    showError(message) {
        const container = document.querySelector('.dashboard-container');
        if (container) {
            const errorEl = document.createElement('div');
            errorEl.className = 'bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4';
            errorEl.textContent = message;
            container.insertBefore(errorEl, container.firstChild);
        }
    }
};

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => Dashboard.init());
