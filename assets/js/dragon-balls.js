/**
 * dragon-balls.js
 * 7-ball collection state machine
 * Fires Shenron reveal when all 7 are collected
 */

const DragonBalls = (() => {
  const TOTAL = 7;
  const collected = new Set();
  let shenronFired = false;

  function collect(n) {
    if (n < 1 || n > TOTAL) return;
    if (collected.has(n)) return;

    collected.add(n);
    updateBallUI(n);
    updateHUDPower();

    if (collected.size === TOTAL && !shenronFired) {
      shenronFired = true;
      setTimeout(fireShenron, 800);
    }
  }

  function collectAll() {
    // Stagger collection of all 7 for visual effect
    for (let i = 1; i <= TOTAL; i++) {
      setTimeout(() => collect(i), (i - 1) * 200);
    }
  }

  function updateBallUI(n) {
    const el = document.querySelector(`.dragon-ball-item[data-ball="${n}"]`);
    if (!el) return;
    el.classList.add('collected');

    // Pulse the ball
    const ball = el.querySelector('.dragon-ball');
    if (ball) {
      ball.style.animation = 'db-collect-pulse 0.5s ease-out';
      setTimeout(() => {
        ball.style.animation = '';
      }, 600);
    }
  }

  function updateHUDPower() {
    const pct = (collected.size / TOTAL) * 100;
    const bar = document.getElementById('hud-power-bar-inner');
    if (bar) bar.style.width = pct + '%';
  }

  function fireShenron() {
    const seq = document.getElementById('shenron-sequence');
    if (!seq) return;

    seq.classList.add('active');

    // Create sparkles
    const colors = ['#f7d000', '#f5821f', '#00d4ff', '#ffffff', '#2dce89'];
    for (let i = 0; i < 30; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';
      const tx = (Math.random() - 0.5) * 300;
      const ty = -(Math.random() * 200 + 50);
      const dur = (Math.random() * 2 + 1.5).toFixed(1) + 's';
      const delay = (Math.random() * 1.5).toFixed(2) + 's';
      const size = Math.floor(Math.random() * 8 + 4) + 'px';
      const color = colors[Math.floor(Math.random() * colors.length)];
      sparkle.style.cssText = `
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        width: ${size};
        height: ${size};
        background: ${color};
        box-shadow: 0 0 10px ${color};
        --tx: ${tx}px;
        --ty: ${ty}px;
        --dur: ${dur};
        --delay: ${delay};
      `;
      seq.appendChild(sparkle);
    }

    // Auto-dismiss after 8 seconds (or user can close)
    // The close button handles manual dismiss
  }

  function closeShenron() {
    const seq = document.getElementById('shenron-sequence');
    if (!seq) return;
    seq.classList.remove('active');
    // Remove sparkles
    seq.querySelectorAll('.sparkle').forEach(s => s.remove());
    // Scroll to contact
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  }

  function getCollected() {
    return collected.size;
  }

  function isAllCollected() {
    return collected.size === TOTAL;
  }

  // Expose globally
  return { collect, collectAll, closeShenron, getCollected, isAllCollected };
})();

window.DragonBalls = DragonBalls;
