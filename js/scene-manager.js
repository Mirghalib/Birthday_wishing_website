const SCENE_IDS = [
  'scene-intro',
  'scene-celebrate',
  'scene-birthday',
  'scene-moments',
  'scene-letter-closed',
  'scene-letter-open',
  'scene-finale'
];

function showScene(id) {
  SCENE_IDS.forEach(s => {
    document.getElementById(s).classList.toggle('active', s === id);
  });
}

function getActiveScene() {
  for (const id of SCENE_IDS) {
    const el = document.getElementById(id);
    if (el && el.classList.contains('active')) return id;
  }
  return null;
}
