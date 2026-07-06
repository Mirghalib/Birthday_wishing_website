// ---------- Mouse cursor effects: sparkles, golden particles, floating hearts ----------
(function () {
  'use strict';

  const MAX_SPARKLES = 30;
  const sparkles = [];

  let mouseX = -1000;
  let mouseY = -1000;
  let lastSpawn = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    const now = performance.now();
    if (now - lastSpawn > 60 && sparkles.length < MAX_SPARKLES) {
      lastSpawn = now;
      addSparkle(mouseX, mouseY);
    }
  });

  function addSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.className = 'cursor-sparkle';
    const size = Math.random() * 4 + 2;
    sparkle.style.cssText = `
      left:${x - size/2}px;
      top:${y - size/2}px;
      width:${size}px;
      height:${size}px;
      position:fixed;
      pointer-events:none;
      z-index:9999;
      border-radius:50%;
      background:radial-gradient(circle at center, #ffd166, ${['#ff5d9e','#8a4dff','#ffd166','#ffffff'][Math.floor(Math.random()*4)]});
      box-shadow:0 0 ${size * 3}px ${['rgba(255,93,158,0.6)','rgba(138,77,255,0.6)','rgba(255,209,102,0.6)'][Math.floor(Math.random()*3)]};
      animation:cursorSparkle ${0.5 + Math.random() * 0.5}s ease-out forwards;
    `;
    document.body.appendChild(sparkle);
    sparkles.push(sparkle);

    setTimeout(() => {
      if (sparkle.parentNode) {
        sparkle.parentNode.removeChild(sparkle);
      }
      const idx = sparkles.indexOf(sparkle);
      if (idx > -1) sparkles.splice(idx, 1);
    }, 650);
  }

  function createCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.innerHTML = '✦';
    cursor.style.cssText = `
      position:fixed;
      pointer-events:none;
      z-index:10000;
      font-size:12px;
      color:rgba(255,209,102,0.3);
      transform:translate(-50%,-50%);
      transition:all 0.15s ease-out;
      text-shadow:0 0 10px rgba(255,209,102,0.3);
    `;
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', e => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });

    // Enlarge cursor on hoverable elements
    document.querySelectorAll('.btn, .envelope, .music-btn').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.fontSize = '24px';
        cursor.style.color = 'rgba(255,209,102,0.7)';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.fontSize = '12px';
        cursor.style.color = 'rgba(255,209,102,0.3)';
      });
    });
  }

  // Create custom cursor
  createCustomCursor();

  // Add sparkle animation keyframes dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes cursorSparkle {
      0% { transform: scale(0); opacity: 1; }
      50% { transform: scale(1.5); opacity: 0.8; }
      100% { transform: scale(0); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

})();
