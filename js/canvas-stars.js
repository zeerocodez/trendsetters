/**
 * Starfield / Golden Particle Ambient Background
 * High-performance, lightweight HTML5 Canvas animation
 */
(function initAmbientStarfield() {
  const canvas = document.getElementById('starfield-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = 65; // Optimized for performance

  const goldColors = [
    'rgba(212, 175, 55, 0.7)',
    'rgba(245, 229, 171, 0.8)',
    'rgba(255, 223, 109, 0.5)',
    'rgba(184, 147, 36, 0.6)'
  ];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 1.8 + 0.4;
      this.speedX = (Math.random() - 0.5) * 0.25;
      this.speedY = (Math.random() - 0.5) * 0.25;
      this.color = goldColors[Math.floor(Math.random() * goldColors.length)];
      this.alpha = Math.random() * 0.7 + 0.2;
      this.alphaChange = (Math.random() * 0.01 + 0.003) * (Math.random() > 0.5 ? 1 : -1);
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Pulse opacity
      this.alpha += this.alphaChange;
      if (this.alpha <= 0.1 || this.alpha >= 0.9) {
        this.alphaChange = -this.alphaChange;
      }

      // Wrap around bounds
      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, this.alpha));
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(212, 175, 55, 0.8)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function init() {
    resize();
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  let animationFrameId;
  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    animationFrameId = requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => {
    resize();
  });

  // Only animate if user doesn't prefer reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion) {
    init();
    animate();
  }
})();
