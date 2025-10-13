/**
 * Navigation Component
 * Handles mobile menu, scroll effects, and active link highlighting
 */

class Navigation {
  constructor() {
    this.nav = document.querySelector('.main-nav');
    this.mobileToggle = document.querySelector('.mobile-menu-toggle');
    this.mobileMenu = document.querySelector('.mobile-menu');
    this.navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    this.scrollThreshold = 50;

    this.init();
  }

  init() {
    this.setupScrollEffect();
    this.setupMobileMenu();
    this.highlightActiveLink();
    this.setupSmoothScroll();
  }

  /**
   * Add scroll effect to navigation
   */
  setupScrollEffect() {
    if (!this.nav) return;

    const handleScroll = () => {
      if (window.scrollY > this.scrollThreshold) {
        this.nav.classList.add('scrolled');
      } else {
        this.nav.classList.remove('scrolled');
      }
    };

    // Throttle scroll event for better performance
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
      }
      scrollTimeout = window.requestAnimationFrame(() => {
        handleScroll();
      });
    }, { passive: true });

    // Initial check
    handleScroll();
  }

  /**
   * Setup mobile menu toggle
   */
  setupMobileMenu() {
    if (!this.mobileToggle || !this.mobileMenu) return;

    // Toggle mobile menu
    this.mobileToggle.addEventListener('click', () => {
      this.toggleMobileMenu();
    });

    // Close menu when clicking links
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.closeMobileMenu();
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.mobileMenu.classList.contains('active') &&
          !this.mobileMenu.contains(e.target) &&
          !this.mobileToggle.contains(e.target)) {
        this.closeMobileMenu();
      }
    });

    // Close menu on resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024) {
        this.closeMobileMenu();
      }
    });
  }

  toggleMobileMenu() {
    this.mobileMenu.classList.toggle('active');

    // Update button icon
    const icon = this.mobileToggle.querySelector('svg');
    if (this.mobileMenu.classList.contains('active')) {
      icon.innerHTML = `
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
      `;
    } else {
      icon.innerHTML = `
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
      `;
    }

    // Prevent body scroll when menu is open
    document.body.style.overflow = this.mobileMenu.classList.contains('active') ? 'hidden' : '';
  }

  closeMobileMenu() {
    this.mobileMenu.classList.remove('active');

    // Reset button icon
    const icon = this.mobileToggle.querySelector('svg');
    icon.innerHTML = `
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
    `;

    // Restore body scroll
    document.body.style.overflow = '';
  }

  /**
   * Highlight active navigation link based on current page
   */
  highlightActiveLink() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';

    this.navLinks.forEach(link => {
      const linkPath = link.getAttribute('href');

      if (linkPath === currentPage ||
          (currentPage === '' && linkPath === 'index.html') ||
          (currentPage === '/' && linkPath === 'index.html')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  /**
   * Setup smooth scrolling for anchor links
   */
  setupSmoothScroll() {
    this.navLinks.forEach(link => {
      if (link.getAttribute('href').startsWith('#')) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = link.getAttribute('href');
          const targetElement = document.querySelector(targetId);

          if (targetElement) {
            const offsetTop = targetElement.offsetTop - 80; // Account for fixed nav
            window.scrollTo({
              top: offsetTop,
              behavior: 'smooth'
            });
          }
        });
      }
    });
  }
}

// Initialize navigation when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new Navigation();
  });
} else {
  new Navigation();
}

// Export for module usage (optional)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Navigation;
}
