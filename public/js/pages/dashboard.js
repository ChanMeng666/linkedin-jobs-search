/**
 * Dashboard Page JavaScript
 * Manages user statistics, saved jobs, and search history
 */

const Dashboard = {
    stats: null,
    savedJobs: [],
    searchHistory: [],

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
            // Load stats, saved jobs, and search history in parallel
            const [statsRes, savedJobsRes, historyRes] = await Promise.all([
                this.fetchWithAuth('/api/user/stats'),
                this.fetchWithAuth('/api/user/saved-jobs'),
                this.fetchWithAuth('/api/user/search-history')
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
            thisMonth: 0
        };

        this.animateValue('totalSearches', 0, stats.totalSearches || 0, 1000);
        this.animateValue('savedJobs', 0, stats.savedJobs || 0, 1000);
        this.animateValue('thisMonth', 0, stats.thisMonth || 0, 1000);

        // Update trend text
        const savedJobsTrend = document.querySelector('.stats-card-pink .stats-card-trend');
        if (savedJobsTrend && stats.recentSaves !== undefined) {
            savedJobsTrend.textContent = `+${stats.recentSaves} this week`;
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

    renderSearchHistory() {
        const container = document.querySelector('.timeline');
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
                        <button class="btn-timeline-primary" onclick="Dashboard.repeatSearch('${this.escapeHTML(JSON.stringify(search.searchParams))}')">
                            Search Again
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    },

    renderSavedJobs() {
        const container = document.querySelector('.jobs-grid');
        if (!container) return;

        if (this.savedJobs.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center py-8 text-stone-500">
                    <p>No saved jobs yet.</p>
                    <a href="/search.html" class="text-blue-600 hover:underline mt-2 inline-block">Search for jobs to save</a>
                </div>
            `;
            return;
        }

        container.innerHTML = this.savedJobs.slice(0, 6).map(job => `
            <div class="job-card feature-card" data-job-id="${job.id}">
                <div class="job-company-logo">${this.getCompanyEmoji(job.company)}</div>
                <h3 class="job-title">${this.escapeHTML(job.position)}</h3>
                <p class="job-company">${this.escapeHTML(job.company)}</p>
                <div class="job-meta">
                    <span class="job-meta-item">${this.escapeHTML(job.location || 'Location not specified')}</span>
                    ${job.salary ? `<span class="job-meta-item">${this.escapeHTML(job.salary)}</span>` : ''}
                </div>
                ${job.status ? `
                    <div class="job-status mt-2">
                        <span class="px-2 py-1 text-xs rounded-full ${this.getStatusClass(job.status)}">
                            ${this.getStatusLabel(job.status)}
                        </span>
                    </div>
                ` : ''}
                <div class="job-actions">
                    <a href="${job.jobUrl}" target="_blank" class="btn-job-primary">View Details</a>
                    <button class="btn-job-secondary" onclick="Dashboard.removeJob('${job.id}')">Remove</button>
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

    getStatusClass(status) {
        const classes = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'applied': 'bg-blue-100 text-blue-800',
            'interviewing': 'bg-purple-100 text-purple-800',
            'offered': 'bg-green-100 text-green-800',
            'rejected': 'bg-red-100 text-red-800'
        };
        return classes[status] || 'bg-stone-100 text-stone-800';
    },

    getStatusLabel(status) {
        const labels = {
            'pending': 'Saved',
            'applied': 'Applied',
            'interviewing': 'Interviewing',
            'offered': 'Offered',
            'rejected': 'Rejected'
        };
        return labels[status] || status;
    },

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

    async removeJob(jobId) {
        if (!confirm('Remove this job from your saved list?')) return;

        try {
            const response = await this.fetchWithAuth(`/api/user/saved-jobs/${jobId}`, {
                method: 'DELETE'
            });

            if (response.success) {
                const card = document.querySelector(`[data-job-id="${jobId}"]`);
                if (card) {
                    card.style.opacity = '0.5';
                    setTimeout(() => {
                        card.remove();
                        this.savedJobs = this.savedJobs.filter(j => j.id !== jobId);
                        if (this.savedJobs.length === 0) {
                            this.renderSavedJobs();
                        }
                    }, 300);
                }
            }
        } catch (error) {
            console.error('Failed to remove job:', error);
            alert('Failed to remove job. Please try again.');
        }
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
    },

    async exportSavedJobs() {
        if (this.savedJobs.length === 0) {
            alert('No saved jobs to export.');
            return;
        }

        try {
            const response = await fetch('/api/export/saved-jobs', {
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
