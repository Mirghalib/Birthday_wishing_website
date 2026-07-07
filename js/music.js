// ---------- Hidden background music from user's audio file ----------
(function () {
  'use strict';

  const SRC = 'assets/music/romantic-theme.mp3';
  const DEFAULT_VOLUME = 0.45;
  const FADE_DURATION = 2800;

  let audio = null;
  let started = false;
  let sceneVolume = DEFAULT_VOLUME;
  let pendingPlay = false;

  function createAudio() {
    audio = new Audio();
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0;
    audio.style.cssText = 'position:fixed;left:-9999px;width:1px;height:1px;opacity:0;pointer-events:none;';

    // Set source after constructing so the browser preloads immediately
    audio.src = SRC;
    audio.load(); // explicit load trigger

    document.body.appendChild(audio);

    // error logging
    audio.addEventListener('error', function onErr() {
      console.warn('[music] Load error:', SRC, audio.error ? audio.error.message : 'unknown');
    });
  }

  function fadeIn() {
    if (!audio) return;
    const target = sceneVolume;
    const step = target / (FADE_DURATION / 50);
    let vol = 0;

    function tick() {
      vol = Math.min(target, vol + step);
      audio.volume = vol;
      if (vol < target) setTimeout(tick, 50);
    }
    tick();
  }

  function startMusic() {
    if (started || !audio) return;
    if (pendingPlay) return;
    pendingPlay = true;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.then(function () {
        started = true;
        pendingPlay = false;
        fadeIn();
      }).catch(function () {
        started = false;
        pendingPlay = false;
      });
    } else {
      // Older browsers that don't return a promise
      started = true;
      pendingPlay = false;
      fadeIn();
    }
  }

  function tryAutoplay() {
    if (!audio) createAudio();
    startMusic();
  }

  // Expose scene-based volume control
  window.setMusicVolume = function (val) {
    sceneVolume = val;
    if (audio && started) {
      audio.volume = val;
    }
  };

  // ---------- Init ----------
  createAudio();

  // Attempt autoplay immediately
  tryAutoplay();

  // Fallback: catch first user interaction if autoplay blocked
  var EVENTS = ['click', 'touchstart', 'keydown', 'scroll'];
  var handlers = {};

  function onInteraction(evt) {
    if (started) {
      EVENTS.forEach(function (e) { document.removeEventListener(e, handlers[e]); });
      return;
    }
    startMusic();
  }

  EVENTS.forEach(function (evt) {
    handlers[evt] = onInteraction;
    document.addEventListener(evt, onInteraction, { once: false, passive: true });
  });

})();
