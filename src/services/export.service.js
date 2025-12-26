/**
 * Export Service
 * Handles data export to CSV, Excel, and PDF formats
 */

const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const { Parser } = require('json2csv');
const logger = require('../utils/logger');

class ExportService {
    /**
     * Export jobs to CSV format
     */
    async exportToCSV(jobs) {
        try {
            const fields = [
                { label: 'Position', value: 'position' },
                { label: 'Company', value: 'company' },
                { label: 'Location', value: 'location' },
                { label: 'Salary', value: 'salary' },
                { label: 'Posted', value: 'agoTime' },
                { label: 'Job URL', value: 'jobUrl' }
            ];

            const opts = { fields };
            const parser = new Parser(opts);
            return parser.parse(jobs);
        } catch (error) {
            logger.error('CSV export failed', { error: error.message });
            throw error;
        }
    }

    /**
     * Export jobs to Excel format
     */
    async exportToExcel(jobs) {
        try {
            const workbook = new ExcelJS.Workbook();
            workbook.creator = 'LinkedIn Jobs Search';
            workbook.created = new Date();

            const worksheet = workbook.addWorksheet('Job Results');

            // Define columns
            worksheet.columns = [
                { header: 'Position', key: 'position', width: 40 },
                { header: 'Company', key: 'company', width: 30 },
                { header: 'Location', key: 'location', width: 25 },
                { header: 'Salary', key: 'salary', width: 20 },
                { header: 'Posted', key: 'agoTime', width: 15 },
                { header: 'Job Type', key: 'jobType', width: 15 },
                { header: 'Job URL', key: 'jobUrl', width: 60 }
            ];

            // Style header row
            worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
            worksheet.getRow(1).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '0077B5' } // LinkedIn blue
            };
            worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

            // Add data rows
            jobs.forEach((job, index) => {
                worksheet.addRow({
                    position: job.position,
                    company: job.company,
                    location: job.location || 'Not specified',
                    salary: job.salary || 'Not specified',
                    agoTime: job.agoTime || job.date || 'Unknown',
                    jobType: job.jobType || 'Not specified',
                    jobUrl: job.jobUrl
                });

                // Alternate row colors
                if (index % 2 === 1) {
                    worksheet.getRow(index + 2).fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'F5F5F5' }
                    };
                }
            });

            // Add hyperlinks to job URLs
            for (let i = 2; i <= jobs.length + 1; i++) {
                const cell = worksheet.getCell(`G${i}`);
                if (cell.value) {
                    cell.value = {
                        text: 'View Job',
                        hyperlink: cell.value
                    };
                    cell.font = { color: { argb: '0077B5' }, underline: true };
                }
            }

            // Auto-filter
            worksheet.autoFilter = {
                from: 'A1',
                to: `G${jobs.length + 1}`
            };

            return workbook.xlsx.writeBuffer();
        } catch (error) {
            logger.error('Excel export failed', { error: error.message });
            throw error;
        }
    }

    /**
     * Export single job to PDF format
     */
    async exportJobToPDF(job) {
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument({ margin: 50 });
                const chunks = [];

                doc.on('data', chunk => chunks.push(chunk));
                doc.on('end', () => resolve(Buffer.concat(chunks)));
                doc.on('error', reject);

                // Header
                doc.fontSize(24)
                    .fillColor('#0077B5')
                    .text(job.position, { align: 'center' });

                doc.moveDown(0.5);

                doc.fontSize(16)
                    .fillColor('#333333')
                    .text(job.company, { align: 'center' });

                doc.moveDown(2);

                // Divider
                doc.strokeColor('#E0E0E0')
                    .lineWidth(1)
                    .moveTo(50, doc.y)
                    .lineTo(550, doc.y)
                    .stroke();

                doc.moveDown(1.5);

                // Details section
                doc.fontSize(12).fillColor('#666666');

                const details = [
                    { label: 'Location', value: job.location || 'Not specified' },
                    { label: 'Salary', value: job.salary || 'Not specified' },
                    { label: 'Job Type', value: job.jobType || 'Not specified' },
                    { label: 'Posted', value: job.agoTime || job.date || 'Unknown' }
                ];

                details.forEach(detail => {
                    doc.font('Helvetica-Bold')
                        .text(`${detail.label}: `, { continued: true })
                        .font('Helvetica')
                        .text(detail.value);
                    doc.moveDown(0.5);
                });

                doc.moveDown(1.5);

                // Apply Link
                doc.fillColor('#0077B5')
                    .text('Apply on LinkedIn:', { continued: true })
                    .fillColor('#333333')
                    .text(` ${job.jobUrl}`, { link: job.jobUrl });

                doc.moveDown(2);

                // Footer
                doc.fontSize(10)
                    .fillColor('#999999')
                    .text(`Generated by LinkedIn Jobs Search on ${new Date().toLocaleDateString()}`, {
                        align: 'center'
                    });

                doc.end();
            } catch (error) {
                logger.error('PDF export failed', { error: error.message });
                reject(error);
            }
        });
    }

    /**
     * Export saved jobs to Excel (with additional fields)
     */
    async exportSavedJobsToExcel(savedJobs) {
        try {
            const workbook = new ExcelJS.Workbook();
            workbook.creator = 'LinkedIn Jobs Search';
            workbook.created = new Date();

            const worksheet = workbook.addWorksheet('Saved Jobs');

            // Define columns
            worksheet.columns = [
                { header: 'Position', key: 'position', width: 40 },
                { header: 'Company', key: 'company', width: 30 },
                { header: 'Location', key: 'location', width: 25 },
                { header: 'Salary', key: 'salary', width: 20 },
                { header: 'Status', key: 'status', width: 15 },
                { header: 'Notes', key: 'notes', width: 30 },
                { header: 'Saved At', key: 'createdAt', width: 15 },
                { header: 'Applied At', key: 'appliedAt', width: 15 },
                { header: 'Job URL', key: 'jobUrl', width: 60 }
            ];

            // Style header row
            worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
            worksheet.getRow(1).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '0077B5' }
            };

            // Status colors
            const statusColors = {
                saved: 'CCCCCC',
                applied: '4CAF50',
                interviewing: '2196F3',
                offered: 'FF9800',
                rejected: 'F44336'
            };

            // Add data rows
            savedJobs.forEach((job, index) => {
                const row = worksheet.addRow({
                    position: job.position,
                    company: job.company,
                    location: job.location || 'Not specified',
                    salary: job.salary || 'Not specified',
                    status: job.status || 'saved',
                    notes: job.notes || '',
                    createdAt: job.createdAt ? new Date(job.createdAt).toLocaleDateString() : '',
                    appliedAt: job.appliedAt ? new Date(job.appliedAt).toLocaleDateString() : '',
                    jobUrl: job.jobUrl
                });

                // Color status cell
                const statusColor = statusColors[job.status] || statusColors.saved;
                row.getCell('status').fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: statusColor }
                };
                row.getCell('status').font = { color: { argb: 'FFFFFF' } };
            });

            return workbook.xlsx.writeBuffer();
        } catch (error) {
            logger.error('Saved jobs Excel export failed', { error: error.message });
            throw error;
        }
    }
}

module.exports = new ExportService();
