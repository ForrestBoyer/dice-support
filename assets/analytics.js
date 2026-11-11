(() => {
  'use strict';
  const origin = 'https://forrestboyer.github.io';
  const base = '/dice-support/';
  if (location.origin !== origin || !location.pathname.startsWith(base)) return;
  if (navigator.doNotTrack === '1' || navigator.globalPrivacyControl === true) return;

  const endpoint = 'https://forrest-website-production.up.railway.app/api/dice-analytics/collect';
  const sources = new Set(['instagram', 'tiktok', 'facebook', 'other', 'direct-or-unknown']);
  const params = new URLSearchParams(location.search);
  let source = params.get('from') || params.get('utm_source');
  if (!sources.has(source)) {
    source = 'direct-or-unknown';
    try {
      const referrer = new URL(document.referrer);
      if (referrer.origin !== origin) {
        source = 'other';
        for (const platform of ['instagram', 'tiktok', 'facebook']) {
          if (referrer.hostname === `${platform}.com` || referrer.hostname.endsWith(`.${platform}.com`)) source = platform;
        }
      }
    } catch { /* Missing referrers stay unattributed. */ }
  }

  function pageFor(path) {
    if (path === base || path === `${base}index.html`) return 'support';
    for (const page of ['links', 'privacy']) {
      if (path === `${base}${page}/` || path === `${base}${page}/index.html`) return page;
    }
    return null;
  }
  const page = pageFor(location.pathname);
  if (!page) return;

  function record(event) {
    // Delivery must never delay navigation, and failures must not break a link.
    try {
      fetch(endpoint, {
        method: 'POST',
        body: new URLSearchParams({ source, page, event }),
        keepalive: true,
        credentials: 'omit',
        referrerPolicy: 'no-referrer',
      }).catch(() => {});
    } catch { /* Navigation and privacy tools may prevent delivery. */ }
  }

  const campaigns = new Map([['instagram', 'instagram'], ['tiktok', 'tiktok'], ['facebook', 'Facebook']]);
  for (const link of document.querySelectorAll('a[href]')) {
    const url = new URL(link.href, location.href);
    if (url.hostname === 'apps.apple.com' && url.pathname === '/app/apple-store/id6825166222' && campaigns.has(source)) {
      url.searchParams.set('pt', '129653631');
      url.searchParams.set('ct', campaigns.get(source));
      url.searchParams.set('mt', '8');
      link.href = url.href;
    }
    if (url.origin === origin && pageFor(url.pathname) && !url.hash) {
      url.searchParams.set('from', source);
      link.href = url.href;
    }
  }

  let viewed = false;
  function recordView() {
    if (!viewed && document.visibilityState === 'visible') {
      viewed = true;
      record('pageview');
    }
  }
  recordView();
  document.addEventListener('visibilitychange', recordView);

  function recordClick(event) {
    if (event.type === 'auxclick' && event.button !== 1) return;
    const link = event.target.closest?.('a[href]');
    if (!link) return;
    const url = new URL(link.href, location.href);
    if (url.protocol === 'mailto:') return record('email');
    if (url.hostname === 'apps.apple.com') return record('app-store');
    for (const platform of ['instagram', 'tiktok', 'facebook']) {
      if (url.hostname === `${platform}.com` || url.hostname.endsWith(`.${platform}.com`)) return record(platform);
    }
    if (url.origin === origin && !url.hash) {
      const destination = pageFor(url.pathname);
      if (destination) record(destination);
    }
  }
  document.addEventListener('click', recordClick);
  document.addEventListener('auxclick', recordClick);
})();
