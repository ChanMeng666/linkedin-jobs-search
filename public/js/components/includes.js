/**
 * HTML Includes System
 * Dynamically loads navigation and footer components to reduce code duplication
 */

const Includes = {
    /**
     * Load all HTML includes on the page
     */
    async loadAll() {
        const includes = document.querySelectorAll('[data-include]');

        const loadPromises = Array.from(includes).map(async (element) => {
            const componentName = element.getAttribute('data-include');
            try {
                await this.loadComponent(element, componentName);
            } catch (error) {
                console.error(`Failed to load component: ${componentName}`, error);
            }
        });

        await Promise.all(loadPromises);

        // Initialize navigation after components are loaded
        if (typeof Navigation !== 'undefined') {
            Navigation.init();
        }

        // Update current year in footer
        this.updateFooterYear();
    },

    /**
     * Load a single component into an element
     */
    async loadComponent(element, componentName) {
        const response = await fetch(`/components/${componentName}.html`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const html = await response.text();
        element.innerHTML = html;

        // Mark as loaded
        element.setAttribute('data-loaded', 'true');
    },

    /**
     * Update footer copyright year
     */
    updateFooterYear() {
        const yearElement = document.getElementById('currentYear');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    Includes.loadAll();
});
