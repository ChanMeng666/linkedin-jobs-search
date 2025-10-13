/**
 * DOM Utilities
 * Helper functions for DOM manipulation
 */

const DOM = {
    /**
     * Get element by ID
     */
    $(id) {
        return document.getElementById(id);
    },

    /**
     * Query selector
     */
    $$(selector) {
        return document.querySelector(selector);
    },

    /**
     * Query selector all
     */
    $$$(selector) {
        return document.querySelectorAll(selector);
    },

    /**
     * Set HTML content
     */
    setHTML(element, html) {
        if (typeof element === 'string') {
            element = this.$(element);
        }
        if (element) {
            element.innerHTML = html;
        }
    },

    /**
     * Add class
     */
    addClass(element, className) {
        if (typeof element === 'string') {
            element = this.$(element);
        }
        if (element) {
            element.classList.add(className);
        }
    },

    /**
     * Remove class
     */
    removeClass(element, className) {
        if (typeof element === 'string') {
            element = this.$(element);
        }
        if (element) {
            element.classList.remove(className);
        }
    },

    /**
     * Toggle class
     */
    toggleClass(element, className) {
        if (typeof element === 'string') {
            element = this.$(element);
        }
        if (element) {
            element.classList.toggle(className);
        }
    },

    /**
     * Show element
     */
    show(element) {
        this.removeClass(element, 'hidden');
    },

    /**
     * Hide element
     */
    hide(element) {
        this.addClass(element, 'hidden');
    }
};
