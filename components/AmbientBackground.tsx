'use client';

import { useEffect, useRef, useState } from 'react';

const CONNECTION_DISTANCE = 120;

/** Level-3 ambient motion (particle field) only runs on a real desktop
 *  pointer with motion allowed. Everything else gets the static blobs. */
function level3Allowed() {
  if (typeof window.matchMedia !== 'function') return false;
  return (
    window.matchMedia('(min-width: 1024px)').matches &&
    window.matchMedia('(pointer: fine)').matches &&
    window.matchMedia('(prefers-reduced-motion: no-preference)').matches
  );
}

class Particle {
  x = 0; y = 0; vx = 0; vy = 0; r = 0; a = 0;
  canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.reset();
  }

  reset() {
    this.x = Math.random() * this.canvas.width;
    this.y = Math.random() * this.canvas.height;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.r = Math.random() * 1.5 + 0.5;
    this.a = Math.random() * 0.5 + 0.1;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > this.canvas.width || this.y < 0 || this.y > this.canvas.height) {
      this.reset();
    }
  }

  draw(ctx: CanvasRenderingContext2D, rgb: string) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${rgb}, ${this.a})`;
    ctx.fill();
  }
}

function particleRGB() {
  return document.documentElement.getAttribute('data-theme') === 'light'
    ? '20, 24, 28'
    : '255, 255, 255';
}

export function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particlesEnabled, setParticlesEnabled] = useState(false);

  // Decide once on mount whether to mount the canvas at all; keep it in
  // sync if the reduced-motion preference changes.
  useEffect(() => {
    const update = () => setParticlesEnabled(level3Allowed());
    update();
    if (typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!particlesEnabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const wide = window.innerWidth >= 1440;
    const cap = wide ? 60 : 36;
    const drawLines = wide;

    let particles: Particle[] = [];
    let rafId = 0;
    let running = false;
    let resizeRaf = 0;

    function buildParticles() {
      const count = Math.min(cap, Math.floor(window.innerWidth / 24));
      particles = Array.from({ length: count }, () => new Particle(canvas!));
    }

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
      buildParticles();
    }

    function onResize() {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(resize);
    }

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < CONNECTION_DISTANCE) {
            const opacity = (1 - d / CONNECTION_DISTANCE) * 0.08;
            ctx!.beginPath();
            ctx!.strokeStyle = `rgba(${particleRGB()}, ${opacity})`;
            ctx!.lineWidth = 0.5;
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.stroke();
          }
        }
      }
    }

    function frame() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      const rgb = particleRGB();
      particles.forEach((p) => { p.update(); p.draw(ctx!, rgb); });
      if (drawLines) drawConnections();
      rafId = requestAnimationFrame(frame);
    }

    function start() {
      if (running) return;
      running = true;
      frame();
    }

    function stop() {
      running = false;
      cancelAnimationFrame(rafId);
    }

    // Pause when the tab is hidden or the hero (first ~1.4 viewports) has
    // scrolled well out of view — no point animating a background nobody
    // is looking at.
    function shouldRun() {
      return !document.hidden && window.scrollY < window.innerHeight * 1.4;
    }
    function sync() {
      if (shouldRun()) start();
      else stop();
    }

    resize();
    sync();
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('scroll', sync, { passive: true });
    document.addEventListener('visibilitychange', sync);

    return () => {
      stop();
      cancelAnimationFrame(resizeRaf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', sync);
      document.removeEventListener('visibilitychange', sync);
    };
  }, [particlesEnabled]);

  return (
    <>
      <div className="blob-wrap" aria-hidden="true">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>
      {particlesEnabled && <canvas id="particle-canvas" ref={canvasRef} aria-hidden="true" />}
    </>
  );
}
