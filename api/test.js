/**
 * Minimal test endpoint - no dependencies
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
        nodeModulesExists: false
    };

    // Check if node_modules exists
    try {
        const nodeModulesPath = path.join(process.cwd(), 'node_modules');
        diagnostics.nodeModulesExists = fs.existsSync(nodeModulesPath);

        if (diagnostics.nodeModulesExists) {
            const modules = fs.readdirSync(nodeModulesPath).slice(0, 20);
            diagnostics.files.node_modules_sample = modules;
        }
    } catch (e) {
        diagnostics.files.node_modules_error = e.message;
    }

    // Check package.json
    try {
        const pkgPath = path.join(process.cwd(), 'package.json');
        if (fs.existsSync(pkgPath)) {
            const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
            diagnostics.files.package_json = {
                name: pkg.name,
                dependencies: Object.keys(pkg.dependencies || {})
            };
        }
    } catch (e) {
        diagnostics.files.package_json_error = e.message;
    }

    // List files in current directory
    try {
        diagnostics.files.cwd_contents = fs.readdirSync(process.cwd());
    } catch (e) {
        diagnostics.files.cwd_error = e.message;
    }

    // List files in /var/task
    try {
        diagnostics.files.var_task = fs.readdirSync('/var/task');
    } catch (e) {
        diagnostics.files.var_task_error = e.message;
    }

    res.status(200).json(diagnostics);
};
