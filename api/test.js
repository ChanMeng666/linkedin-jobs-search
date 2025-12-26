/**
 * Diagnostic test endpoint
 */

const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
    const diagnostics = {
        timestamp: new Date().toISOString(),
        nodeVersion: process.version,
        cwd: process.cwd(),
        dirname: __dirname,
        env: {
            NODE_ENV: process.env.NODE_ENV,
            hasDatabase: !!process.env.DATABASE_URL,
            hasStackProjectId: !!process.env.NEXT_PUBLIC_STACK_PROJECT_ID,
            hasStackPublishableKey: !!process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY,
            hasStackSecretKey: !!process.env.STACK_SECRET_SERVER_KEY
        },
        files: {},
        modules: {}
    };

    // Check directory structure
    try {
        diagnostics.files.cwd_contents = fs.readdirSync(process.cwd());

        // Check for src directory
        const srcPath = path.join(process.cwd(), 'src');
        if (fs.existsSync(srcPath)) {
            diagnostics.files.src_contents = fs.readdirSync(srcPath);
        }

        // Check for node_modules
        const nodeModulesPath = path.join(process.cwd(), 'node_modules');
        diagnostics.nodeModulesExists = fs.existsSync(nodeModulesPath);
        if (diagnostics.nodeModulesExists) {
            diagnostics.files.node_modules_sample = fs.readdirSync(nodeModulesPath).slice(0, 15);
        }
    } catch (e) {
        diagnostics.files.error = e.message;
    }

    // Test module loading
    const testModules = ['express', 'cors', 'dotenv'];
    for (const mod of testModules) {
        try {
            require(mod);
            diagnostics.modules[mod] = 'OK';
        } catch (e) {
            diagnostics.modules[mod] = e.message;
        }
    }

    // Test app loading
    try {
        require('../src/app');
        diagnostics.modules['src/app'] = 'OK';
    } catch (e) {
        diagnostics.modules['src/app'] = e.message;
    }

    res.status(200).json(diagnostics);
};
