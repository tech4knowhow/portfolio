/* ============================================
   PARTICLE SYSTEM
   Full-viewport canvas with floating particles
   and mouse interaction
============================================ */

class ParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 150 };
    this.animationId = null;
    this.isRunning = false;

    // Configuration
    this.config = {
      particleCount: 70,
      connectionDistance: 120,
      particleSpeed: 0.4,
      colors: [
        'rgba(0, 255, 136, ',    // neon green
        'rgba(0, 212, 255, ',    // neon blue
        'rgba(123, 47, 255, ',   // neon purple
      ],
      particleSize: { min: 1, max: 2.5 },
      lineOpacity: 0.15,
      particleOpacity: { min: 0.3, max: 0.8 },
    };

    this._init();
  }

  /* ---- Initialization ---- */
  _init() {
    this._resize();
    this._createParticles();
    this._bindEvents();
    this._start();
  }

  /* ---- Resize canvas to window ---- */
  _resize() {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    this.ctx.scale(dpr, dpr);
  }

  /* ---- Create particle objects ---- */
  _createParticles() {
    this.particles = [];
    const count = window.innerWidth < 768
      ? Math.floor(this.config.particleCount * 0.5)
      : this.config.particleCount;

    for (let i = 0; i < count; i++) {
      this.particles.push(this._createParticle());
    }
  }

  _createParticle() {
    const { particleSpeed, particleSize, particleOpacity, colors } = this.config;
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * particleSpeed * 2,
      vy: (Math.random() - 0.5) * particleSpeed * 2,
      size: Math.random() * (particleSize.max - particleSize.min) + particleSize.min,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: Math.random() * (particleOpacity.max - particleOpacity.min) + particleOpacity.min,
      pulseSpeed: 0.005 + Math.random() * 0.01,
      pulseOffset: Math.random() * Math.PI * 2,
    };
  }

  /* ---- Event binding ---- */
  _bindEvents() {
    // Mouse tracking
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });

    // Resize handler (debounced)
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this._resize();
        this._createParticles();
      }, 200);
    });

    // Pause when tab hidden, resume when visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this._stop();
      } else {
        this._start();
      }
    });
  }

  /* ---- Animation loop ---- */
  _start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this._animate();
  }

  _stop() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  _animate() {
    if (!this.isRunning) return;

    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    const time = Date.now() * 0.001;

    // Update and draw particles
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Mouse repulsion
      if (this.mouse.x !== null && this.mouse.y !== null) {
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.mouse.radius) {
          const force = (this.mouse.radius - dist) / this.mouse.radius;
          p.vx += (dx / dist) * force * 0.5;
          p.vy += (dy / dist) * force * 0.5;
        }
      }

      // Dampen velocity
      p.vx *= 0.99;
      p.vy *= 0.99;

      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges
      if (p.x < 0) p.x = window.innerWidth;
      if (p.x > window.innerWidth) p.x = 0;
      if (p.y < 0) p.y = window.innerHeight;
      if (p.y > window.innerHeight) p.y = 0;

      // Pulsing opacity
      const pulse = Math.sin(time * p.pulseSpeed * 60 + p.pulseOffset) * 0.15 + 0.85;
      const alpha = p.opacity * pulse;

      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color + alpha + ')';
      this.ctx.fill();

      // Draw connections
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.config.connectionDistance) {
          const opacity = (1 - dist / this.config.connectionDistance) * this.config.lineOpacity;
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = p.color + opacity + ')';
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      }
    }

    this.animationId = requestAnimationFrame(() => this._animate());
  }
}

// Export for use in main.js
window.ParticleSystem = ParticleSystem;
