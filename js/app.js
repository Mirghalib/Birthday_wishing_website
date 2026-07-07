(function () {
  'use strict';

  // ---------- Resize canvas helper ----------
  function resizeCanvases() {
    ['star-canvas', 'fx-canvas', 'fx-canvas-2'].forEach(id => {
      const c = document.getElementById(id);
      if (!c) return;
      c.width = window.innerWidth * devicePixelRatio;
      c.height = window.innerHeight * devicePixelRatio;
      c.style.width = window.innerWidth + 'px';
      c.style.height = window.innerHeight + 'px';
    });
  }

  // ---------- Intro animation ----------
  const INTRO_DURATION = 5000;
  const introBar = document.getElementById('intro-progress-bar');
  const introStart = performance.now();

  function tickIntroBar(now) {
    const elapsed = now - introStart;
    const pct = Math.min(100, (elapsed / INTRO_DURATION) * 100);
    introBar.style.width = pct + '%';
    if (elapsed < INTRO_DURATION) {
      requestAnimationFrame(tickIntroBar);
    }
  }
  requestAnimationFrame(tickIntroBar);

  setTimeout(() => {
    showScene('scene-celebrate');
  }, INTRO_DURATION);

  // ---------- Button wiring ----------
  document.getElementById('btn-celebrate').addEventListener('click', () => {
    showScene('scene-birthday');
    burstConfetti(180);
  });

  document.getElementById('btn-moments').addEventListener('click', () => {
    showScene('scene-moments');
  });

  document.getElementById('btn-letter').addEventListener('click', () => {
    showScene('scene-letter-closed');
  });

  const envelope = document.getElementById('envelope');
  const letterPaper = document.getElementById('letter-paper');

  function openLetter() {
    showScene('scene-letter-open');
    burstConfetti(90);
    if (!letterOpened) {
      letterOpened = true;
      startLetterTypewriter(letterPaper);
    }
  }

  envelope.addEventListener('click', openLetter);
  envelope.addEventListener('keypress', e => {
    if (e.key === 'Enter' || e.key === ' ') openLetter();
  });

  // Tap to fast-forward letter
  letterPaper.addEventListener('click', () => {
    fastForwardLetter(letterPaper);
  });

  // Listen for letter done event -> transition to finale
  letterPaper.addEventListener('letterDone', () => {
    // Clean up confetti interval if any
    if (window.__finaleInterval) {
      clearInterval(window.__finaleInterval);
      window.__finaleInterval = null;
    }
    // Start the grand finale after a 2-second pause
    setTimeout(() => {
      if (window.startFinale) {
        window.startFinale();
      }
    }, 2000);
  });

  // ---------- Scene-based music volume ----------
  function adjustMusicForScene(sceneId) {
    if (!window.setMusicVolume) return;
    switch (sceneId) {
      case 'scene-letter-open':
        window.setMusicVolume(0.25); // lower during letter for focus
        break;
      case 'scene-final-image':
        window.setMusicVolume(0.6); // raise for emotional ending
        break;
      default:
        window.setMusicVolume(0.45); // default
    }
  }

  // Watch for scene changes to adjust volume
  const sceneObserver = new MutationObserver(() => {
    for (const id of SCENE_IDS) {
      const el = document.getElementById(id);
      if (el && el.classList.contains('active')) {
        adjustMusicForScene(id);
        break;
      }
    }
  });
  SCENE_IDS.forEach(id => {
    const el = document.getElementById(id);
    if (el) sceneObserver.observe(el, { attributes: true, attributeFilter: ['class'] });
  });

  // ---------- Init ----------
  window.addEventListener('resize', () => {
    resizeCanvases();
    buildBalloons();
  });

  // Export globals for other modules
  window.burstConfetti = burstConfetti;
  window.showScene = showScene;

  resizeCanvases();
  initStars();
  drawStars();
  buildBalloons();
  updateConfetti();

})();
