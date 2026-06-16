const FALLBACK_NAV = [
  ['Home', 'index.html', 'primary'],
  ['About', 'page.html?slug=about', 'primary'],
  ['Academics', 'page.html?slug=academics', 'primary'],
  ['Admission', 'page.html?slug=admission', 'primary'],
  ['News', 'news-page.html', 'primary'],
  ['Events', 'events-page.html', 'primary'],
  ['Ansar Sports', 'page.html?slug=ansar-sports', 'more'],
  ['ATL', 'page.html?slug=atl', 'more'],
  ['Ansar Sprouts', 'page.html?slug=ansar-sprouts', 'more'],
  ['Extension Services', 'page.html?slug=extension-services', 'more'],
  ['Life at Ansar', 'page.html?slug=life-at-ansar', 'more'],
  ['Ansar Times', 'page.html?slug=ansar-times', 'more'],
  ['Alumni', 'page.html?slug=alumni', 'more'],
  ['Achievements', 'page.html?slug=achievements', 'more'],
  ['Gallery', 'gallery-page.html', 'more'],
  ['SOP', 'page.html?slug=sop', 'more'],
  ['Mandatory Public Disclosure', 'page.html?slug=mandatory-public-disclosure', 'more'],
  ['Contact Us', 'contact-new.html', 'primary']
].map(([label, href, type], index) => ({ label, href, type, order: index + 1 }));

const FALLBACK_FEATURES = [
  'CCTV-enabled safety',
  'Spacious classrooms with smart boards',
  'Qualified support staff',
  'Digital classrooms',
  'Special play area',
  'Purpose-built advanced labs',
  'Multi-sports play area',
  'Wi-Fi enabled learning environment',
  'Safe school transport'
];

const FALLBACK_LEADERS = [
  ['Shyny Hamza', 'Principal', 'MSc, MA, B.Ed, CIDTT, SET'],
  ['Sajidha Razack', 'Junior Principal', 'Senior Secondary Section'],
  ['Ravya K R', 'Junior Principal', 'Secondary Section'],
  ['Fareeda E Mohammed', 'Junior Principal', 'Middle Section'],
  ['Saleena Kader', 'Junior Principal', 'Primary Section'],
  ['Babitha KN', 'Junior Principal', 'Sprouts']
];

const FALLBACK_PAGES = {
  about: {
    title: 'Welcome to Ansar English School Perumpilavu',
    category: 'About us',
    subtitle: 'A CBSE-affiliated, NABET accredited school shaped by the Ansari Charitable Trust commitment to education, healthcare, and social welfare.',
    heroImageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1400&q=80',
    bodyHtml: '<h2>Our Vision</h2><p>Nurture students to thrive as creative and value-driven citizens in a diverse and rapidly changing world.</p><h2>Our Mission</h2><ul><li>Provide an inclusive learning environment that ensures sustained academic growth.</li><li>Empower students with skills, values, and character.</li><li>Conduct programmes that build 21st century skills.</li></ul>'
  },
  academics: {
    title: 'Academics',
    category: 'Learning',
    subtitle: 'Academic excellence supported by digital classrooms, enrichment programmes, foundational literacy, and future-ready skills.',
    heroImageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1400&q=80',
    bodyHtml: '<p>Use the admin panel to add curriculum details, departments, exam information, annual reports, and academic resources.</p>'
  },
  admission: {
    title: 'Admission',
    category: 'Admissions',
    subtitle: 'Publish procedures, fee structure, prospectus links, TC queries, and admission FAQs directly from the admin panel.',
    heroImageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1400&q=80',
    bodyHtml: '<p>This page is ready for updated admission content from the admin panel.</p>'
  }
};

function dbReady() {
  return new Promise(resolve => {
    const check = () => window.db ? resolve(window.db) : setTimeout(check, 120);
    check();
  });
}

function text(value = '') {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

async function getDocs(collectionName, fallback = []) {
  try {
    const db = await dbReady();
    const snapshot = await db.collection(collectionName).get();
    const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return docs.length ? docs : fallback;
  } catch (error) {
    console.warn(`Using fallback ${collectionName}`, error);
    return fallback;
  }
}

function renderNav(items) {
  const nav = document.querySelector('[data-main-nav]');
  if (!nav) return;
  const ordered = [...items].sort((a, b) => (a.order || 99) - (b.order || 99));
  const primary = ordered.filter(item => item.type !== 'more');
  const more = ordered.filter(item => item.type === 'more');
  nav.innerHTML = `
    ${primary.map(item => `<a href="${text(item.href)}">${text(item.label)}</a>`).join('')}
    <div class="nav-dropdown">
      <button type="button">More</button>
      <div class="dropdown-panel">${more.map(item => `<a href="${text(item.href)}">${text(item.label)}</a>`).join('')}</div>
    </div>`;
}

function setupShell(navItems, settings = {}) {
  renderNav(navItems);
  document.querySelector('[data-nav-toggle]')?.addEventListener('click', () => {
    document.querySelector('[data-main-nav]')?.classList.toggle('open');
  });
  document.querySelector('[data-footer]').innerHTML = `
    <div><strong>${text(settings.schoolName || 'Ansar English School')}</strong><p>${text(settings.address || 'Perumpilavu, Thrissur, Kerala')}</p></div>
    <div class="footer-links"><a href="admin.html">Admin Panel</a><a href="page.html?slug=mandatory-public-disclosure">Mandatory Public Disclosure</a></div>`;
}

function setupAnimations() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('[data-scroll-animate], .feature-card, .content-card, .leader-card').forEach(item => observer.observe(item));
}

