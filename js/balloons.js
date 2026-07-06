const balloonColors = ['#ff5d9e','#8a4dff','#ffd166','#5cc8ff','#4dd0a1','#ff8fc0','#a06bff','#ffb238'];
const balloonRow = document.getElementById('balloon-row');

function buildBalloons() {
  balloonRow.innerHTML = '';
  const count = window.innerWidth < 500 ? 10 : 18;
  for (let i = 0; i < count; i++) {
    const b = document.createElement('div');
    b.className = 'balloon';
    b.style.background = balloonColors[i % balloonColors.length];
    b.style.animationDelay = (i * 0.18) + 's';
    balloonRow.appendChild(b);
  }
}
