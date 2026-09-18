/* ============================================
   GSAP ANIMATIONS
   ScrollTrigger-driven animations for all sections
============================================ */

class AnimationController {
  constructor() {
    this.isReady = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';

    if (this.isReady) {
      gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
      this._init();
    }
  }

  _init() {
    this._heroAnimations();
    this._aboutAnimations();
    this._skillBarAnimations();
    this._projectAnimations();
    this._contactAnimations();
    this._smoothScrollLinks();
  }

  /* ---- Hero entrance ---- */
  _heroAnimations() {
    const heroContent = document.querySelector('.hero__content');
    if (!heroContent) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from('.hero__greeting', {
      opacity: 0,
      y: 30,
      duration: 0.8,
    })
    .from('.hero__name', {
      opacity: 0,
      y: 40,
      duration: 1,
    }, '-=0.4')
    .from('.hero__title', {
      opacity: 0,
      y: 30,
      duration: 0.8,
    }, '-=0.5')
    .from('.hero__tagline', {
      opacity: 0,
      y: 20,
      duration: 0.8,
    }, '-=0.4')
    .from('.hero__cta .btn', {
      opacity: 0,
      y: 20,
      stagger: 0.15,
      duration: 0.6,
    }, '-=0.3')
    .from('.hero__scroll-indicator', {
      opacity: 0,
      y: 10,
      duration: 0.6,
    }, '-=0.2');

    // Parallax on hero content as user scrolls down
    gsap.to('.hero__content', {
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
      y: -100,
      opacity: 0,
    });
  }

  /* ---- About section ---- */
  _aboutAnimations() {
    // Heading
    gsap.from('#about-heading', {
      scrollTrigger: {
        trigger: '#about-heading',
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      x: -40,
      duration: 0.8,
      ease: 'power3.out',
    });

    // Text paragraphs — staggered
    gsap.from('.about__text p', {
      scrollTrigger: {
        trigger: '.about__text',
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 30,
      stagger: 0.2,
      duration: 0.8,
      ease: 'power3.out',
    });

    // Quick facts
    gsap.from('.fact', {
      scrollTrigger: {
        trigger: '.about__quick-facts',
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 20,
      scale: 0.9,
      stagger: 0.1,
      duration: 0.6,
      ease: 'back.out(1.7)',
    });

    // Image — slide in from right
    gsap.from('.about__image-wrapper', {
      scrollTrigger: {
        trigger: '.about__image',
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      x: 60,
      rotation: 5,
      duration: 1,
      ease: 'power3.out',
    });
  }

  /* ---- Skill bars ---- */
  _skillBarAnimations() {
    const fills = document.querySelectorAll('.skill-bar__fill');

    fills.forEach((fill) => {
      const targetWidth = fill.dataset.width + '%';

      gsap.to(fill, {
        scrollTrigger: {
          trigger: fill,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
        width: targetWidth,
        duration: 1.2,
        ease: 'power2.out',
      });
    });

    // Skill category panels
    gsap.from('.skill-category', {
      scrollTrigger: {
        trigger: '.skills__grid',
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 40,
      stagger: 0.2,
      duration: 0.8,
      ease: 'power3.out',
    });
  }

  /* ---- Projects grid ---- */
  _projectAnimations() {
    gsap.from('#projects-heading', {
      scrollTrigger: {
        trigger: '#projects-heading',
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      x: -40,
      duration: 0.8,
      ease: 'power3.out',
    });

    gsap.from('.project-card', {
      scrollTrigger: {
        trigger: '.project-grid',
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 50,
      stagger: 0.12,
      duration: 0.8,
      ease: 'power3.out',
    });
  }

  /* ---- Contact section ---- */
  _contactAnimations() {
    gsap.from('#contact-heading', {
      scrollTrigger: {
        trigger: '#contact-heading',
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      x: -40,
      duration: 0.8,
      ease: 'power3.out',
    });

    gsap.from('.contact__intro', {
      scrollTrigger: {
        trigger: '.contact__grid',
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power3.out',
    });

    gsap.from('.contact__link', {
      scrollTrigger: {
        trigger: '.contact__links',
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      x: -30,
      stagger: 0.15,
      duration: 0.6,
      ease: 'power3.out',
    });

    gsap.from('.contact-form', {
      scrollTrigger: {
        trigger: '.contact-form',
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      x: 40,
      duration: 0.8,
      ease: 'power3.out',
    });
  }

  /* ---- Smooth scroll for anchor links ---- */
  _smoothScrollLinks() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const target = document.querySelector(targetId);

        if (target) {
          gsap.to(window, {
            scrollTo: {
              y: target,
              offsetY: parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height')) || 70,
            },
            duration: 1,
            ease: 'power3.inOut',
          });
        }
      });
    });
  }
}

// Export for use in main.js
window.AnimationController = AnimationController;
