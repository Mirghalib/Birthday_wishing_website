// ---------- Button ripple effects, heart burst on interaction ----------
(function () {
  'use strict';

  // Ripple effect on buttons
  document.addEventListener('click', e => {
    const btn = e.target.closest('.btn');
    if (!btn) return;

    const ripple = document.createElement('span');
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: rgba(255,255,255,0.3);
      transform: scale(0);
      animation: ripple 0.6s ease-out forwards;
      pointer-events: none;
    `;

    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.appendChild(ripple);

    setTimeout(() => {
      if (ripple.parentNode) ripple.parentNode.removeChild(ripple);
    }, 700);
  });

  // Heart burst on scene transitions
  function burstHeartsOnButton(label) {
    const targets = document.querySelectorAll('.btn');
    targets.forEach(btn => {
      if (btn.textContent.includes(label)) {
        btn.addEventListener('click', () => {
          const rect = btn.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;

          // Create floating hearts
          for (let i = 0; i < 6; i++) {
            const heart = document.createElement('div');
            heart.textContent = '♥';
            heart.style.cssText = `
              position: fixed;
              left: ${cx}px;
              top: ${cy}px;
              font-size: ${12 + Math.random() * 10}px;
              color: ${['#ff5d9e', '#ff3d8f', '#ff8fc0', '#ffd166'][Math.floor(Math.random() * 4)]};
              pointer-events: none;
              z-index: 9999;
              animation: floatUp ${1 + Math.random()}s ease-out forwards;
              opacity: 0.8;
            `;
            document.body.appendChild(heart);
            setTimeout(() => {
              if (heart.parentNode) heart.parentNode.removeChild(heart);
            }, 1500);
          }
        });
      }
    });
  }

  burstHeartsOnButton('Celebrate');
  burstHeartsOnButton('Moments');
  burstHeartsOnButton('Last');

})();
