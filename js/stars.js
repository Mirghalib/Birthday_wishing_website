const starCanvas = document.getElementById('star-canvas');
const starCtx = starCanvas.getContext('2d');
let stars = [];
let twinkleStars = [];

function initStars() {
  stars = [];
  twinkleStars = [];
  const n = window.innerWidth < 500 ? 55 : 90;
  for (let i = 0; i < n; i++) {
    stars.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.4 + 0.3,
      a: Math.random(),
      speed: Math.random() * 0.015 + 0.003
    });
  }
}

function drawStars() {
  starCtx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  starCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  stars.forEach(s => {
    s.a += s.speed;
    const alpha = (Math.sin(s.a) + 1) / 2 * 0.8 + 0.15;
    starCtx.beginPath();
    starCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    starCtx.fillStyle = `rgba(255,255,255,${alpha})`;
    starCtx.fill();
  });
  requestAnimationFrame(drawStars);
}
