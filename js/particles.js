// ---------- Advanced particles: fireflies, floating hearts, aurora, galaxy, rose petals ----------
(function () {
  'use strict';

  const canvas = document.getElementById('fx-canvas-2');
  const ctx = canvas.getContext('2d');

  const particles = {
    fireflies: [],
    hearts: [],
    roses: [],
    sparkles: [],
    galaxy: []
  };

  const FIREFLY_COUNT = 20;
  const HEART_COUNT = 8;
  const ROSE_COUNT = 3;
  const GALAXY_COUNT = 60;

  let time = 0;

  function resize() {
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
  }

  function createFirefly() {
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2 + 1,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.02 + 0.005,
      life: Math.random() * 200 + 100,
      maxLife: Math.random() * 200 + 100
    };
  }

  function createHeart() {
    return {
      x: Math.random() * window.innerWidth,
      y: window.innerHeight + 20,
      size: Math.random() * 12 + 8,
      vy: -(Math.random() * 1 + 0.5),
      vx: (Math.random() - 0.5) * 1.5,
      opacity: 0,
      phase: Math.random() * Math.PI * 2
    };
  }

  function createRose() {
    return {
      x: Math.random() * window.innerWidth,
      y: -20,
      size: Math.random() * 8 + 6,
      vy: Math.random() * 1 + 0.5,
      vx: (Math.random() - 0.5) * 0.8,
      rotation: Math.random() * 360,
      vr: (Math.random() - 0.5) * 3,
      opacity: 0.6
    };
  }

  function createGalaxyParticle() {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * Math.min(window.innerWidth, window.innerHeight) * 0.35;
    return {
      x: window.innerWidth / 2 + Math.cos(angle) * radius,
      y: window.innerHeight / 2 + Math.sin(angle) * radius,
      origX: Math.cos(angle) * radius,
      origY: Math.sin(angle) * radius,
      size: Math.random() * 1.5 + 0.5,
      brightness: Math.random() * 0.5 + 0.3,
      hue: Math.random() * 60 + 220,
      pulse: Math.random() * Math.PI * 2
    };
  }

  function initParticles() {
    particles.fireflies = [];
    particles.hearts = [];
    particles.roses = [];
    particles.galaxy = [];

    for (let i = 0; i < FIREFLY_COUNT; i++) {
      particles.fireflies.push(createFirefly());
    }
    for (let i = 0; i < HEART_COUNT; i++) {
      particles.hearts.push(createHeart());
    }
    for (let i = 0; i < GALAXY_COUNT; i++) {
      particles.galaxy.push(createGalaxyParticle());
    }
  }

  function drawGalaxy(ctx, w, h) {
    particles.galaxy.forEach(p => {
      p.pulse += 0.02;
      const alpha = p.brightness + Math.sin(p.pulse) * 0.15;
      const xOff = Math.sin(time * 0.0003 + p.pulse) * 5;
      const yOff = Math.cos(time * 0.0002 + p.pulse) * 3;
      const x = w / 2 + p.origX + xOff;
      const y = h / 2 + p.origY + yOff;

      ctx.beginPath();
      ctx.arc(x, y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 70%, 70%, ${alpha})`;
      ctx.fill();
    });
  }

  function drawAurora(ctx, w, h) {
    const t = time * 0.0001;
    for (let i = 0; i < 3; i++) {
      const x1 = w * 0.1 + Math.sin(t + i * 2) * w * 0.3;
      const x2 = w * 0.9 + Math.cos(t * 0.7 + i * 1.5) * w * 0.3;
      const yBase = h * 0.15 + i * h * 0.08;
      const hue = 220 + i * 30 + Math.sin(t * 0.5) * 20;

      const grad = ctx.createLinearGradient(x1, yBase, x2, yBase + h * 0.15);
      grad.addColorStop(0, `hsla(${hue}, 80%, 60%, 0)`);
      grad.addColorStop(0.3, `hsla(${hue + 20}, 80%, 65%, 0.12)`);
      grad.addColorStop(0.5, `hsla(${hue + 40}, 80%, 70%, 0.18)`);
      grad.addColorStop(0.7, `hsla(${hue + 20}, 80%, 65%, 0.12)`);
      grad.addColorStop(1, `hsla(${hue}, 80%, 60%, 0)`);

      ctx.beginPath();
      ctx.moveTo(x1 - 50, yBase + h * 0.1);
      ctx.quadraticCurveTo(
        (x1 + x2) / 2 + Math.sin(t * 0.5 + i) * 50,
        yBase - h * 0.05 + Math.cos(t + i) * 15,
        x2 + 50, yBase + h * 0.1
      );
      ctx.quadraticCurveTo(
        (x1 + x2) / 2 + Math.sin(t * 0.3 + i + 1) * 40,
        yBase + h * 0.15 + Math.cos(t * 0.7 + i) * 10,
        x1 - 50, yBase + h * 0.1
      );
      ctx.fillStyle = grad;
      ctx.fill();
    }
  }

  function drawFireflies(ctx) {
    particles.fireflies.forEach(p => {
      p.x += p.vx + Math.sin(time * 0.002 + p.phase) * 0.2;
      p.y += p.vy + Math.cos(time * 0.003 + p.phase) * 0.2;
      p.life--;

      if (p.life <= 0 || p.x < -20 || p.x > window.innerWidth + 20 || p.y < -20 || p.y > window.innerHeight + 20) {
        Object.assign(p, createFirefly());
        return;
      }

      const glow = (Math.sin(time * 0.005 + p.phase) + 1) / 2;
      const alpha = glow * 0.7 + 0.1;

      // Glow
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 6);
      grad.addColorStop(0, `rgba(255, 255, 200, ${alpha * 0.4})`);
      grad.addColorStop(1, `rgba(255, 255, 200, 0)`);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 6, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Core
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 220, ${alpha})`;
      ctx.fill();
    });
  }

  function drawHearts(ctx) {
    particles.hearts.forEach(p => {
      p.y += p.vy;
      p.x += p.vx + Math.sin(time * 0.003 + p.phase) * 0.3;
      p.opacity = Math.min(p.opacity + 0.01, 0.6);

      if (p.y < -30) {
        Object.assign(p, createHeart());
        return;
      }

      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.font = `${p.size}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('♥', p.x, p.y);
      ctx.restore();
    });
  }

  function drawRoses(ctx) {
    if (particles.roses.length < ROSE_COUNT) {
      particles.roses.push(createRose());
    }

    particles.roses.forEach(p => {
      p.y += p.vy;
      p.x += p.vx;
      p.rotation += p.vr;

      if (p.y > window.innerHeight + 20) {
        Object.assign(p, createRose());
      }

      ctx.save();
      ctx.globalAlpha = p.opacity * 0.5;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation * Math.PI / 180);
      ctx.font = `${p.size * 1.5}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🌸', 0, 0);
      ctx.restore();
    });
  }

  function drawNebula(ctx, w, h) {
    const t = time * 0.00015;
    for (let i = 0; i < 2; i++) {
      const cx = w * (0.4 + i * 0.3) + Math.sin(t + i * 3) * w * 0.1;
      const cy = h * (0.3 + i * 0.4) + Math.cos(t * 0.7 + i * 2) * h * 0.08;
      const r = Math.min(w, h) * 0.2 + Math.sin(t + i) * 20;
      const hue = 280 + i * 40 + Math.sin(t * 0.5) * 30;

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, `hsla(${hue}, 80%, 50%, 0.04)`);
      grad.addColorStop(0.5, `hsla(${hue + 30}, 70%, 55%, 0.025)`);
      grad.addColorStop(1, `hsla(${hue + 60}, 60%, 60%, 0)`);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    }
  }

  function drawMoon(ctx, w, h) {
    const t = time * 0.00005;
    const mx = w * 0.85 + Math.sin(t) * 10;
    const my = h * 0.12 + Math.cos(t * 0.7) * 8;
    const mr = Math.min(w, h) * 0.04;

    // Outer glow
    const glowGrad = ctx.createRadialGradient(mx, my, mr * 0.5, mx, my, mr * 3);
    glowGrad.addColorStop(0, `rgba(255, 220, 180, 0.08)`);
    glowGrad.addColorStop(0.5, `rgba(255, 200, 150, 0.03)`);
    glowGrad.addColorStop(1, `rgba(255, 200, 150, 0)`);
    ctx.beginPath();
    ctx.arc(mx, my, mr * 3, 0, Math.PI * 2);
    ctx.fillStyle = glowGrad;
    ctx.fill();

    // Moon body
    const moonGrad = ctx.createRadialGradient(mx - mr * 0.3, my - mr * 0.3, mr * 0.1, mx, my, mr);
    moonGrad.addColorStop(0, `rgba(255, 240, 220, 0.8)`);
    moonGrad.addColorStop(0.7, `rgba(230, 215, 195, 0.5)`);
    moonGrad.addColorStop(1, `rgba(200, 185, 165, 0.2)`);
    ctx.beginPath();
    ctx.arc(mx, my, mr, 0, Math.PI * 2);
    ctx.fillStyle = moonGrad;
    ctx.fill();

    // Crater hints
    ctx.save();
    ctx.globalAlpha = 0.08;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(mx - mr * 0.2, my - mr * 0.1, mr * 0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(mx + mr * 0.15, my + mr * 0.08, mr * 0.08, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(mx - mr * 0.05, my + mr * 0.15, mr * 0.06, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawFog(ctx, w, h) {
    const t = time * 0.0001;
    for (let i = 0; i < 4; i++) {
      const x = w * (i / 4) + Math.sin(t + i * 2) * w * 0.1;
      const y = h * 0.85 + Math.cos(t * 0.5 + i) * h * 0.05;
      const r = Math.min(w, h) * 0.3;

      const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, `rgba(138, 77, 255, ${0.015 + i * 0.002})`);
      grad.addColorStop(1, `rgba(138, 77, 255, 0)`);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    }
  }

  function addBurstHearts(cx, cy, count) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 2;
      particles.hearts.push({
        x: cx || window.innerWidth / 2,
        y: cy || window.innerHeight / 2,
        size: Math.random() * 10 + 6,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        opacity: 0.8,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  // Expose for use by other modules
  window.addBurstHearts = addBurstHearts;

  // Aurora glow overlay (subtle pulsing)
  function drawSoftGlow(ctx, w, h) {
    const t = time * 0.0002;
    const gx = w / 2 + Math.sin(t) * w * 0.1;
    const gy = h / 2 + Math.cos(t * 0.6) * h * 0.05;
    const gr = Math.min(w, h) * 0.5;

    const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
    grad.addColorStop(0, `rgba(255, 93, 158, ${0.02 + Math.sin(t * 0.5) * 0.005})`);
    grad.addColorStop(1, 'rgba(255, 93, 158, 0)');
    ctx.beginPath();
    ctx.arc(gx, gy, gr, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
  }

  function render() {
    time++;
    const w = window.innerWidth;
    const h = window.innerHeight;

    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    ctx.clearRect(0, 0, w, h);

    // Layer 1: Galaxy (deepest)
    drawGalaxy(ctx, w, h);

    // Layer 2: Nebula
    drawNebula(ctx, w, h);

    // Layer 3: Aurora
    drawAurora(ctx, w, h);

    // Layer 4: Moon
    drawMoon(ctx, w, h);

    // Layer 5: Soft fog
    drawFog(ctx, w, h);

    // Layer 6: Dynamic glow
    drawSoftGlow(ctx, w, h);

    // Layer 7: Fireflies
    drawFireflies(ctx);

    // Layer 8: Floating hearts
    drawHearts(ctx);

    // Layer 9: Rose petals
    drawRoses(ctx);

    requestAnimationFrame(render);
  }

  // Init
  resize();
  initParticles();
  render();

  window.addEventListener('resize', resize);

  // Periodically add more roses
  setInterval(() => {
    if (particles.roses.length < ROSE_COUNT + 2) {
      particles.roses.push(createRose());
    }
  }, 8000);

})();
