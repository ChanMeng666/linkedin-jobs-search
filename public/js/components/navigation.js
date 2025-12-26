/**
 * Navigation Component
 * Handles mobile menu, scroll effects, active link highlighting, and user dropdown
 */

class Navigation {
  constructor() {
    this.nav = document.querySelector('.main-nav');
    this.mobileToggle = document.querySelector('.mobile-menu-toggle');
    this.mobileMenu = document.querySelector('.mobile-menu');
    this.navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    this.scrollThreshold = 50;

    // User dropdown elements
    this.userTrigger = document.getElementById('navUserTrigger');
    this.dropdownMenu = document.getElementById('navDropdownMenu');
    this.isDropdownOpen = false;

    this.init();
  }

  init() {
    this.setupScrollEffect();
    this.setupMobileMenu();
    this.highlightActiveLink();
    this.setupSmoothScroll();
    this.setupUserDropdown();
    this.setupAuthStateListener();
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
    if (icon) {
      icon.innerHTML = `
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
      `;
    }

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
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
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

  /**
   * Setup user dropdown menu
   */
  setupUserDropdown() {
    if (!this.userTrigger || !this.dropdownMenu) return;

    // Toggle dropdown on click
    this.userTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleDropdown();
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isDropdownOpen &&
          !this.dropdownMenu.contains(e.target) &&
          !this.userTrigger.contains(e.target)) {
        this.closeDropdown();
      }
    });

    // Keyboard navigation
    this.userTrigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggleDropdown();
      } else if (e.key === 'Escape') {
        this.closeDropdown();
      } else if (e.key === 'ArrowDown' && this.isDropdownOpen) {
        e.preventDefault();
        this.focusFirstMenuItem();
      }
    });

    // Setup keyboard navigation within dropdown
    this.dropdownMenu.addEventListener('keydown', (e) => {
      const items = this.dropdownMenu.querySelectorAll('.nav-dropdown-item');
      const currentIndex = Array.from(items).indexOf(document.activeElement);

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        items[nextIndex].focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        items[prevIndex].focus();
      } else if (e.key === 'Escape') {
        this.closeDropdown();
        this.userTrigger.focus();
      }
    });
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    this.dropdownMenu.classList.toggle('active', this.isDropdownOpen);
    this.userTrigger.setAttribute('aria-expanded', this.isDropdownOpen);

    // Rotate chevron
    const chevron = this.userTrigger.querySelector('.nav-dropdown-chevron');
    if (chevron) {
      chevron.style.transform = this.isDropdownOpen ? 'rotate(180deg)' : 'rotate(0)';
    }
  }

  closeDropdown() {
    this.isDropdownOpen = false;
    this.dropdownMenu.classList.remove('active');
    this.userTrigger.setAttribute('aria-expanded', 'false');

    // Reset chevron
    const chevron = this.userTrigger.querySelector('.nav-dropdown-chevron');
    if (chevron) {
      chevron.style.transform = 'rotate(0)';
    }
  }

  focusFirstMenuItem() {
    const firstItem = this.dropdownMenu.querySelector('.nav-dropdown-item');
    if (firstItem) {
      firstItem.focus();
    }
  }

  /**
   * Listen for auth state changes
   */
  setupAuthStateListener() {
    window.addEventListener('authStateChanged', (e) => {
      this.updateAuthUI(e.detail);
    });

    // Initial check if Auth is available
    if (typeof Auth !== 'undefined' && Auth.isInitialized) {
      this.updateAuthUI({
        isAuthenticated: Auth.isAuthenticated(),
        user: Auth.user
      });
    }
  }

  /**
   * Update navigation UI based on auth state
   */
  updateAuthUI(authState) {
    const authRequired = document.querySelectorAll('[data-auth-required]');
    const guestOnly = document.querySelectorAll('[data-guest-only]');
    const userInfoElements = document.querySelectorAll('[data-user-info]');

    if (authState.isAuthenticated && authState.user) {
      // Show auth-required elements
      authRequired.forEach(el => el.classList.remove('hidden'));
      // Hide guest-only elements
      guestOnly.forEach(el => el.classList.add('hidden'));

      // Update user info
      userInfoElements.forEach(el => {
        const field = el.dataset.userInfo;
        if (field === 'name') {
          el.textContent = authState.user.displayName || authState.user.email?.split('@')[0] || 'User';
        } else if (field === 'email') {
          el.textContent = authState.user.email || '';
        } else if (field === 'avatar' && el.tagName === 'IMG') {
          el.src = authState.user.avatarUrl || '/assets/images/default-avatar.svg';
          el.alt = `${authState.user.displayName || 'User'}'s avatar`;
        }
      });
    } else {
      // Hide auth-required elements
      authRequired.forEach(el => el.classList.add('hidden'));
      // Show guest-only elements
      guestOnly.forEach(el => el.classList.remove('hidden'));
    }
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
