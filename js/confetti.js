const fxCanvas = document.getElementById('fx-canvas');
const fxCtx = fxCanvas.getContext('2d');
const confettiColors = ['#ff5d9e','#8a4dff','#ffd166','#5cc8ff','#4dd0a1','#ff8fc0'];

let confettiParticles = [];

function burstConfetti(count, cx, cy) {
  const centerX = cx || window.innerWidth / 2;
  const centerY = cy || window.innerHeight * 0.35;
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 7 + 2;
    confettiParticles.push({
      x: centerX + (Math.random() - 0.5) * 140,
      y: centerY,
      vx: Math.cos(angle) * speed,
      vy: Math.random() * -9 - 3,
      size: Math.random() * 6 + 4,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      rot: Math.random() * 360,
      vr: (Math.random() - 0.5) * 10,
      life: 0,
      maxLife: 140 + Math.random() * 60,
      gravity: 0.18
    });
  }
}

function updateConfetti() {
  fxCtx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  fxCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  confettiParticles.forEach(p => {
    p.vy += p.gravity;
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;
    p.life++;
    const alpha = 1 - p.life / p.maxLife;
    if (alpha < 0) return;
    fxCtx.save();
    fxCtx.translate(p.x, p.y);
    fxCtx.rotate(p.rot * Math.PI / 180);
    fxCtx.globalAlpha = alpha;
    fxCtx.fillStyle = p.color;
    fxCtx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    fxCtx.restore();
  });
  confettiParticles = confettiParticles.filter(p => p.life < p.maxLife && p.y < window.innerHeight + 40);
  requestAnimationFrame(updateConfetti);
}
