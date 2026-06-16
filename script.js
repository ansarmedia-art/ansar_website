const isAdminPage = document.body.dataset.page === 'admin';
const isDynamicPage = document.body.dataset.page === 'dynamic';
const authButton = document.getElementById('auth-button');
const pageForm = document.getElementById('page-form');
const pageList = document.getElementById('page-list');
const dynamicPageCards = document.getElementById('dynamic-page-cards');

function updateNavActive() {
  const current = document.body.dataset.page;
  document.querySelectorAll('.main-nav a').forEach(link => {
    if (link.href.includes(`${current}.html`)) {
      link.classList.add('active');
    }
  });
}

function setDynamicMenuPages(pages) {
  const menu = document.getElementById('dynamic-pages-menu');
  if (!menu || !pages) return;
  menu.innerHTML = '<a href="more.html">Overview</a>' + pages
    .map(page => `<a href="page.html?slug=${encodeURIComponent(page.slug)}">${page.title}</a>`)
    .join('');
}

function createPageCard(page) {
  const card = document.createElement('div');
  card.className = 'page-card';
  card.innerHTML = `
    <strong>${page.title}</strong>
    <p>${page.subtitle || ''}</p>
    <p><a href="page.html?slug=${encodeURIComponent(page.slug)}">Preview</a></p>
  `;
  return card;
}

async function signInAnonymously() {
  if (!window.auth) return;
  try {
    await window.auth.signInAnonymously();
  } catch (error) {
    console.error('Sign-in error', error);
  }
}

async function loadPages() {
  if (!window.db) return;
  try {
    const snapshot = await window.db.collection('pages').orderBy('createdAt', 'desc').get();
    const pages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    if (pageList) {
      pageList.innerHTML = '';
      if (!pages.length) {
        pageList.textContent = 'No saved pages yet.';
        return;
      }
      pages.forEach(page => pageList.appendChild(createPageCard(page)));
    }
    if (dynamicPageCards) {
      setDynamicMenuPages(pages);
    }
    return pages;
  } catch (error) {
    console.error('Load pages error', error);
  }
}

async function savePage(formData) {
  if (!window.db) return;
  const slug = formData.get('slug').trim().toLowerCase();
  const data = {
    title: formData.get('title').trim(),
    subtitle: formData.get('subtitle').trim(),
    heroImageUrl: formData.get('heroImageUrl').trim(),
    metaDescription: formData.get('metaDescription').trim(),
    keywords: formData.get('keywords').trim(),
    bodyHtml: formData.get('bodyHtml').trim(),
    slug,
    updatedAt: window.firebase.firestore.FieldValue.serverTimestamp(),
    createdAt: window.firebase.firestore.FieldValue.serverTimestamp()
  };
  return window.db.collection('pages').doc(slug).set(data, { merge: true });
}

function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

async function loadDynamicPage() {
  const slug = getQueryParam('slug');
  if (!slug || !window.db) return;
  const pageDoc = await window.db.collection('pages').doc(slug).get();
  if (!pageDoc.exists) {
    document.getElementById('page-body').innerHTML = '<p>Page not found. Please create this page in the admin panel.</p>';
    return;
  }
  const page = pageDoc.data();
  const title = document.getElementById('page-title');
  const body = document.getElementById('page-body');
  if (title) title.textContent = page.title;
  if (body) body.innerHTML = page.bodyHtml || '<p>No page content has been added yet.</p>';
  document.title = page.title;
  document.querySelector('meta[name="description"]').setAttribute('content', page.metaDescription || '');
}

window.addEventListener('load', async () => {
  updateNavActive();
  if (authButton) {
    authButton.addEventListener('click', signInAnonymously);
  }
  if (isAdminPage) {
    if (pageForm) {
      pageForm.addEventListener('submit', async event => {
        event.preventDefault();
        const formData = new FormData(pageForm);
        await savePage(formData);
        await loadPages();
        pageForm.reset();
        alert('Page saved successfully. Refresh or preview the page.');
      });
    }
    await loadPages();
  }
  if (isDynamicPage) {
    await loadDynamicPage();
  }
});
