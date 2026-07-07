// ---------- Cinematic Final Ending: image7 + particles + typewriter + closing frames ----------
(function () {
  'use strict';

  let hasStarted = false;

  function startFinalScene() {
    if (hasStarted) return;
    hasStarted = true;
    showScene('scene-final-image');

    // Init the heavy particle canvas
    var canvas = document.getElementById('ending-particles-canvas');
    if (canvas) initParticleCanvas(canvas);

    // Phase 1: reveal message lines and heart icon by data-delay
    var lines = document.querySelectorAll('.ending-line, .ending-heart-bottom');
    lines.forEach(function (line) {
      var delay = parseInt(line.dataset.delay) || 0;
      setTimeout(function () { line.classList.add('revealed'); }, delay);
    });

    // After all message lines reveal (~35s), transition to closing frames
    var totalMsgDuration = 35000;
    setTimeout(function () {
      showClosingFrames();
    }, totalMsgDuration);
  }

  function showClosingFrames() {
    var msgEl = document.getElementById('ending-message');
    var closingEl = document.getElementById('ending-closing');
    if (msgEl) msgEl.style.display = 'none';
    if (closingEl) {
      closingEl.style.display = 'flex';

      var frames = closingEl.querySelectorAll('.closing-frame');
      var current = 0;

      function showFrame(idx) {
        frames.forEach(function (f) { f.classList.remove('active'); });
        if (frames[idx]) frames[idx].classList.add('active');
      }

      showFrame(0);

      // Cycle through frames every 4s (3s visible + 1s transition)
      setInterval(function () {
        current = (current + 1) % frames.length;
        showFrame(current);
      }, 4000);
    }
  }

  // ---------- Heavy particle canvas ----------
  function initParticleCanvas(canvas) {
    var ctx = canvas.getContext('2d');
    var w, h;
    var running = true;

    // Particle pools
    var hearts = [];
    var balloons = [];
    var sparkles = [];
    var fireflies = [];
    var petals = [];
    var bokeh = [];

    var HEART_COUNT = 30;
    var BALLOON_COUNT = 8;
    var SPARKLE_COUNT = 50;
    var FIREFLY_COUNT = 20;
    var PETAL_COUNT = 10;
    var BOKEH_COUNT = 15;

    var time = 0;

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * devicePixelRatio;
      canvas.height = h * devicePixelRatio;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
    }

    // ---- Creators ----
    function createHeart() {
      return {
        x: Math.random() * w, y: h + 20 + Math.random() * 60,
        size: 6 + Math.random() * 10,
        vy: -(0.3 + Math.random() * 0.7),
        vx: (Math.random() - 0.5) * 0.6,
        opacity: 0.15 + Math.random() * 0.25,
        phase: Math.random() * Math.PI * 2
      };
    }

    function createBalloon() {
      var colors = ['#ff5d9e', '#ff3d8f', '#ff8fc0', '#ffd166', '#8a4dff', '#a06bff', '#ff4757', '#e84393'];
      return {
        x: 30 + Math.random() * (w - 60),
        y: h + 10 + Math.random() * 40,
        size: 18 + Math.random() * 16,
        vy: -(0.15 + Math.random() * 0.25),
        vx: (Math.random() - 0.5) * 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
        stringLen: 30 + Math.random() * 20,
        sway: 0
      };
    }

    function createSparkle() {
      return {
        x: Math.random() * w, y: Math.random() * h,
        size: 1 + Math.random() * 2.5,
        life: 0, maxLife: 100 + Math.random() * 80,
        vx: (Math.random() - 0.5) * 0.2,
        vy: -(Math.random() * 0.3 + 0.1),
        hue: 30 + Math.random() * 40
      };
    }

    function createFirefly() {
      return {
        x: Math.random() * w, y: Math.random() * h,
        size: 1.5 + Math.random() * 1.5,
        phase: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15
      };
    }

    function createPetal() {
      var emojis = ['🌸', '🌹', '🌸'];
      return {
        x: Math.random() * w, y: -20,
        size: 10 + Math.random() * 8,
        vy: 0.3 + Math.random() * 0.4,
        vx: (Math.random() - 0.5) * 0.4,
        rotation: Math.random() * 360,
        vr: (Math.random() - 0.5) * 2,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        opacity: 0.25 + Math.random() * 0.2
      };
    }

    function createBokeh() {
      return {
        x: Math.random() * w, y: Math.random() * h,
        size: 4 + Math.random() * 18,
        phase: Math.random() * Math.PI * 2,
        opacity: 0.02 + Math.random() * 0.04,
        hue: 280 + Math.random() * 60
      };
    }

    // ---- Init pools ----
    function initPools() {
      hearts = []; balloons = []; sparkles = [];
      fireflies = []; petals = []; bokeh = [];

      for (var i = 0; i < HEART_COUNT; i++) hearts.push(createHeart());
      for (var i = 0; i < BALLOON_COUNT; i++) balloons.push(createBalloon());
      for (var i = 0; i < SPARKLE_COUNT; i++) sparkles.push(createSparkle());
      for (var i = 0; i < FIREFLY_COUNT; i++) fireflies.push(createFirefly());
      for (var i = 0; i < PETAL_COUNT; i++) petals.push(createPetal());
      for (var i = 0; i < BOKEH_COUNT; i++) bokeh.push(createBokeh());
    }

    // ---- Draw ----
    function drawBokeh() {
      bokeh.forEach(function (b) {
        var alpha = b.opacity + Math.sin(time * 0.003 + b.phase) * 0.02;
        if (alpha < 0) alpha = 0;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
        ctx.fillStyle = 'hsla(' + b.hue + ', 60%, 70%, ' + alpha + ')';
        ctx.fill();
        // soft glow
        var grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.size * 2);
        grad.addColorStop(0, 'hsla(' + b.hue + ', 60%, 80%, ' + (alpha * 0.3) + ')');
        grad.addColorStop(1, 'hsla(' + b.hue + ', 60%, 80%, 0)');
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });
    }

    function drawSparkles() {
      sparkles.forEach(function (p) {
        p.x += p.vx; p.y += p.vy; p.life++;
        var alpha = 1 - p.life / p.maxLife;
        if (alpha <= 0) { Object.assign(p, createSparkle()); return; }
        // glow
        var grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 5);
        grad.addColorStop(0, 'hsla(' + p.hue + ', 80%, 80%, ' + (alpha * 0.2) + ')');
        grad.addColorStop(1, 'hsla(' + p.hue + ', 80%, 80%, 0)');
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 5, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        // core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = 'hsla(' + p.hue + ', 80%, 90%, ' + (alpha * 0.8) + ')';
        ctx.fill();
      });
    }

    function drawFireflies() {
      fireflies.forEach(function (f) {
        var glow = (Math.sin(time * 0.005 + f.phase) + 1) / 2;
        f.x += f.vx + Math.sin(time * 0.002 + f.phase) * 0.3;
        f.y += f.vy + Math.cos(time * 0.003 + f.phase) * 0.2;
        if (f.x < -10 || f.x > w + 10 || f.y < -10 || f.y > h + 10) {
          Object.assign(f, createFirefly());
        }
        var grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.size * 6);
        grad.addColorStop(0, 'rgba(255,255,200,' + (glow * 0.25) + ')');
        grad.addColorStop(1, 'rgba(255,255,200,0)');
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.size * 6, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,220,' + (glow * 0.6 + 0.1) + ')';
        ctx.fill();
      });
    }

    function drawHearts() {
      hearts.forEach(function (h) {
        h.y += h.vy;
        h.x += h.vx + Math.sin(time * 0.003 + h.phase) * 0.3;
        if (h.y < -30) { Object.assign(h, createHeart()); return; }
        ctx.save();
        ctx.globalAlpha = h.opacity;
        ctx.font = h.size + 'px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#ff5d9e';
        ctx.fillText('♥', h.x, h.y);
        ctx.restore();
      });
    }

    function drawBalloons() {
      balloons.forEach(function (b) {
        b.y += b.vy;
        b.sway += 0.02;
        b.x += Math.sin(b.sway) * 0.2;
        if (b.y < -80) { Object.assign(b, createBalloon()); return; }
        // Balloon body
        ctx.save();
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.ellipse(b.x, b.y, b.size * 0.5, b.size * 0.65, 0, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.fill();
        // String
        ctx.beginPath();
        ctx.moveTo(b.x, b.y + b.size * 0.65);
        ctx.lineTo(b.x + Math.sin(b.sway) * 5, b.y + b.size * 0.65 + b.stringLen);
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
        ctx.restore();
      });
    }

    function drawPetals() {
      petals.forEach(function (p) {
        p.y += p.vy;
        p.x += p.vx + Math.sin(time * 0.005) * 0.3;
        p.rotation += p.vr;
        if (p.y > h + 30) { Object.assign(p, createPetal()); return; }
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation * Math.PI / 180);
        ctx.font = p.size + 'px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.emoji, 0, 0);
        ctx.restore();
      });
    }

    // ---- Render loop ----
    function render() {
      if (!running) return;
      time++;
      w = window.innerWidth;
      h = window.innerHeight;

      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // Layer order: bokeh (deepest) -> sparkles -> fireflies -> hearts -> petals -> balloons (front)
      drawBokeh();
      drawSparkles();
      drawFireflies();
      drawHearts();
      drawPetals();
      drawBalloons();

      requestAnimationFrame(render);
    }

    resize();
    initPools();
    render();

    window.addEventListener('resize', resize);
  }

  window.startFinalScene = startFinalScene;

})();
