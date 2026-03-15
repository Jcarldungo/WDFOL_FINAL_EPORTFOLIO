/**
 * @module particles
 * Renders an animated particle network on a fixed <canvas>.
 * Particles drift slowly; nearby particles are connected by faint lines.
 *
 * Separation rationale: Canvas animation is a self-contained render loop
 * with its own lifecycle. It must never couple with routing or DOM logic.
 * This module owns the canvas entirely.
 *
 * @exports { init }
 */

/** @type {HTMLCanvasElement} */
let canvas;
/** @type {CanvasRenderingContext2D} */
let ctx;
/** @type {Particle[]} */
let particles = [];
/** @type {number} requestAnimationFrame ID */
let rafId;

/** Maximum connection distance between particles (px) */
const CONNECTION_DISTANCE = 120;
/** Derived count — capped to avoid perf issues on large screens */
const getParticleCount = () => Math.min(80, Math.floor(window.innerWidth / 20));

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x  = Math.random() * canvas.width;
    this.y  = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.r  = Math.random() * 1.5 + 0.5;
    this.a  = Math.random() * 0.5 + 0.1;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    // Wrap around edges
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
      this.reset();
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(56, 189, 248, ${this.a})`;
    ctx.fill();
  }
}

/** Draw faint connecting lines between nearby particles */
function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d  = Math.sqrt(dx * dx + dy * dy);

      if (d < CONNECTION_DISTANCE) {
        const opacity = (1 - d / CONNECTION_DISTANCE) * 0.08;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(56, 189, 248, ${opacity})`;
        ctx.lineWidth   = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

/** Main animation loop */
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  rafId = requestAnimationFrame(animate);
}

/** Resize canvas to viewport and rebuild particles */
function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  // Rebuild particle array for new dimensions
  particles = Array.from({ length: getParticleCount() }, () => new Particle());
}

/**
 * Initialize the particle canvas.
 * Idempotent — safe to call once on app start.
 */
export function init() {
  canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  ctx = canvas.getContext('2d');
  resize();

  window.addEventListener('resize', resize, { passive: true });

  // Cancel any previous loop before starting
  if (rafId) cancelAnimationFrame(rafId);
  animate();
}
