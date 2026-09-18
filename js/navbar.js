/* ============================================
   NAVBAR CONTROLLER
   Scroll spy, background change, mobile toggle
============================================ */

class NavbarController {
  constructor() {
    this.navbar = document.getElementById('navbar');
    this.links = document.getElementById('nav-links');
    this.hamburger = document.getElementById('hamburger');
    this.navAnchors = document.querySelectorAll('.navbar__link');

    if (!this.navbar || !this.hamburger) return;

    this.sections = [];
    this.isMenuOpen = false;

    this._init();
  }

  _init() {
    this._cacheSections();
    this._bindEvents();
  }

  /* ---- Cache section elements for scroll spy ---- */
  _cacheSections() {
    this.navAnchors.forEach((anchor) => {
      const sectionId = anchor.getAttribute('href').slice(1);
      const section = document.getElementById(sectionId);
      if (section) {
        this.sections.push({ id: sectionId, element: section, anchor });
      }
    });
  }

  /* ---- Bind all events ---- */
  _bindEvents() {
    // Scroll: navbar background + active link
    window.addEventListener('scroll', () => this._onScroll(), { passive: true });

    // Hamburger toggle
    this.hamburger.addEventListener('click', () => this._toggleMenu());

    // Close menu on link click
    this.navAnchors.forEach((anchor) => {
      anchor.addEventListener('click', () => {
        if (this.isMenuOpen) this._toggleMenu();
      });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
      if (this.isMenuOpen && !this.links.contains(e.target) && !this.hamburger.contains(e.target)) {
        this._toggleMenu();
      }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMenuOpen) {
        this._toggleMenu();
      }
    });
  }

  /* ---- Scroll handler ---- */
  _onScroll() {
    const scrollY = window.scrollY;

    // Toggle navbar background
    if (scrollY > 50) {
      this.navbar.classList.add('navbar--scrolled');
    } else {
      this.navbar.classList.remove('navbar--scrolled');
    }

    // Update active link
    this._updateActiveLink();
  }

  /* ---- Scroll spy: highlight current section ---- */
  _updateActiveLink() {
    const navbarHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height')) || 70;
    let currentSection = null;

    for (const section of this.sections) {
      const rect = section.element.getBoundingClientRect();
      if (rect.top <= navbarHeight + 100) {
        currentSection = section;
      }
    }

    this.navAnchors.forEach((anchor) => anchor.classList.remove('navbar__link--active'));

    if (currentSection) {
      currentSection.anchor.classList.add('navbar__link--active');
    }
  }

  /* ---- Toggle mobile menu ---- */
  _toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;

    this.hamburger.classList.toggle('navbar__hamburger--active');
    this.links.classList.toggle('navbar__links--open');
    this.hamburger.setAttribute('aria-expanded', this.isMenuOpen);

    // Prevent body scroll when menu is open
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
  }
}

// Export for use in main.js
window.NavbarController = NavbarController;
