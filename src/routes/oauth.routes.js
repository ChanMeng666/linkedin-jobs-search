/**
 * OAuth Routes
 * Server-side OAuth initiation for Stack Auth
 */

const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { STACK_AUTH_CONFIG } = require('../config');

/**
 * Generate PKCE code verifier and challenge
 */
function generatePKCE() {
    const verifier = crypto.randomBytes(32).toString('base64url');
    const challenge = crypto.createHash('sha256').update(verifier).digest('base64url');
    return { verifier, challenge };
}

/**
 * Initiate OAuth flow
 * GET /api/oauth/signin/:provider
 */
router.get('/signin/:provider', async (req, res) => {
    const { provider } = req.params;
    const { redirect_url } = req.query;

    if (!['google', 'github'].includes(provider)) {
        return res.status(400).json({ error: 'Invalid provider' });
    }

    try {
        const callbackUrl = `${req.protocol}://${req.get('host')}/api/oauth/callback`;
        const pkce = generatePKCE();
        const state = crypto.randomBytes(16).toString('hex');

        // Store PKCE verifier and state in a short-lived way (using query params for simplicity)
        // In production, use Redis or database
        const stateData = Buffer.from(JSON.stringify({
            verifier: pkce.verifier,
            provider,
            redirect_url: redirect_url || '/dashboard.html'
        })).toString('base64url');

        // Call Stack Auth to initiate OAuth
        const response = await fetch(`${STACK_AUTH_CONFIG.apiUrl}/auth/oauth/authorize/${provider}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-stack-project-id': STACK_AUTH_CONFIG.projectId,
                'x-stack-publishable-client-key': STACK_AUTH_CONFIG.publishableKey,
                'x-stack-secret-server-key': STACK_AUTH_CONFIG.secretKey
            },
            body: JSON.stringify({
                redirect_uri: callbackUrl,
                state: stateData,
                code_challenge: pkce.challenge,
                code_challenge_method: 'S256'
            })
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            console.error('Stack Auth OAuth init error:', error);

            // Fallback: try direct redirect approach
            const authUrl = new URL(`https://api.stack-auth.com/api/v1/auth/oauth/authorize/${provider}`);
            authUrl.searchParams.set('client_id', STACK_AUTH_CONFIG.publishableKey);
            authUrl.searchParams.set('client_secret', STACK_AUTH_CONFIG.secretKey);
            authUrl.searchParams.set('redirect_uri', callbackUrl);
            authUrl.searchParams.set('response_type', 'code');
            authUrl.searchParams.set('scope', 'openid profile email');
            authUrl.searchParams.set('state', stateData);
            authUrl.searchParams.set('code_challenge', pkce.challenge);
            authUrl.searchParams.set('code_challenge_method', 'S256');
            authUrl.searchParams.set('grant_type', 'authorization_code');

            return res.redirect(authUrl.toString());
        }

        const data = await response.json();
        res.redirect(data.authorization_url || data.url);
    } catch (error) {
        console.error('OAuth initiation error:', error);
        res.redirect(`/login.html?error=${encodeURIComponent('Failed to initiate login')}`);
    }
});

/**
 * OAuth callback handler
 * GET /api/oauth/callback
 */
router.get('/callback', async (req, res) => {
    const { code, state, error, error_description } = req.query;

    if (error) {
        console.error('OAuth callback error:', error, error_description);
        return res.redirect(`/login.html?error=${encodeURIComponent(error_description || error)}`);
    }

    if (!code || !state) {
        return res.redirect('/login.html?error=Missing authorization code');
    }

    try {
        // Decode state to get PKCE verifier and redirect URL
        const stateData = JSON.parse(Buffer.from(state, 'base64url').toString());
        const { verifier, redirect_url } = stateData;

        // Exchange code for tokens
        const tokenResponse = await fetch(`${STACK_AUTH_CONFIG.apiUrl}/auth/oauth/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-stack-project-id': STACK_AUTH_CONFIG.projectId,
                'x-stack-publishable-client-key': STACK_AUTH_CONFIG.publishableKey,
                'x-stack-secret-server-key': STACK_AUTH_CONFIG.secretKey
            },
            body: JSON.stringify({
                grant_type: 'authorization_code',
                code,
                redirect_uri: `${req.protocol}://${req.get('host')}/api/oauth/callback`,
                code_verifier: verifier
            })
        });

        if (!tokenResponse.ok) {
            const tokenError = await tokenResponse.json().catch(() => ({}));
            console.error('Token exchange error:', tokenError);
            return res.redirect(`/login.html?error=${encodeURIComponent('Authentication failed')}`);
        }

        const tokens = await tokenResponse.json();

        // Redirect to frontend with tokens in fragment (more secure than query params)
        const redirectUrl = new URL(redirect_url || '/dashboard.html', `${req.protocol}://${req.get('host')}`);
        redirectUrl.hash = `access_token=${tokens.access_token}&refresh_token=${tokens.refresh_token || ''}`;

        res.redirect(redirectUrl.toString());
    } catch (error) {
        console.error('OAuth callback processing error:', error);
        res.redirect(`/login.html?error=${encodeURIComponent('Authentication failed')}`);
    }
});

module.exports = router;
