// ---------- Soft romantic piano music system ----------
(function () {
  'use strict';

  // Use Web Audio API to generate a simple romantic piano-like melody
  // This creates a beautiful ambient piano track without requiring audio files
  let audioCtx = null;
  let isPlaying = false;
  let gainNode = null;
  let masterGain = 0.3;
  let currentTimeout = null;
  let stopped = false;

  // Beautiful romantic chord progression (C major, G major, A minor, F major)
  const CHORDS = [
    [261.63, 329.63, 392.00], // C4, E4, G4
    [392.00, 493.88, 587.33], // G4, B4, D5
    [440.00, 523.25, 659.25], // A4, C5, E5
    [349.23, 440.00, 523.25]  // F4, A4, C5
  ];

  // Additional passing notes for melody
  const MELODY_NOTES = [
    392.00, 440.00, 493.88, 523.25, 587.33, 659.25, 698.46, 783.99,
    659.25, 587.33, 523.25, 493.88, 440.00, 392.00, 349.23, 329.63
  ];

  function initAudio() {
    if (audioCtx) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    gainNode = audioCtx.createGain();
    gainNode.gain.value = masterGain;
    gainNode.connect(audioCtx.destination);
  }

  function playNote(freq, duration, delay, velocity) {
    if (stopped || !audioCtx) return;

    const osc = audioCtx.createOscillator();
    const noteGain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    // Piano-like sound
    osc.type = 'sine';
    osc.frequency.value = freq;

    filter.type = 'lowpass';
    filter.frequency.value = 2000 + Math.random() * 500;
    filter.Q.value = 1;

    const v = velocity || 0.3;
    const now = audioCtx.currentTime + delay;
    noteGain.gain.setValueAtTime(0, now);
    noteGain.gain.linearRampToValueAtTime(v * 0.4, now + 0.01);
    noteGain.gain.linearRampToValueAtTime(v * 0.3, now + 0.1);
    noteGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    // Add a subtle harmonic overtone for richer piano sound
    const osc2 = audioCtx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = freq * 2;
    const gain2 = audioCtx.createGain();
    gain2.gain.setValueAtTime(0, now);
    gain2.gain.linearRampToValueAtTime(v * 0.08, now + 0.01);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.3);

    osc.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(gainNode);

    osc2.connect(gain2);
    gain2.connect(gainNode);

    osc.start(now);
    osc.stop(now + duration);
    osc2.start(now);
    osc2.stop(now + duration);
  }

  function playChord(chord, duration, startDelay, velocity) {
    const v = velocity || 0.2;
    chord.forEach((freq, i) => {
      playNote(freq, duration, startDelay + i * 0.02, v);
    });
  }

  function playArpeggio(chord, duration, startDelay) {
    chord.forEach((freq, i) => {
      playNote(freq, duration * 0.6, startDelay + i * 0.15, 0.15);
    });
  }

  function playMusic() {
    if (stopped || !isPlaying) return;

    const bpm = 70;
    const beatDuration = 60 / bpm;
    let time = 0;

    // Play through chord progression
    for (let cycle = 0; cycle < 4; cycle++) {
      CHORDS.forEach((chord, idx) => {
        // Play chord as soft pad
        playChord(chord, beatDuration * 2.5, time, 0.12);

        // Play arpeggio on the chord
        if (cycle < 2 || idx % 2 === 0) {
          playArpeggio(chord, beatDuration * 2, time + 0.1);
        }

        // Add melody note
        const melodyIdx = (cycle * 4 + idx) % MELODY_NOTES.length;
        const melodyNote = MELODY_NOTES[melodyIdx];
        playNote(melodyNote, beatDuration * 1.5, time + 0.3, 0.1);

        // Add a second melody note for richness
        const melodyIdx2 = (melodyIdx + 2) % MELODY_NOTES.length;
        playNote(MELODY_NOTES[melodyIdx2], beatDuration * 1.8, time + beatDuration * 1.2, 0.08);

        time += beatDuration * 2;
      });
    }

    // Schedule next loop
    const loopDuration = time * 1000;
    currentTimeout = setTimeout(playMusic, loopDuration);
  }

  function toggleMusic() {
    if (!audioCtx) initAudio();
    if (!audioCtx) return;

    if (isPlaying) {
      isPlaying = false;
      stopped = true;
      if (currentTimeout) {
        clearTimeout(currentTimeout);
        currentTimeout = null;
      }
      if (gainNode) {
        gainNode.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      }
      document.getElementById('music-toggle').textContent = '🎵';
    } else {
      isPlaying = true;
      stopped = false;
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      masterGain = 0.3;
      if (gainNode) {
        gainNode.gain.linearRampToValueAtTime(masterGain, audioCtx.currentTime + 0.3);
      }
      document.getElementById('music-toggle').textContent = '🎶';
      playMusic();
    }
  }

  // Set up the music button (DOM is ready since script runs at end of body)
  const musicBtn = document.getElementById('music-toggle');
  if (musicBtn) {
    musicBtn.addEventListener('click', toggleMusic);
  }

  // Expose
  window.toggleMusic = toggleMusic;

})();
