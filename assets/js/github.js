/**
 * github.js
 * Fetches GitHub repos for 'stumey'
 * Renders featured cards + additional repos
 * Skeleton loaders while fetching, fallback if API fails
 */

const GitHub = (() => {
  const USERNAME = 'stumey';
  const API_URL = `https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`;
  const CACHE_KEY = 'gh_repos_stumey';
  const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

  const FEATURED = ['saprism', 'encore', 'crypto-lottery', 'UberClone', 'k8s-playground'];

  const FEATURED_META = {
    'saprism': {
      description: 'A .NET microservices platform for SAP-adjacent mortgage processing, featuring contract-first API design and distributed architecture.',
      tags: ['C#', '.NET', 'Microservices', 'REST'],
      move: 'KAMEHAMEHA STRIKE'
    },
    'encore': {
      description: 'Event-driven workflow engine built to orchestrate complex mortgage origination pipelines with retry logic and observability hooks.',
      tags: ['Node.js', 'Event-Driven', 'AWS', 'Orchestration'],
      move: 'FINAL FLASH'
    },
    'crypto-lottery': {
      description: 'Decentralized lottery smart contract on Ethereum — transparent, trustless random number generation using Chainlink VRF.',
      tags: ['Solidity', 'Ethereum', 'Chainlink', 'Web3'],
      move: 'SPIRIT BOMB'
    },
    'UberClone': {
      description: 'Full-stack ride-sharing app clone with real-time driver tracking, fare calculation, and user/driver authentication flows.',
      tags: ['Node.js', 'Socket.io', 'Maps API', 'MongoDB'],
      move: 'DESTRUCTO DISK'
    },
    'k8s-playground': {
      description: 'Hands-on Kubernetes lab environment — manifests, Helm charts, and runbooks for exploring cluster administration, networking, and scaling patterns.',
      tags: ['Kubernetes', 'Helm', 'Docker', 'DevOps'],
      move: 'SOLAR FLARE'
    }
  };

  const FALLBACK_REPOS = [
    { name: 'saprism',        description: 'SAP-adjacent microservices platform for mortgage processing', stargazers_count: 0, language: 'C#',         html_url: `https://github.com/${USERNAME}/saprism` },
    { name: 'encore',         description: 'Event-driven workflow orchestration engine',                  stargazers_count: 0, language: 'JavaScript',   html_url: `https://github.com/${USERNAME}/encore` },
    { name: 'crypto-lottery', description: 'Decentralized Ethereum lottery with Chainlink VRF',           stargazers_count: 2, language: 'Solidity',     html_url: `https://github.com/${USERNAME}/crypto-lottery` },
    { name: 'UberClone',      description: 'Full-stack ride-sharing application with real-time tracking', stargazers_count: 1, language: 'JavaScript',   html_url: `https://github.com/${USERNAME}/UberClone` },
    { name: 'k8s-playground', description: 'Kubernetes lab environment with manifests and Helm charts',   stargazers_count: 0, language: 'YAML',         html_url: `https://github.com/${USERNAME}/k8s-playground` },
  ];

  function getCached() {
    try {
      const raw = sessionStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const { ts, data } = JSON.parse(raw);
      if (Date.now() - ts > CACHE_TTL) {
        sessionStorage.removeItem(CACHE_KEY);
        return null;
      }
      return data;
    } catch {
      return null;
    }
  }

  function setCache(data) {
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
    } catch { /* ignore quota errors */ }
  }

  function getLanguageColor(lang) {
    const colors = {
      'JavaScript': '#f1e05a', 'TypeScript': '#3178c6', 'C#': '#178600',
      'Python': '#3572A5', 'HTML': '#e34c26', 'CSS': '#563d7c',
      'Go': '#00ADD8', 'Rust': '#dea584', 'Solidity': '#AA6746',
      'Java': '#b07219', 'Shell': '#89e051',
    };
    return colors[lang] || '#aaaaaa';
  }

  function buildFeaturedCard(repo) {
    const meta = FEATURED_META[repo.name] || {};
    const desc = meta.description || repo.description || 'A featured project.';
    const tags = meta.tags || (repo.language ? [repo.language] : []);
    const move = meta.move || 'SPECIAL MOVE';
    const stars = repo.stargazers_count || 0;
    const url = repo.html_url || `https://github.com/${USERNAME}/${repo.name}`;

    const card = document.createElement('a');
    card.className = 'project-card featured';
    card.href = url;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    card.setAttribute('data-name', repo.name);

    card.innerHTML = `
      <div class="kamehameha-hover"></div>
      <div class="project-move-label">${move}</div>
      <div class="project-name">${repo.name}</div>
      <div class="project-desc">${desc}</div>
      <div class="project-tags">
        ${tags.map(t => `<span class="project-tag">${t}</span>`).join('')}
      </div>
      ${stars > 0 ? `<div class="project-stars">★ ${stars}</div>` : ''}
    `;
    return card;
  }

  function buildRepoCard(repo) {
    const card = document.createElement('a');
    card.className = 'project-card';
    card.href = repo.html_url;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    card.setAttribute('data-name', repo.name);

    const langColor = getLanguageColor(repo.language);
    const stars = repo.stargazers_count || 0;

    card.innerHTML = `
      <div class="kamehameha-hover"></div>
      <div class="project-move-label">SUPPORT MOVE</div>
      <div class="project-name">${repo.name}</div>
      <div class="project-desc">${repo.description || 'A repository by Stefan Tumey.'}</div>
      <div class="project-tags">
        ${repo.language ? `<span class="project-tag" style="border-color:${langColor};color:${langColor}">${repo.language}</span>` : ''}
      </div>
      ${stars > 0 ? `<div class="project-stars">★ ${stars}</div>` : ''}
    `;
    return card;
  }

  function renderSkeletons(container, count) {
    for (let i = 0; i < count; i++) {
      const sk = document.createElement('div');
      sk.className = 'skeleton-card';
      sk.innerHTML = `
        <div class="skeleton skeleton-line w-60" style="height:18px;margin-bottom:14px"></div>
        <div class="skeleton skeleton-line w-80"></div>
        <div class="skeleton skeleton-line w-80"></div>
        <div class="skeleton skeleton-line w-40" style="margin-top:16px"></div>
      `;
      container.appendChild(sk);
    }
  }

  function clearSkeletons(container) {
    container.querySelectorAll('.skeleton-card').forEach(s => s.remove());
  }

  async function fetchRepos() {
    const cached = getCached();
    if (cached) return cached;

    const resp = await fetch(API_URL, {
      headers: { 'Accept': 'application/vnd.github.v3+json' }
    });
    if (!resp.ok) throw new Error(`GitHub API ${resp.status}`);
    const data = await resp.json();
    setCache(data);
    return data;
  }

  async function render(gridEl) {
    if (!gridEl) return;

    // Show 5 skeletons while loading (one per featured repo)
    renderSkeletons(gridEl, 5);

    let repos;
    try {
      repos = await fetchRepos();
    } catch (err) {
      console.warn('GitHub API failed, using fallback:', err.message);
      repos = FALLBACK_REPOS;
    }

    clearSkeletons(gridEl);

    // Collect only the 5 featured repos (in order), falling back to hardcoded data
    const featuredRepos = FEATURED.map(name => {
      const found = repos.find(r => r.name === name);
      return found || FALLBACK_REPOS.find(r => r.name === name);
    }).filter(Boolean);

    const allCards = [];

    featuredRepos.forEach(repo => {
      const card = buildFeaturedCard(repo);
      gridEl.appendChild(card);
      allCards.push(card);
    });

    // Trigger reveal animations staggered
    allCards.forEach((card, i) => {
      setTimeout(() => {
        card.classList.add('revealed');
      }, i * 80);
    });

    return allCards;
  }

  return { render, FEATURED };
})();

window.GitHub = GitHub;
