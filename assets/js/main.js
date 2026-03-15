/**
 * main.js
 * Entry point — wires up GSAP ScrollTrigger, HUD, Goku movement,
 * section activations, mobile detection, nav menu
 */

// ── GSAP registration ───────────────────────────────────────
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ── Globals ──────────────────────────────────────────────────
const IS_MOBILE = () => window.innerWidth <= 768;

const SECTIONS = [
  { id: 'hero',                 label: 'LV.0  TITLE SCREEN',    power: 14 },
  { id: 'skills',               label: 'LV.1  POWER SCOUTER',   power: 28 },
  { id: 'sagas',                label: 'LV.2  CAREER SAGAS',    power: 50 },
  { id: 'projects',             label: 'LV.3  SPECIAL MOVES',   power: 67 },
  { id: 'education',            label: 'LV.4  TRAINING ARC',    power: 80 },
  { id: 'dragon-balls-section', label: 'LV.5  DRAGON BALLS',    power: 95 },
  { id: 'contact',              label: 'LV.6  SUMMON SHENRON',  power: 100 },
];

// Goku x-positions per section (% from left, desktop only)
const GOKU_STOPS = {
  'hero':                 '10vw',
  'skills':               '60vw',
  'sagas':                '15vw',
  'projects':             '65vw',
  'education':            '20vw',
  'dragon-balls-section': '55vw',
  'contact':              '40vw',
};

let currentSection = null;
let navOpen = false;

// ── HUD Setup ────────────────────────────────────────────────
function buildHUD() {
  const dotsContainer = document.getElementById('hud-dots');
  if (!dotsContainer) return;

  SECTIONS.forEach((sec) => {
    const dot = document.createElement('div');
    dot.className = 'hud-dot';
    dot.title = sec.label;
    dot.dataset.section = sec.id;
    dot.addEventListener('click', () => {
      document.getElementById(sec.id)?.scrollIntoView({ behavior: 'smooth' });
    });
    dotsContainer.appendChild(dot);
  });
}

function activateSection(id) {
  if (currentSection === id) return;
  currentSection = id;

  const sec = SECTIONS.find(s => s.id === id);
  if (!sec) return;

  // HUD level label
  const levelEl = document.getElementById('hud-level');
  if (levelEl) levelEl.textContent = sec.label;

  // HUD power bar
  const bar = document.getElementById('hud-power-bar-inner');
  if (bar) bar.style.width = sec.power + '%';

  // HUD dots
  const dots = document.querySelectorAll('.hud-dot');
  dots.forEach(dot => {
    dot.classList.remove('active');
    const didx = SECTIONS.findIndex(s => s.id === dot.dataset.section);
    const cidx = SECTIONS.findIndex(s => s.id === id);
    if (dot.dataset.section === id) {
      dot.classList.add('active');
    } else if (didx < cidx) {
      dot.classList.add('visited');
    }
  });

  // Move Goku (desktop)
  if (!IS_MOBILE()) {
    moveGoku(id);
  }

  // Play section animations
  if (window.Animations) {
    Animations.playSection(id);
  }
}

function moveGoku(sectionId) {
  const goku = document.getElementById('goku-wrapper');
  if (!goku) return;

  const targetX = GOKU_STOPS[sectionId] || '10vw';

  // Brief fly animation
  goku.classList.add('flying');
  goku.style.left = targetX;

  setTimeout(() => {
    goku.classList.remove('flying');
  }, 1200);
}

// ── ScrollTrigger wiring ─────────────────────────────────────
function setupScrollTriggers() {
  SECTIONS.forEach(sec => {
    const el = document.getElementById(sec.id);
    if (!el) return;

    ScrollTrigger.create({
      trigger: el,
      start: 'top 60%',
      end: 'bottom 40%',
      onEnter: () => activateSection(sec.id),
      onEnterBack: () => activateSection(sec.id),
    });
  });

  // Parallax on ground (subtle)
  ScrollTrigger.create({
    trigger: document.body,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: self => {
      const ground = document.getElementById('ground');
      if (ground) {
        ground.style.transform = `translateX(${self.progress * -40}px)`;
      }
    }
  });
}

// ── Nav menu ─────────────────────────────────────────────────
function buildNavMenu() {
  const menu = document.getElementById('nav-menu');
  if (!menu) return;

  SECTIONS.forEach(sec => {
    const a = document.createElement('a');
    a.className = 'nav-item';
    a.textContent = sec.label;
    a.href = '#' + sec.id;
    a.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById(sec.id)?.scrollIntoView({ behavior: 'smooth' });
      toggleNav(false);
    });
    menu.appendChild(a);
  });
}

function toggleNav(force) {
  navOpen = typeof force === 'boolean' ? force : !navOpen;
  const menu = document.getElementById('nav-menu');
  const btn = document.getElementById('hud-menu-toggle');
  if (menu) menu.classList.toggle('open', navOpen);
  if (btn) btn.textContent = navOpen ? '[ CLOSE ]' : '[ MENU ]';
}

// Close nav on outside click
document.addEventListener('click', (e) => {
  const menu = document.getElementById('nav-menu');
  const btn = document.getElementById('hud-menu-toggle');
  if (navOpen && menu && !menu.contains(e.target) && e.target !== btn) {
    toggleNav(false);
  }
});

// ── GitHub Projects ──────────────────────────────────────────
function initGitHub() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  if (window.GitHub) {
    GitHub.render(grid).catch(err => {
      console.warn('GitHub render error:', err);
    });
  }
}

// ── Shenron close button ─────────────────────────────────────
function initShenronClose() {
  const btn = document.getElementById('shenron-close-btn');
  if (btn && window.DragonBalls) {
    btn.addEventListener('click', () => DragonBalls.closeShenron());
  }
}

// ── Keyboard nav ─────────────────────────────────────────────
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navOpen) toggleNav(false);
  if (e.key === 'Escape') {
    if (window.DragonBalls) DragonBalls.closeShenron();
  }
});

// ── Boot sequence → hero ─────────────────────────────────────
function startBoot() {
  if (window.Animations) {
    Animations.playBoot(() => {
      // Hero animations play via ScrollTrigger onEnter
      // But if already at top, trigger manually
      activateSection('hero');
    });
  } else {
    const screen = document.getElementById('boot-screen');
    if (screen) screen.style.display = 'none';
    activateSection('hero');
  }
}

// ── Init ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  buildHUD();
  buildNavMenu();
  setupScrollTriggers();
  initGitHub();
  initShenronClose();

  // Wire menu toggle button
  const menuBtn = document.getElementById('hud-menu-toggle');
  if (menuBtn) menuBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleNav(); });

  // Start boot
  startBoot();

  // Scroll hint visibility
  let scrolled = false;
  window.addEventListener('scroll', () => {
    if (!scrolled && window.scrollY > 100) {
      scrolled = true;
      const hint = document.getElementById('scroll-hint');
      if (hint) hint.style.display = 'none';
    }
  }, { passive: true });
});
