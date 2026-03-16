/**
 * animations.js
 * Per-section animation sequences using GSAP + ScrollTrigger
 * Tracks played sections to avoid replaying
 */

const Animations = (() => {
  const played = new Set();

  // Boot sequence lines
  function playBoot(onComplete) {
    const screen = document.getElementById('boot-screen');
    if (!screen) { onComplete && onComplete(); return; }

    const lines = screen.querySelectorAll('.boot-line');
    const delays = [0, 300, 600, 900, 1200, 1500, 1800, 2100];

    lines.forEach((line, i) => {
      setTimeout(() => {
        gsap.to(line, { opacity: 1, duration: 0.1 });
      }, delays[i] || i * 300);
    });

    // Dismiss boot screen and show hero
    setTimeout(() => {
      gsap.to(screen, {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.in',
        onComplete: () => {
          screen.style.display = 'none';
          onComplete && onComplete();
        }
      });
    }, 2600);
  }

  // Level 0 — Hero entrance
  function playHero() {
    if (played.has('hero')) return;
    played.add('hero');

    const tl = gsap.timeline({ delay: 0.2 });

    tl.to('#hero-name', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'back.out(1.7)'
    })
    .to('#hero-title', {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power3.out'
    }, '-=0.3')
    .to('#hero-location', {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out'
    }, '-=0.2')
    .to('#hero-links', {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out'
    }, '-=0.2')
    .to('#hero-power-display', {
      opacity: 1,
      duration: 0.5
    }, '-=0.1')
    .call(() => {
      // Animate power meter fill
      const meter = document.getElementById('power-meter-inner');
      if (meter) meter.style.width = '100%';

      // Show over 9000 text after meter fills
      setTimeout(() => {
        const ov9k = document.getElementById('over-9000');
        if (ov9k) {
          ov9k.style.opacity = '1';
          gsap.fromTo(ov9k, { scale: 0.3, opacity: 0 }, {
            scale: 1, opacity: 1,
            duration: 0.7,
            ease: 'back.out(2)'
          });
        }
      }, 2200);
    });

    // Goku flies in from left
    setTimeout(() => {
      const goku = document.getElementById('goku-wrapper');
      if (goku) {
        goku.classList.add('flying');
        goku.style.left = '-20vw';
        goku.style.bottom = '100px';
        setTimeout(() => {
          goku.style.transition = 'left 1.4s cubic-bezier(0.25,0.46,0.45,0.94), bottom 0.8s';
          goku.style.left = '3vw';
          goku.style.bottom = '80px';
          setTimeout(() => {
            goku.classList.remove('flying');
          }, 1600);
        }, 100);
      }
    }, 500);
  }

  // Level 1 — Skills / Scouter
  function playSkills() {
    if (played.has('skills')) return;
    played.add('skills');

    // Activate scan line
    const scanLine = document.getElementById('scouter-scan-line');
    if (scanLine) scanLine.classList.add('active');

    // Reveal skill chips with staggered steps() feel
    const chips = document.querySelectorAll('.skill-chip');
    chips.forEach((chip, i) => {
      setTimeout(() => {
        chip.classList.add('revealed');
      }, i * 80);
    });

    // Animate power bars
    const bars = document.querySelectorAll('.power-bar-inner');
    setTimeout(() => {
      bars.forEach(bar => {
        const target = bar.dataset.target || '80';
        bar.style.width = target + '%';
      });
    }, 800);

    // Show "IT'S OVER 9000"
    setTimeout(() => {
      const itsOver = document.getElementById('its-over');
      if (itsOver) itsOver.classList.add('show');
    }, 2000);

    // Deactivate scan after chips are in
    setTimeout(() => {
      if (scanLine) scanLine.classList.remove('active');
    }, chips.length * 80 + 500);
  }

  // Level 2 — Career Sagas
  function playSagas() {
    if (played.has('sagas')) return;
    played.add('sagas');

    const stops = document.querySelectorAll('.saga-stop');
    stops.forEach((stop, i) => {
      setTimeout(() => {
        stop.classList.add('revealed');
        // Move Goku to each saga stop
        const goku = document.getElementById('goku-wrapper');
        if (goku && window.innerWidth > 768) {
          goku.style.left = (15 + i * 20) + 'vw';
        }
      }, i * 600);
    });
  }

  // Level 3 — Projects
  function playProjects() {
    if (played.has('projects')) return;
    played.add('projects');
    // Cards are revealed by GitHub.js as they load
    // Add a warp/fly-in on existing cards if any
    const cards = document.querySelectorAll('.project-card:not(.revealed)');
    cards.forEach((card, i) => {
      setTimeout(() => card.classList.add('revealed'), i * 100);
    });
  }

  // Level 4 — Education
  function playEducation() {
    if (played.has('education')) return;
    played.add('education');

    const card = document.getElementById('edu-card');
    if (card) card.classList.add('revealed');

    // Animate Kame House
    gsap.fromTo('#kame-house',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    );
  }

  // Level 5 — Dragon Balls
  function playDragonBalls() {
    if (played.has('dragon-balls')) return;
    played.add('dragon-balls');

    // Trigger collection state machine
    if (window.DragonBalls) {
      window.DragonBalls.collectAll();
    }
  }

  // Level 6 — Contact
  function playContact() {
    if (played.has('contact')) return;
    played.add('contact');

    gsap.fromTo('.contact-link',
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.5, stagger: 0.15, ease: 'power3.out' }
    );

    gsap.fromTo('#shenron-contact-svg',
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 1, ease: 'back.out(1.7)' }
    );
  }

  // Master method called from main.js
  function playSection(id) {
    switch (id) {
      case 'hero':         playHero();        break;
      case 'skills':       playSkills();      break;
      case 'sagas':        playSagas();       break;
      case 'projects':     playProjects();    break;
      case 'education':    playEducation();   break;
      case 'dragon-balls-section': playDragonBalls(); break;
      case 'contact':      playContact();     break;
    }
  }

  return { playBoot, playSection, played };
})();

window.Animations = Animations;
