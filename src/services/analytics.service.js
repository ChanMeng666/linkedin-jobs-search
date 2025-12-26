/**
 * Analytics Service
 * Market analysis and data insights
 */

const logger = require('../utils/logger');

class AnalyticsService {
    /**
     * Analyze salary distribution
     */
    analyzeSalaries(jobs) {
        const salaryJobs = jobs.filter(job => job.salary && job.salary !== 'Not specified');

        if (salaryJobs.length === 0) {
            return { available: false, message: 'No salary data available' };
        }

        // Parse salary strings and extract numeric values
        const salaries = salaryJobs
            .map(job => this.parseSalary(job.salary))
            .filter(s => s !== null);

        if (salaries.length === 0) {
            return { available: false, message: 'Could not parse salary data' };
        }

        const min = Math.min(...salaries);
        const max = Math.max(...salaries);
        const avg = Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length);
        const median = this.calculateMedian(salaries);

        // Distribution buckets
        const distribution = this.createSalaryDistribution(salaries);

        return {
            available: true,
            count: salaries.length,
            min,
            max,
            avg,
            median,
            distribution
        };
    }

    /**
     * Parse salary string to numeric value
     */
    parseSalary(salaryString) {
        if (!salaryString) return null;

        // Handle various formats: "$80,000", "$80K", "80000", "$80,000 - $120,000"
        const matches = salaryString.match(/\$?([\d,]+)\s*(?:K|k)?/g);
        if (!matches || matches.length === 0) return null;

        const values = matches.map(m => {
            let num = parseInt(m.replace(/[$,]/g, ''));
            if (m.toLowerCase().includes('k')) {
                num *= 1000;
            }
            return num;
        }).filter(n => !isNaN(n) && n > 0);

        if (values.length === 0) return null;

        // Return average if range, otherwise the single value
        return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
    }

    /**
     * Calculate median
     */
    calculateMedian(values) {
        const sorted = [...values].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);

        if (sorted.length % 2 === 0) {
            return Math.round((sorted[mid - 1] + sorted[mid]) / 2);
        }
        return sorted[mid];
    }

    /**
     * Create salary distribution buckets
     */
    createSalaryDistribution(salaries) {
        const buckets = {
            '0-40k': 0,
            '40k-60k': 0,
            '60k-80k': 0,
            '80k-100k': 0,
            '100k-120k': 0,
            '120k-150k': 0,
            '150k+': 0
        };

        salaries.forEach(salary => {
            if (salary < 40000) buckets['0-40k']++;
            else if (salary < 60000) buckets['40k-60k']++;
            else if (salary < 80000) buckets['60k-80k']++;
            else if (salary < 100000) buckets['80k-100k']++;
            else if (salary < 120000) buckets['100k-120k']++;
            else if (salary < 150000) buckets['120k-150k']++;
            else buckets['150k+']++;
        });

        return buckets;
    }

    /**
     * Extract skills from job titles and descriptions
     */
    extractSkills(jobs) {
        const skillPatterns = [
            'javascript', 'typescript', 'python', 'java', 'react', 'angular', 'vue',
            'node.js', 'nodejs', 'express', 'django', 'flask', 'spring', 'aws',
            'azure', 'gcp', 'docker', 'kubernetes', 'sql', 'mongodb', 'postgresql',
            'redis', 'graphql', 'rest', 'api', 'agile', 'scrum', 'git', 'ci/cd',
            'machine learning', 'ai', 'data science', 'devops', 'cloud', 'microservices',
            'c++', 'c#', '.net', 'go', 'golang', 'rust', 'ruby', 'rails', 'php',
            'swift', 'kotlin', 'flutter', 'react native', 'ios', 'android',
            'html', 'css', 'sass', 'webpack', 'linux', 'unix', 'terraform',
            'jenkins', 'gitlab', 'jira', 'confluence', 'figma', 'design',
            'product management', 'project management', 'leadership', 'communication',
            'problem solving', 'analytical', 'teamwork', 'collaboration'
        ];

        const skillCounts = {};

        jobs.forEach(job => {
            const text = `${job.position} ${job.company}`.toLowerCase();
            skillPatterns.forEach(skill => {
                if (text.includes(skill.toLowerCase())) {
                    skillCounts[skill] = (skillCounts[skill] || 0) + 1;
                }
            });
        });

        // Sort by frequency and return top skills
        return Object.entries(skillCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 20)
            .map(([skill, count]) => ({
                skill: skill.charAt(0).toUpperCase() + skill.slice(1),
                count,
                percentage: Math.round((count / jobs.length) * 100)
            }));
    }

    /**
     * Analyze jobs by location
     */
    analyzeLocations(jobs) {
        const locationCounts = {};

        jobs.forEach(job => {
            if (job.location) {
                // Normalize location (extract city or first part)
                const location = job.location.split(',')[0].trim();
                if (location && location.toLowerCase() !== 'remote') {
                    locationCounts[location] = (locationCounts[location] || 0) + 1;
                }
            }
        });

        return Object.entries(locationCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 15)
            .map(([location, count]) => ({
                location,
                count,
                percentage: Math.round((count / jobs.length) * 100)
            }));
    }

    /**
     * Analyze job types
     */
    analyzeJobTypes(jobs) {
        const typeCounts = {};

        jobs.forEach(job => {
            const type = job.jobType || 'Not specified';
            typeCounts[type] = (typeCounts[type] || 0) + 1;
        });

        return Object.entries(typeCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([type, count]) => ({
                type,
                count,
                percentage: Math.round((count / jobs.length) * 100)
            }));
    }

    /**
     * Analyze experience levels
     */
    analyzeExperienceLevels(jobs) {
        const levelCounts = {
            'Entry Level': 0,
            'Mid Level': 0,
            'Senior': 0,
            'Director+': 0,
            'Not specified': 0
        };

        const patterns = {
            'Entry Level': /\b(entry|junior|jr|graduate|trainee|intern)\b/i,
            'Mid Level': /\b(mid|middle|intermediate|2-5\s*years?|3-5\s*years?)\b/i,
            'Senior': /\b(senior|sr|lead|principal|staff|5\+\s*years?|7\+\s*years?)\b/i,
            'Director+': /\b(director|vp|head|chief|executive|manager)\b/i
        };

        jobs.forEach(job => {
            const text = job.position.toLowerCase();
            let matched = false;

            for (const [level, pattern] of Object.entries(patterns)) {
                if (pattern.test(text)) {
                    levelCounts[level]++;
                    matched = true;
                    break;
                }
            }

            if (!matched) {
                levelCounts['Not specified']++;
            }
        });

        return Object.entries(levelCounts)
            .filter(([, count]) => count > 0)
            .map(([level, count]) => ({
                level,
                count,
                percentage: Math.round((count / jobs.length) * 100)
            }));
    }

    /**
     * Analyze remote vs on-site
     */
    analyzeRemoteWork(jobs) {
        const remoteCounts = {
            'Remote': 0,
            'Hybrid': 0,
            'On-site': 0,
            'Not specified': 0
        };

        jobs.forEach(job => {
            const text = `${job.position} ${job.location || ''}`.toLowerCase();

            if (text.includes('remote') || text.includes('work from home') || text.includes('wfh')) {
                remoteCounts['Remote']++;
            } else if (text.includes('hybrid')) {
                remoteCounts['Hybrid']++;
            } else if (text.includes('on-site') || text.includes('onsite') || text.includes('in-office')) {
                remoteCounts['On-site']++;
            } else {
                remoteCounts['Not specified']++;
            }
        });

        return Object.entries(remoteCounts)
            .filter(([, count]) => count > 0)
            .map(([type, count]) => ({
                type,
                count,
                percentage: Math.round((count / jobs.length) * 100)
            }));
    }

    /**
     * Get comprehensive analytics
     */
    getComprehensiveAnalytics(jobs) {
        if (!jobs || jobs.length === 0) {
            return {
                success: false,
                error: 'No jobs data provided'
            };
        }

        return {
            success: true,
            totalJobs: jobs.length,
            salary: this.analyzeSalaries(jobs),
            skills: this.extractSkills(jobs),
            locations: this.analyzeLocations(jobs),
            jobTypes: this.analyzeJobTypes(jobs),
            experienceLevels: this.analyzeExperienceLevels(jobs),
            remoteWork: this.analyzeRemoteWork(jobs),
            generatedAt: new Date().toISOString()
        };
    }
}

module.exports = new AnalyticsService();
