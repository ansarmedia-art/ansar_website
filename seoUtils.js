const SITE_URL = 'https://ansarschool.in';
const DEFAULT_IMAGE = `${SITE_URL}/ansar-logo.png`;

function setMetaTag(selector, attributes) {
  let tag = document.head.querySelector(selector);
  if (!tag) {
    tag = document.createElement('meta');
    document.head.appendChild(tag);
  }
  Object.entries(attributes).forEach(([key, value]) => tag.setAttribute(key, value));
}

function setLinkTag(selector, attributes) {
  let tag = document.head.querySelector(selector);
  if (!tag) {
    tag = document.createElement('link');
    document.head.appendChild(tag);
  }
  Object.entries(attributes).forEach(([key, value]) => tag.setAttribute(key, value));
}

export function createMetaDescription(value, fallback = '') {
  const plainText = String(value || fallback)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return plainText.length > 160 ? `${plainText.slice(0, 157).trim()}...` : plainText;
}

export function applySeoMetadata({ title, description, keywords = '', noIndex = false, imageUrl = DEFAULT_IMAGE }, pathname = window.location.pathname) {
  const canonicalPath = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
  const canonicalUrl = `${SITE_URL}${canonicalPath}`;
  const robots = noIndex
    ? 'noindex, nofollow, noarchive'
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

  document.title = title;
  setMetaTag('meta[name="description"]', { name: 'description', content: description });
  setMetaTag('meta[name="keywords"]', { name: 'keywords', content: keywords });
  setMetaTag('meta[name="robots"]', { name: 'robots', content: robots });
  setLinkTag('link[rel="canonical"]', { rel: 'canonical', href: canonicalUrl });
  setMetaTag('meta[property="og:title"]', { property: 'og:title', content: title });
  setMetaTag('meta[property="og:description"]', { property: 'og:description', content: description });
  setMetaTag('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
  setMetaTag('meta[property="og:image"]', { property: 'og:image', content: imageUrl });
  setMetaTag('meta[name="twitter:title"]', { name: 'twitter:title', content: title });
  setMetaTag('meta[name="twitter:description"]', { name: 'twitter:description', content: description });
  setMetaTag('meta[name="twitter:image"]', { name: 'twitter:image', content: imageUrl });
}
