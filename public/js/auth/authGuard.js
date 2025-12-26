/**
 * Authentication Guard Module
 * Protects pages and features that require authentication
 */

const AuthGuard = {
    // Protected pages configuration
    protectedPages: {
        'dashboard.html': {
            requireAuth: true,
            redirectParam: 'dashboard'
        },
        'analytics.html': {
            requireAuth: true,
            redirectParam: 'analytics'
        }
    },

    // Protected features configuration
    protectedFeatures: {
        saveJob: {
            message: 'Sign in to save jobs to your collection',
            redirectParam: 'save'
        },
        exportCSV: {
            message: 'Sign in to export search results',
            redirectParam: 'export'
        },
        exportExcel: {
            message: 'Sign in to export search results',
            redirectParam: 'export'
        },
        viewAnalytics: {
            message: 'Sign in to view market analytics',
            redirectParam: 'analytics'
        },
        accessDashboard: {
            message: 'Sign in to access your dashboard',
            redirectParam: 'dashboard'
        }
    },

    // State
    isInitialized: false,
    modalElement: null,

    /**
     * Initialize the auth guard
     */
    async init() {
        if (this.isInitialized) return;

        // Wait for Auth to initialize
        if (typeof Auth !== 'undefined') {
            await Auth.init();
        }

        // Check if current page requires auth
        await this.guardPage();

        this.isInitialized = true;
    },

    /**
     * Guard the current page
     */
    async guardPage() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const pageConfig = this.protectedPages[currentPage];

        if (!pageConfig || !pageConfig.requireAuth) {
            // Page doesn't require auth, hide loading overlay if exists
            this.hideLoadingOverlay();
            return;
        }

        // Check authentication
        if (typeof Auth === 'undefined' || !Auth.isAuthenticated()) {
            // Store intended URL
            this.storeIntendedUrl();

            // Redirect to login
            window.location.href = `/login.html?from=${pageConfig.redirectParam}`;
            return;
        }

        // User is authenticated, hide loading overlay
        this.hideLoadingOverlay();
    },

    /**
     * Hide the loading overlay on protected pages
     */
    hideLoadingOverlay() {
        const overlay = document.getElementById('authLoadingOverlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.remove();
            }, 300);
        }
    },

    /**
     * Check if user can access a feature
     */
    canAccess(feature) {
        if (typeof Auth === 'undefined') return false;
        return Auth.isAuthenticated();
    },

    /**
     * Require auth for a feature, with callback if authenticated
     */
    async requireAuth(feature, callback) {
        // Wait for Auth if not initialized
        if (typeof Auth !== 'undefined' && !Auth.isInitialized) {
            await Auth.init();
        }

        if (this.canAccess(feature)) {
            // User is authenticated, execute callback
            if (typeof callback === 'function') {
                return callback();
            }
            return true;
        }

        // User not authenticated, show login prompt
        const featureConfig = this.protectedFeatures[feature] || {
            message: 'Please sign in to use this feature',
            redirectParam: 'feature'
        };

        this.showLoginPrompt(featureConfig.message, featureConfig.redirectParam);
        return false;
    },

    /**
     * Store the intended URL for post-login redirect
     */
    storeIntendedUrl() {
        const currentUrl = window.location.href;
        if (!currentUrl.includes('login.html') && !currentUrl.includes('auth-callback')) {
            sessionStorage.setItem('intended_url', currentUrl);
        }
    },

    /**
     * Show login prompt modal
     */
    showLoginPrompt(message, redirectParam = '') {
        // Remove existing modal if any
        this.closeLoginPrompt();

        // Store intended URL
        this.storeIntendedUrl();

        // Create modal
        const modal = document.createElement('div');
        modal.id = 'authLoginPromptModal';
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4';
        modal.style.cssText = 'animation: fadeIn 0.2s ease-out;';

        modal.innerHTML = `
            <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" onclick="AuthGuard.closeLoginPrompt()"></div>
            <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform" style="animation: slideUp 0.3s ease-out;">
                <button onclick="AuthGuard.closeLoginPrompt()" class="absolute top-4 right-4 text-stone-400 hover:text-stone-600 transition-colors">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>

                <div class="text-center mb-6">
                    <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                        </svg>
                    </div>
                    <h3 class="text-xl font-bold text-stone-900 mb-2">Sign in required</h3>
                    <p class="text-stone-600">${message}</p>
                </div>

                <div class="space-y-3">
                    <a href="/login.html${redirectParam ? '?from=' + redirectParam : ''}"
                       class="flex items-center justify-center gap-2 w-full py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-xl transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                        </svg>
                        Sign In
                    </a>
                    <button onclick="AuthGuard.closeLoginPrompt()"
                            class="w-full py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium rounded-xl transition-colors">
                        Maybe Later
                    </button>
                </div>

                <p class="text-center text-sm text-stone-500 mt-6">
                    Free account. No credit card required.
                </p>
            </div>
        `;

        // Add animation styles if not present
        if (!document.getElementById('authGuardStyles')) {
            const style = document.createElement('style');
            style.id = 'authGuardStyles';
            style.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(modal);
        this.modalElement = modal;

        // Prevent body scroll
        document.body.style.overflow = 'hidden';

        // Handle escape key
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.closeLoginPrompt();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    },

    /**
     * Close login prompt modal
     */
    closeLoginPrompt() {
        const modal = document.getElementById('authLoginPromptModal');
        if (modal) {
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.remove();
            }, 200);
        }
        document.body.style.overflow = '';
        this.modalElement = null;
    },

    /**
     * Create auth loading overlay for protected pages
     * Call this at the start of protected page body
     */
    createLoadingOverlay() {
        return `
            <div id="authLoadingOverlay" style="position: fixed; inset: 0; background: white; z-index: 9999; display: flex; align-items: center; justify-content: center; transition: opacity 0.3s;">
                <div class="text-center">
                    <svg class="w-10 h-10 text-stone-400 animate-spin mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p class="text-stone-500">Loading...</p>
                </div>
            </div>
        `;
    },

    /**
     * Wrap a button click handler with auth check
     */
    wrapButton(button, feature) {
        if (!button) return;

        const originalOnClick = button.onclick;
        button.onclick = async (e) => {
            e.preventDefault();
            await this.requireAuth(feature, () => {
                if (originalOnClick) {
                    originalOnClick.call(button, e);
                }
            });
        };
    },

    /**
     * Setup guest-only UI hints on buttons
     */
    setupGuestHints() {
        if (typeof Auth === 'undefined' || Auth.isAuthenticated()) {
            return;
        }

        // Add hints to export buttons
        const exportCSV = document.getElementById('exportCSV');
        const exportExcel = document.getElementById('exportExcel');

        [exportCSV, exportExcel].forEach(btn => {
            if (btn && !btn.dataset.guestHintAdded) {
                const hint = document.createElement('span');
                hint.className = 'text-xs text-stone-400 ml-1';
                hint.textContent = '(Sign in)';
                hint.dataset.guestOnly = 'true';
                btn.appendChild(hint);
                btn.dataset.guestHintAdded = 'true';
            }
        });
    }
};

// Make AuthGuard available globally
window.AuthGuard = AuthGuard;
