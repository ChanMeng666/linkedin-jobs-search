/**
 * Authentication Module
 * Manages Stack Auth integration on the frontend
 */

const Auth = {
    // Stack Auth Configuration
    config: {
        projectId: null,
        publishableKey: null,
        apiUrl: 'https://api.stack-auth.com/api/v1'
    },

    // Current user state
    user: null,
    accessToken: null,
    refreshToken: null,

    // Config loading state
    configLoaded: false,
    configError: null,
    isInitialized: false,

    /**
     * Initialize auth module
     */
    async init() {
        if (this.isInitialized) return this;

        // Load config from server
        await this.loadConfig();

        // Check for stored session
        await this.checkSession();

        // Handle OAuth callback if on callback page
        if (window.location.pathname.includes('auth-callback')) {
            await this.handleOAuthCallback();
        }

        // Update UI based on auth state
        this.updateUI();

        this.isInitialized = true;
        return this;
    },

    /**
     * Load configuration from server with validation
     */
    async loadConfig() {
        this.configError = null;

        try {
            const response = await fetch('/api/auth/config');

            if (!response.ok) {
                throw new Error(`Config endpoint returned ${response.status}`);
            }

            const data = await response.json();

            if (data.success && data.config?.projectId && data.config?.publishableKey) {
                this.config.projectId = data.config.projectId;
                this.config.publishableKey = data.config.publishableKey;
                this.configLoaded = true;
            } else {
                throw new Error('Invalid or incomplete auth configuration');
            }
        } catch (error) {
            console.error('Failed to load auth config:', error);
            this.configError = error.message || 'Failed to load authentication configuration';
            this.configLoaded = false;
        }
    },

    /**
     * Check for existing session
     */
    async checkSession() {
        const token = localStorage.getItem('stack_access_token');
        const refreshToken = localStorage.getItem('stack_refresh_token');

        if (!token) {
            this.user = null;
            return;
        }

        try {
            // Verify token with backend
            const response = await fetch('/api/auth/verify', {
                headers: {
                    'x-stack-access-token': token
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.valid) {
                    this.user = data.user;
                    this.accessToken = token;
                    this.refreshToken = refreshToken;
                } else {
                    this.clearSession();
                }
            } else if (refreshToken) {
                // Try to refresh token
                await this.refreshAccessToken(refreshToken);
            } else {
                this.clearSession();
            }
        } catch (error) {
            console.error('Session check failed:', error);
            this.clearSession();
        }
    },

    /**
     * Validate config before OAuth redirect
     */
    validateConfig() {
        if (!this.configLoaded) {
            return {
                valid: false,
                error: 'Authentication service is not configured. Please try again later.'
            };
        }

        if (!this.config.publishableKey) {
            return {
                valid: false,
                error: 'Missing authentication credentials. Please contact support.'
            };
        }

        if (!this.config.projectId) {
            return {
                valid: false,
                error: 'Invalid authentication project configuration.'
            };
        }

        return { valid: true };
    },

    /**
     * Show error message to user
     */
    showError(message) {
        // Try to find existing error container
        const errorContainer = document.getElementById('authErrorContainer') ||
                              document.getElementById('authError') ||
                              document.querySelector('.auth-error-container');

        if (errorContainer) {
            const messageEl = errorContainer.querySelector('.error-message') ||
                             errorContainer.querySelector('#authErrorMessage') ||
                             errorContainer;
            if (messageEl) {
                messageEl.textContent = message;
            }
            errorContainer.classList.remove('hidden');
            return;
        }

        // Create floating error toast if no container exists
        let toast = document.getElementById('authErrorToast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'authErrorToast';
            toast.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300';
            document.body.appendChild(toast);
        }

        toast.innerHTML = `
            <div class="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-lg shadow-lg">
                <svg class="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span class="text-red-700 text-sm">${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-red-400 hover:text-red-600">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>
        `;
        toast.style.opacity = '1';

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            if (toast && toast.parentElement) {
                toast.style.opacity = '0';
                setTimeout(() => toast.remove(), 300);
            }
        }, 5000);
    },

    /**
     * Get friendly OAuth error message
     */
    getFriendlyOAuthError(error, description) {
        const errorMap = {
            'access_denied': 'You cancelled the sign-in. Click a provider to try again.',
            'invalid_request': 'There was a problem with the sign-in request. Please try again.',
            'unauthorized_client': 'This application is not authorized. Please contact support.',
            'unsupported_response_type': 'Authentication configuration error. Please contact support.',
            'invalid_scope': 'Permission request error. Please contact support.',
            'server_error': 'The authentication server is experiencing issues. Please try again later.',
            'temporarily_unavailable': 'Authentication is temporarily unavailable. Please try again later.'
        };

        return errorMap[error] || description || 'An unexpected error occurred. Please try again.';
    },

    /**
     * Initiate OAuth login with validation and PKCE
     */
    async loginWithOAuth(provider) {
        // Ensure config is loaded
        if (!this.configLoaded) {
            await this.loadConfig();
        }

        // Validate config before proceeding
        const validation = this.validateConfig();
        if (!validation.valid) {
            this.showError(validation.error);
            return;
        }

        // Store intended URL for post-login redirect
        const currentUrl = window.location.href;
        if (!currentUrl.includes('login.html') && !currentUrl.includes('auth-callback')) {
            sessionStorage.setItem('intended_url', currentUrl);
        }

        const callbackUrl = `${window.location.origin}/auth-callback.html`;

        // Generate PKCE code verifier and challenge
        const codeVerifier = this.generateCodeVerifier();
        const codeChallenge = await this.generateCodeChallenge(codeVerifier);
        const state = this.generateState();

        // Store PKCE verifier and state for callback
        localStorage.setItem('oauth_code_verifier', codeVerifier);
        localStorage.setItem('oauth_state', state);
        localStorage.setItem('oauth_provider', provider);

        // Stack Auth OAuth URL format with PKCE
        const authUrl = new URL(`https://api.stack-auth.com/api/v1/auth/oauth/authorize/${provider}`);

        authUrl.searchParams.set('client_id', this.config.publishableKey);
        authUrl.searchParams.set('redirect_uri', callbackUrl);
        authUrl.searchParams.set('response_type', 'code');
        authUrl.searchParams.set('scope', 'openid profile email');
        authUrl.searchParams.set('state', state);
        authUrl.searchParams.set('code_challenge', codeChallenge);
        authUrl.searchParams.set('code_challenge_method', 'S256');

        window.location.href = authUrl.toString();
    },

    /**
     * Generate random state for OAuth
     */
    generateState() {
        const array = new Uint8Array(16);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    },

    /**
     * Generate PKCE code verifier
     */
    generateCodeVerifier() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return this.base64URLEncode(array);
    },

    /**
     * Generate PKCE code challenge from verifier
     */
    async generateCodeChallenge(verifier) {
        const encoder = new TextEncoder();
        const data = encoder.encode(verifier);
        const hash = await crypto.subtle.digest('SHA-256', data);
        return this.base64URLEncode(new Uint8Array(hash));
    },

    /**
     * Base64 URL encode
     */
    base64URLEncode(buffer) {
        const base64 = btoa(String.fromCharCode(...buffer));
        return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    },

    /**
     * Login with GitHub
     */
    loginWithGitHub() {
        this.loginWithOAuth('github');
    },

    /**
     * Login with Google
     */
    loginWithGoogle() {
        this.loginWithOAuth('google');
    },

    /**
     * Handle OAuth callback with improved error handling
     */
    async handleOAuthCallback() {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');
        const errorDescription = urlParams.get('error_description');
        const state = urlParams.get('state');

        // Get UI elements
        const loadingEl = document.getElementById('authLoading');
        const errorEl = document.getElementById('authError');
        const successEl = document.getElementById('authSuccess');

        // Handle OAuth error from provider
        if (error) {
            console.error('OAuth error:', error, errorDescription);
            if (loadingEl) loadingEl.classList.add('hidden');
            if (errorEl) {
                errorEl.classList.remove('hidden');
                const errorMsgEl = errorEl.querySelector('.error-message');
                if (errorMsgEl) {
                    errorMsgEl.textContent = this.getFriendlyOAuthError(error, errorDescription);
                }
            }
            return;
        }

        // No code means not a callback - just return
        if (!code) {
            return;
        }

        // Verify state to prevent CSRF
        const storedState = localStorage.getItem('oauth_state');
        if (state && storedState && state !== storedState) {
            console.error('State mismatch - possible CSRF attack');
            if (loadingEl) loadingEl.classList.add('hidden');
            if (errorEl) {
                errorEl.classList.remove('hidden');
                const errorMsgEl = errorEl.querySelector('.error-message');
                if (errorMsgEl) {
                    errorMsgEl.textContent = 'Security validation failed. Please try signing in again.';
                }
            }
            return;
        }
        localStorage.removeItem('oauth_state');
        localStorage.removeItem('oauth_provider');

        // Ensure config is loaded before token exchange
        if (!this.configLoaded) {
            await this.loadConfig();
        }

        const configValidation = this.validateConfig();
        if (!configValidation.valid) {
            if (loadingEl) loadingEl.classList.add('hidden');
            if (errorEl) {
                errorEl.classList.remove('hidden');
                const errorMsgEl = errorEl.querySelector('.error-message');
                if (errorMsgEl) {
                    errorMsgEl.textContent = configValidation.error;
                }
            }
            return;
        }

        try {
            // Get stored PKCE code verifier
            const codeVerifier = localStorage.getItem('oauth_code_verifier');
            localStorage.removeItem('oauth_code_verifier');

            // Exchange code for tokens with PKCE
            const response = await fetch(`${this.config.apiUrl}/auth/oauth/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-stack-project-id': this.config.projectId,
                    'x-stack-publishable-client-key': this.config.publishableKey
                },
                body: JSON.stringify({
                    grant_type: 'authorization_code',
                    code: code,
                    redirect_uri: `${window.location.origin}/auth-callback.html`,
                    code_verifier: codeVerifier
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Token exchange failed (${response.status})`);
            }

            const tokens = await response.json();

            // Store tokens
            localStorage.setItem('stack_access_token', tokens.access_token);
            if (tokens.refresh_token) {
                localStorage.setItem('stack_refresh_token', tokens.refresh_token);
            }

            this.accessToken = tokens.access_token;
            this.refreshToken = tokens.refresh_token;

            // Sync user with our backend
            await this.syncUser();

            // Show success
            if (loadingEl) loadingEl.classList.add('hidden');
            if (successEl) successEl.classList.remove('hidden');

            // Get intended URL for post-login redirect
            const intendedUrl = sessionStorage.getItem('intended_url') || '/dashboard.html';
            sessionStorage.removeItem('intended_url');

            // Redirect after short delay
            setTimeout(() => {
                window.location.href = intendedUrl;
            }, 1500);
        } catch (error) {
            console.error('OAuth callback error:', error);
            if (loadingEl) loadingEl.classList.add('hidden');
            if (errorEl) {
                errorEl.classList.remove('hidden');
                const errorMsgEl = errorEl.querySelector('.error-message');
                if (errorMsgEl) {
                    errorMsgEl.textContent = 'Authentication failed. Please try again.';
                }
            }
        }
    },

    /**
     * Sync user with backend after login
     */
    async syncUser() {
        try {
            const response = await fetch('/api/auth/sync', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-stack-access-token': this.accessToken
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.user = data.user;
            }
        } catch (error) {
            console.error('User sync failed:', error);
        }
    },

    /**
     * Refresh access token
     */
    async refreshAccessToken(refreshToken) {
        try {
            const response = await fetch(`${this.config.apiUrl}/auth/oauth/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-stack-project-id': this.config.projectId,
                    'x-stack-publishable-client-key': this.config.publishableKey
                },
                body: JSON.stringify({
                    grant_type: 'refresh_token',
                    refresh_token: refreshToken
                })
            });

            if (!response.ok) {
                throw new Error('Token refresh failed');
            }

            const tokens = await response.json();

            localStorage.setItem('stack_access_token', tokens.access_token);
            if (tokens.refresh_token) {
                localStorage.setItem('stack_refresh_token', tokens.refresh_token);
            }

            this.accessToken = tokens.access_token;
            this.refreshToken = tokens.refresh_token;
            await this.checkSession();
        } catch (error) {
            console.error('Token refresh failed:', error);
            this.clearSession();
        }
    },

    /**
     * Logout
     */
    logout() {
        this.clearSession();
        this.updateUI();
        window.location.href = '/';
    },

    /**
     * Clear session data
     */
    clearSession() {
        localStorage.removeItem('stack_access_token');
        localStorage.removeItem('stack_refresh_token');
        localStorage.removeItem('oauth_state');
        localStorage.removeItem('oauth_provider');
        localStorage.removeItem('oauth_code_verifier');
        this.user = null;
        this.accessToken = null;
        this.refreshToken = null;
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return this.user !== null && this.accessToken !== null;
    },

    /**
     * Get authorization headers for API calls
     */
    getAuthHeaders() {
        if (!this.accessToken) {
            return {};
        }
        return {
            'x-stack-access-token': this.accessToken
        };
    },

    /**
     * Update UI based on auth state - with event dispatch
     */
    updateUI() {
        const authRequired = document.querySelectorAll('[data-auth-required]');
        const guestOnly = document.querySelectorAll('[data-guest-only]');
        const userInfo = document.querySelectorAll('[data-user-info]');

        if (this.isAuthenticated()) {
            // Show user info
            userInfo.forEach(el => {
                const field = el.dataset.userInfo;
                if (field === 'name') el.textContent = this.user.displayName || this.user.email?.split('@')[0] || 'User';
                if (field === 'email') el.textContent = this.user.email || '';
                if (field === 'avatar' && el.tagName === 'IMG') {
                    el.src = this.user.avatarUrl || '/assets/images/default-avatar.svg';
                    el.alt = `${this.user.displayName || 'User'}'s avatar`;
                }
            });

            // Show auth-required elements
            authRequired.forEach(el => el.classList.remove('hidden'));

            // Hide guest-only elements
            guestOnly.forEach(el => el.classList.add('hidden'));
        } else {
            // Hide auth-required elements
            authRequired.forEach(el => el.classList.add('hidden'));

            // Show guest-only elements
            guestOnly.forEach(el => el.classList.remove('hidden'));
        }

        // Dispatch event for other components (like Navigation)
        window.dispatchEvent(new CustomEvent('authStateChanged', {
            detail: { isAuthenticated: this.isAuthenticated(), user: this.user }
        }));
    }
};

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Auth.init());
} else {
    Auth.init();
}

// Make Auth available globally
window.Auth = Auth;
