// ---------- Finale Scene: transitions after letter completes ----------
(function () {
  'use strict';

  let hasStarted = false;

  function startFinale() {
    if (hasStarted) return;
    hasStarted = true;
    showScene('scene-finale');

    // Grand finale effects
    let fireworkCount = 0;
    const maxFireworks = 12;

    function launchFireworks() {
      if (fireworkCount >= maxFireworks) return;
      fireworkCount++;

      const cx = Math.random() * window.innerWidth;
      const cy = Math.random() * window.innerHeight * 0.5;

      if (window.burstConfetti) {
        window.burstConfetti(60, cx, cy);
      }
      if (window.addBurstHearts) {
        window.addBurstHearts(cx, cy, 20);
      }

      const delay = 600 + Math.random() * 1200;
      setTimeout(launchFireworks, delay);
    }

    // Start fireworks after a short delay
    setTimeout(launchFireworks, 2000);

    // Continuous confetti during finale
    const confettiInterval = setInterval(() => {
      if (window.burstConfetti) {
        window.burstConfetti(
          15 + Math.floor(Math.random() * 20),
          Math.random() * window.innerWidth,
          Math.random() * window.innerHeight * 0.3
        );
      }
    }, 800);

    // Store interval for cleanup
    window.__finaleInterval = confettiInterval;

    // After fireworks complete, transition to final image scene
    setTimeout(() => {
      if (window.__finaleInterval) {
        clearInterval(window.__finaleInterval);
        window.__finaleInterval = null;
      }
      if (window.startFinalScene) {
        window.startFinalScene();
      }
    }, 16000);
  }

  window.startFinale = startFinale;

})();
