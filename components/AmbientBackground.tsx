'use client';

import { useEffect, useRef } from 'react';

const CONNECTION_DISTANCE = 120;
const getParticleCount = () => Math.min(80, Math.floor(window.innerWidth / 20));

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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    let rafId = 0;

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
      particles = Array.from({ length: getParticleCount() }, () => new Particle(canvas!));
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

    function animate() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      const rgb = particleRGB();
      particles.forEach((p) => { p.update(); p.draw(ctx!, rgb); });
      drawConnections();
      rafId = requestAnimationFrame(animate);
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <>
      <div className="blob-wrap" aria-hidden="true">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>
      <canvas id="particle-canvas" ref={canvasRef} aria-hidden="true" />
    </>
  );
}