function animateCounters() {
  document.querySelectorAll('[data-counter]').forEach(counter => {
    const target = Number(counter.dataset.counter);
    let current = 0;
    const suffix = counter.textContent.includes('+') ? '+' : '';
    const tick = () => {
      current += Math.max(1, Math.ceil(target / 60));
      counter.textContent = `${Math.min(current, target)}${suffix}`;
      if (current < target) requestAnimationFrame(tick);
    };
    tick();
  });
}

async function loadHome() {
  const [carousel, news, events, notices] = await Promise.all([
    getDocs('carousel'),
    getDocs('news'),
    getDocs('events'),
    getDocs('notices')
  ]);

  const activeSlide = carousel.find(item => item.active !== false && item.imageUrl);
  const hero = document.querySelector('[data-hero-media]');
  hero.style.backgroundImage = `url("${text(activeSlide?.imageUrl || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1600&q=80')}")`;
  if (activeSlide?.title) document.querySelector('[data-home-title]').textContent = activeSlide.title;
  if (activeSlide?.description) document.querySelector('[data-home-subtitle]').textContent = activeSlide.description;

  document.querySelector('[data-feature-grid]').innerHTML = FALLBACK_FEATURES.map(feature => `<article class="feature-card"><span></span><h3>${text(feature)}</h3></article>`).join('');

  const updates = [...news.map(item => ({ ...item, kind: 'News' })), ...events.map(item => ({ ...item, kind: 'Event' }))].slice(0, 6);
  document.querySelector('[data-latest-grid]').innerHTML = updates.length ? updates.map(item => `
    <article class="content-card">
      <img src="${text(item.image || item.imageUrl || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=900&q=80')}" alt="">
      <div><span>${text(item.kind)}</span><h3>${text(item.title || 'School update')}</h3><p>${text(item.excerpt || item.description || item.content || '')}</p></div>
    </article>`).join('') : '<p>Latest updates will appear here after they are published from the admin panel.</p>';

  document.querySelector('[data-leader-grid]').innerHTML = FALLBACK_LEADERS.map(([name, role, detail]) => `
    <article class="leader-card"><h3>${text(name)}</h3><p>${text(role)}</p><span>${text(detail)}</span></article>`).join('');

  const notice = notices.find(item => item.active);
  if (notice) showNotice(notice);
  animateCounters();
}

function showNotice(notice) {
  const el = document.querySelector('[data-notice]');
  el.hidden = false;
  el.querySelector('[data-notice-title]').textContent = notice.title || 'Notice';
  el.querySelector('[data-notice-message]').textContent = notice.message || '';
  const link = el.querySelector('[data-notice-link]');
  link.textContent = notice.buttonText || '';
  link.href = notice.buttonUrl || '#';
  link.hidden = !notice.buttonText;
  el.querySelector('[data-notice-close]').addEventListener('click', () => el.hidden = true);
}

function queryParam(name) {
  return new URLSearchParams(location.search).get(name);
}

async function loadDynamicPage() {
  const slug = queryParam('slug') || 'about';
  let page = FALLBACK_PAGES[slug];
  try {
    const db = await dbReady();
    const snap = await db.collection('pages').doc(slug).get();
    if (snap.exists) page = { ...page, ...snap.data() };
  } catch (error) {
    console.warn('Using fallback page', error);
  }

  if (!page) {
    page = {
      title: 'Page coming soon',
      category: 'Ansar English School',
      subtitle: 'This section is ready to be filled from the admin panel.',
      bodyHtml: '<p>Add this page in the admin panel to publish content here.</p>'
    };
  }

  document.title = `${page.title} | Ansar English School`;
  document.querySelector('meta[name="description"]').setAttribute('content', page.subtitle || page.title);
  document.querySelector('[data-page-category]').textContent = page.category || 'School';
  document.querySelector('[data-page-title]').textContent = page.title;
  document.querySelector('[data-page-subtitle]').textContent = page.subtitle || '';
  document.querySelector('[data-page-body]').innerHTML = page.bodyHtml || '<p>Content will be added soon.</p>';
  if (page.heroImageUrl) {
    document.querySelector('[data-page-hero]').style.backgroundImage = `linear-gradient(90deg, rgba(5, 20, 48, .84), rgba(5, 20, 48, .22)), url("${text(page.heroImageUrl)}")`;
  }
}

window.addEventListener('load', async () => {
  const [nav, settingsDocs] = await Promise.all([
    getDocs('navigation', FALLBACK_NAV),
    getDocs('settings')
  ]);
  const general = settingsDocs.find(item => item.id === 'general') || {};
  setupShell(nav, general);
  if (document.body.dataset.page === 'home') await loadHome();
  if (document.body.dataset.page === 'dynamic') await loadDynamicPage();
  setupAnimations();
});
