/**
 * Data Formatters
 * Helper functions for data formatting and display
 */

const Formatters = {
    /**
     * Format search parameters for display
     */
    formatSearchParams(params) {
        return Object.entries(params)
            .map(([key, value]) => {
                const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                return `<div><span class="font-semibold">${label}:</span> ${value}</div>`;
            })
            .join('');
    },

    /**
     * Escape HTML to prevent XSS
     */
    escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    /**
     * Truncate text to specified length
     */
    truncate(text, length = 100) {
        if (!text) return '';
        return text.length > length ? text.substring(0, length) + '...' : text;
    }
};
