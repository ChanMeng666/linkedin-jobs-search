/**
 * Main Application
 * Core application logic and initialization
 */

// Application state
const App = {
    currentPage: 0,
    searchParams: {},
    lastSearchResults: [],

    // Initialize application
    init() {
        this.setupEventListeners();
        this.setupTabs();
        this.setupPagination();
        this.setupMobileToggle();
        this.setCurrentYear();
        this.setupExportButtons();
    },

    // Setup event listeners
    setupEventListeners() {
        const searchForm = DOM.$('searchForm');
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => this.handleSearch(e));
        }
    },

    // Setup tab switching
    setupTabs() {
        const searchTab = DOM.$('searchTab');
        const apiDocsTab = DOM.$('apiDocsTab');
        const searchContent = DOM.$('searchContent');
        const apiDocsContent = DOM.$('apiDocsContent');

        if (searchTab) {
            searchTab.addEventListener('click', () => {
                this.switchTab('search', searchTab, apiDocsTab, searchContent, apiDocsContent);
            });
        }

        if (apiDocsTab) {
            apiDocsTab.addEventListener('click', () => {
                this.switchTab('api', apiDocsTab, searchTab, apiDocsContent, searchContent);
                this.initializeCopyButtons();
            });
        }
    },

    // Switch tabs
    switchTab(tab, activeTab, inactiveTab, activeContent, inactiveContent) {
        // Update tab styling
        DOM.addClass(activeTab, 'active', 'text-blue-600', 'border-blue-600');
        DOM.removeClass(activeTab, 'text-slate-600', 'border-transparent');
        DOM.removeClass(inactiveTab, 'active', 'text-blue-600', 'border-blue-600');
        DOM.addClass(inactiveTab, 'text-slate-600', 'border-transparent');

        // Toggle content
        DOM.removeClass(activeContent, 'hidden');
        DOM.addClass(inactiveContent, 'hidden');
    },

    // Setup pagination
    setupPagination() {
        const prevBtn = DOM.$('prevPage');
        const nextBtn = DOM.$('nextPage');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (this.currentPage > 0) {
                    this.currentPage--;
                    DOM.$$('input[name="page"]').value = this.currentPage;
                    DOM.$('searchForm').dispatchEvent(new Event('submit'));
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.currentPage++;
                DOM.$$('input[name="page"]').value = this.currentPage;
                DOM.$('searchForm').dispatchEvent(new Event('submit'));
            });
        }
    },

    // Setup mobile toggle
    setupMobileToggle() {
        const toggleBtn = DOM.$('toggleSearchForm');
        const formContainer = DOM.$$('.search-form-container');

        if (toggleBtn && formContainer) {
            toggleBtn.addEventListener('click', () => {
                formContainer.classList.toggle('expanded');
                toggleBtn.innerHTML = formContainer.classList.contains('expanded')
                    ? '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>'
                    : '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>';
            });
        }

        // Auto-close on mobile after search
        const searchForm = DOM.$('searchForm');
        if (searchForm) {
            searchForm.addEventListener('submit', () => {
                if (window.innerWidth <= 1024 && formContainer) {
                    formContainer.classList.remove('expanded');
                }
            });
        }

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 1024 && formContainer) {
                formContainer.classList.remove('expanded');
            }
        });
    },

    // Handle search form submission
    async handleSearch(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        // Handle checkboxes
        data.has_verification = e.target.querySelector('input[name="has_verification"]').checked;
        data.under_10_applicants = e.target.querySelector('input[name="under_10_applicants"]').checked;

        // Remove empty values
        Object.keys(data).forEach(key => {
            if (!data[key] && data[key] !== false) delete data[key];
        });

        this.searchParams = data;

        // Show loading
        DOM.setHTML('results', `
            <div class="text-center p-4">
                <p class="text-gray-600">Searching...</p>
            </div>
        `);

        try {
            const result = await API.searchJobs(data);
            this.displayResults(result, data);
            this.updatePagination(result.jobs.length, data.limit || '10');

            // Store results for analytics page
            if (result.success && result.jobs) {
                this.lastSearchResults = result.jobs;
                localStorage.setItem('lastSearchResults', JSON.stringify(result.jobs));
                this.updateExportButtons(true);
            }
        } catch (error) {
            this.displayError(error);
        }
    },

    // Setup export buttons
    setupExportButtons() {
        const exportCSVBtn = DOM.$('exportCSV');
        const exportExcelBtn = DOM.$('exportExcel');

        if (exportCSVBtn) {
            exportCSVBtn.addEventListener('click', () => this.handleExport('csv'));
        }
        if (exportExcelBtn) {
            exportExcelBtn.addEventListener('click', () => this.handleExport('excel'));
        }
    },

    // Handle export with auth check
    async handleExport(format) {
        if (typeof AuthGuard !== 'undefined') {
            const featureKey = format === 'csv' ? 'exportCSV' : 'exportExcel';
            await AuthGuard.requireAuth(featureKey, () => this.exportResults(format));
        } else {
            this.exportResults(format);
        }
    },

    // Update export button state
    updateExportButtons(enabled) {
        const exportCSVBtn = DOM.$('exportCSV');
        const exportExcelBtn = DOM.$('exportExcel');

        if (exportCSVBtn) exportCSVBtn.disabled = !enabled;
        if (exportExcelBtn) exportExcelBtn.disabled = !enabled;
    },

    // Export search results
    async exportResults(format) {
        if (this.lastSearchResults.length === 0) {
            alert('No search results to export. Please search first.');
            return;
        }

        try {
            const response = await fetch(`/api/export/${format}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ jobs: this.lastSearchResults })
            });

            if (!response.ok) throw new Error('Export failed');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `jobs-export.${format === 'excel' ? 'xlsx' : format}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        } catch (error) {
            console.error('Export error:', error);
            alert('Failed to export. Please try again.');
        }
    },

    // Save job to favorites
    async saveJob(job) {
        // Check auth using AuthGuard
        if (typeof AuthGuard !== 'undefined') {
            const canProceed = await AuthGuard.requireAuth('saveJob', () => this.performSaveJob(job));
            if (!canProceed) return;
        } else if (typeof Auth === 'undefined' || !Auth.isAuthenticated()) {
            alert('Please sign in to save jobs.');
            window.location.href = '/login.html';
            return;
        } else {
            await this.performSaveJob(job);
        }
    },

    // Perform the actual job save
    async performSaveJob(job) {
        try {
            const response = await fetch('/api/user/saved-jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...Auth.getAuthHeaders()
                },
                body: JSON.stringify({
                    jobId: job.jobId || this.generateJobId(job),
                    position: job.position,
                    company: job.company,
                    location: job.location,
                    salary: job.salary,
                    jobUrl: job.jobUrl
                })
            });

            if (!response.ok) throw new Error('Save failed');

            const result = await response.json();
            if (result.success) {
                // Update button state
                const btn = document.querySelector(`[data-job-url="${job.jobUrl}"] .save-job-btn`);
                if (btn) {
                    btn.classList.add('saved');
                    btn.innerHTML = this.getSavedIcon();
                }
            }
        } catch (error) {
            console.error('Save job error:', error);
            alert('Failed to save job. Please try again.');
        }
    },

    // Generate a job ID from URL
    generateJobId(job) {
        const match = job.jobUrl.match(/view\/(\d+)/);
        return match ? match[1] : btoa(job.jobUrl).substring(0, 20);
    },

    // Get save icon SVG
    getSaveIcon() {
        return `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
        </svg>`;
    },

    // Get saved icon SVG
    getSavedIcon() {
        return `<svg fill="currentColor" stroke="currentColor" viewBox="0 0 24 24" class="w-5 h-5 text-red-500">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
        </svg>`;
    },

    // Display search results
    displayResults(result, searchParams) {
        // Display search parameters
        const paramsHTML = Formatters.formatSearchParams(searchParams);
        DOM.setHTML('searchParams', `
            <h3 class="font-bold text-lg mb-2">Search Parameters</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                ${paramsHTML}
            </div>
        `);

        // Display jobs
        if (result.success && result.jobs && result.jobs.length > 0) {
            const jobsHTML = result.jobs.map(job => this.renderJobCard(job)).join('');
            DOM.setHTML('results', `
                <h3 class="text-lg font-bold mb-4">Found ${result.jobs.length} jobs</h3>
                <div class="space-y-4">
                    ${jobsHTML}
                </div>
            `);
        } else {
            DOM.setHTML('results', `
                <div class="alert alert-warning">
                    <p>No matching jobs found. Please try adjusting your search criteria.</p>
                </div>
            `);
        }
    },

    // Render individual job card
    renderJobCard(job) {
        const jobData = encodeURIComponent(JSON.stringify(job));
        return `
            <div class="job-card" data-job-url="${Formatters.escapeHTML(job.jobUrl)}">
                <div class="job-card-header">
                    <div class="job-card-info">
                        <h2 class="job-card-position">${Formatters.escapeHTML(job.position)}</h2>
                        <p class="job-card-company">${Formatters.escapeHTML(job.company)}</p>
                    </div>
                    <div class="flex items-center gap-2">
                        <button class="save-job-btn p-2 rounded-full hover:bg-stone-100 transition-colors"
                                onclick="App.saveJob(JSON.parse(decodeURIComponent('${jobData}')))"
                                title="Save to favorites">
                            ${this.getSaveIcon()}
                        </button>
                        ${job.companyLogo ? `
                            <img src="${job.companyLogo}" alt="${Formatters.escapeHTML(job.company)} logo"
                                 class="job-card-logo">
                        ` : ''}
                    </div>
                </div>
                <div class="job-card-meta">
                    <div class="job-card-meta-item">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        <span>${Formatters.escapeHTML(job.location)}</span>
                    </div>
                    <div class="job-card-meta-item">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <span>${Formatters.escapeHTML(job.agoTime)}</span>
                    </div>
                    ${job.salary ? `
                        <div class="job-card-meta-item job-card-salary">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            <span>${Formatters.escapeHTML(job.salary)}</span>
                        </div>
                    ` : ''}
                </div>
                <div class="job-card-footer">
                    <div class="job-card-meta-item">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        <span>${Formatters.escapeHTML(job.date)}</span>
                    </div>
                    <a href="${job.jobUrl}" target="_blank" class="btn-primary job-card-action">
                        View Details
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                        </svg>
                    </a>
                </div>
            </div>
        `;
    },

    // Display error
    displayError(error) {
        DOM.setHTML('results', `
            <div class="alert alert-error">
                <p>Search request failed. Please try again later.</p>
            </div>
        `);
    },

    // Update pagination controls
    updatePagination(jobsCount, limit) {
        const prevBtn = DOM.$('prevPage');
        const nextBtn = DOM.$('nextPage');
        const currentPageSpan = DOM.$('currentPage');
        const searchStats = DOM.$('searchStats');

        if (prevBtn) prevBtn.disabled = this.currentPage === 0;
        if (nextBtn) nextBtn.disabled = jobsCount < parseInt(limit);
        if (currentPageSpan) currentPageSpan.textContent = this.currentPage + 1;

        if (searchStats) {
            searchStats.innerHTML = `
                <p>Currently showing: ${jobsCount} jobs</p>
                <p>Results per page: ${limit}</p>
            `;
        }
    },

    // Initialize copy buttons for code blocks
    initializeCopyButtons() {
        const codeBlocks = document.querySelectorAll('#apiDocsContent pre code, #apiDocsContent pre');

        codeBlocks.forEach((block) => {
            if (block.parentElement.classList.contains('code-block-wrapper')) {
                return;
            }

            const wrapper = document.createElement('div');
            wrapper.className = 'code-block-wrapper';
            block.parentElement.insertBefore(wrapper, block);
            wrapper.appendChild(block);

            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-button';
            copyBtn.innerHTML = `
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
            `;

            copyBtn.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(block.textContent);
                    copyBtn.classList.add('copied');
                    copyBtn.innerHTML = `
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M5 13l4 4L19 7"/>
                        </svg>
                    `;
                    setTimeout(() => {
                        copyBtn.classList.remove('copied');
                        copyBtn.innerHTML = `
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                            </svg>
                        `;
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy:', err);
                }
            });

            wrapper.appendChild(copyBtn);
        });
    },

    // Set current year in footer
    setCurrentYear() {
        const currentYear = new Date().getFullYear();
        const yearElements = document.querySelectorAll('#currentYear, #currentYearMobile');
        yearElements.forEach(el => {
            if (el) el.textContent = currentYear;
        });
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
