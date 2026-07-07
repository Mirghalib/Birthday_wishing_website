// ---------- Memory slideshow: 6 images with unique transitions ----------
(function () {
  'use strict';

  const TRANSITIONS = [
    'trans-fade',
    'trans-zoom-in',
    'trans-zoom-out',
    'trans-ken-burns',
    'trans-pan',
    'trans-blur'
  ];

  let currentIndex = 0;
  let timer = null;
  let running = false;

  function initSlideshow() {
    const slides = document.querySelectorAll('.card-slide');
    if (!slides.length || running) return;
    running = true;

    // Lazy load images
    slides.forEach(slide => {
      const img = slide.querySelector('.slide-img');
      if (img && img.dataset.src) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      }
    });

    showSlide(0);
    scheduleNext();
  }

  function showSlide(index) {
    const slides = document.querySelectorAll('.card-slide');
    slides.forEach((s, i) => {
      s.classList.remove('active', ...TRANSITIONS.map(t => t));
      if (i === index) {
        s.classList.add('active', TRANSITIONS[index % TRANSITIONS.length]);
      }
    });
    currentIndex = index;
    const counter = document.getElementById('slide-current');
    if (counter) counter.textContent = index + 1;
    startProgressBar();
  }

  function scheduleNext() {
    if (timer) clearTimeout(timer);
    if (!running) return;
    timer = setTimeout(nextSlide, 3000);
  }

  function nextSlide() {
    if (!running) return;
    const next = (currentIndex + 1) % 6;
    showSlide(next);
    scheduleNext();
  }

  function startProgressBar() {
    const bar = document.getElementById('slide-progress-bar');
    if (!bar) return;
    bar.style.transition = 'none';
    bar.style.width = '0%';
    bar.offsetHeight; // force reflow
    bar.style.transition = 'width 3s linear';
    bar.style.width = '100%';
  }

  function stopSlideshow() {
    running = false;
    if (timer) { clearTimeout(timer); timer = null; }
  }

  // Observe moments scene activation
  const momentsScene = document.getElementById('scene-moments');
  const observer = new MutationObserver(() => {
    if (momentsScene && momentsScene.classList.contains('active')) {
      initSlideshow();
    } else if (momentsScene && !momentsScene.classList.contains('active')) {
      stopSlideshow();
    }
  });
  if (momentsScene) {
    observer.observe(momentsScene, { attributes: true, attributeFilter: ['class'] });
    if (momentsScene.classList.contains('active')) initSlideshow();
  }

})();
