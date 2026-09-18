/* ============================================
   MAIN ENTRY POINT
   Initializes all modules when DOM is ready
============================================ */

document.addEventListener('DOMContentLoaded', () => {
  /* ---- Initialize particle background ---- */
  new ParticleSystem('particle-canvas');

  /* ---- Initialize GSAP animations ---- */
  new AnimationController();

  /* ---- Initialize navbar behavior ---- */
  new NavbarController();

  /* ---- Initialize contact form ---- */
  new ContactForm();
});
