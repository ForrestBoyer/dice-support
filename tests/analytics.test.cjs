const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { runInNewContext } = require('node:vm');
const script = readFileSync(new URL('../assets/analytics.js', `file://${__filename}`), 'utf8');

function visit({ url = 'https://forrestboyer.github.io/dice-support/links/?from=instagram', referrer = '', navigator = {}, visible = true, failing = false } = {}) {
  const calls = [];
  const handlers = {};
  const help = { href: 'https://forrestboyer.github.io/dice-support/privacy/' };
  const document = {
    referrer, visibilityState: visible ? 'visible' : 'hidden',
    querySelectorAll: () => [help],
    addEventListener: (name, handler) => { handlers[name] = handler; },
  };
  runInNewContext(script, {
    URL, URLSearchParams, location: new URL(url), document, navigator,
    fetch: (endpoint, options) => {
      calls.push({ endpoint, options, payload: Object.fromEntries(options.body) });
      return failing ? Promise.reject(new Error('blocked')) : Promise.resolve();
    },
  });
  const click = (href, type = 'click', button = 0) => handlers[type]?.({ type, button, target: { closest: () => ({ href }) } });
  return { calls, handlers, document, help, click };
}

test('sends only fixed labels, preserves source internally and records a nested-link click', () => {
  const v = visit({ url: 'https://forrestboyer.github.io/dice-support/links/?from=tiktok&email=private@example.com#secret' });
  assert.deepEqual(v.calls[0].payload, { source: 'tiktok', page: 'links', event: 'pageview' });
  assert.match(v.help.href, /from=tiktok$/);
  v.click('https://apps.apple.com/app/id123?ct=private');
  assert.deepEqual(v.calls[1].payload, { source: 'tiktok', page: 'links', event: 'app-store' });
  assert.equal(v.calls[1].options.keepalive, true);
  assert.equal(v.calls[1].options.credentials, 'omit');
  assert.equal(v.calls[1].options.referrerPolicy, 'no-referrer');
});

test('uses known referrer hostnames and rejects lookalike hosts and arbitrary source text', () => {
  for (const [referrer, source] of [
    ['https://l.instagram.com/path?secret=1', 'instagram'],
    ['https://facebook.com.evil.example/', 'other'], ['', 'direct-or-unknown'],
  ]) {
    const v = visit({ url: 'https://forrestboyer.github.io/dice-support/?from=private@example.com', referrer });
    assert.equal(v.calls[0].payload.source, source);
    assert.equal(v.calls[0].payload.page, 'support');
  }
});

test('does not collect from local previews or opted-out browsers', () => {
  for (const options of [{ url: 'http://localhost:8080/links/' }, { navigator: { doNotTrack: '1' } }, { navigator: { globalPrivacyControl: true } }]) {
    assert.equal(visit(options).calls.length, 0);
  }
});

test('waits for visibility and records one view despite tab switching', () => {
  const v = visit({ visible: false });
  assert.equal(v.calls.length, 0);
  v.document.visibilityState = 'visible';
  v.handlers.visibilitychange();
  v.handlers.visibilitychange();
  assert.equal(v.calls.length, 1);
});

test('counts middle clicks but not context menus, fragment navigation or unrelated links', () => {
  const v = visit();
  v.click('https://tiktok.com/@dice49586', 'auxclick', 1);
  v.click('https://tiktok.com/@dice49586', 'auxclick', 2);
  v.click('https://forrestboyer.github.io/dice-support/links/#main');
  v.click('https://unrelated.example/');
  assert.deepEqual(v.calls.map(call => call.payload.event), ['pageview', 'tiktok']);
});

test('network failures never throw into navigation or retry counts', async () => {
  const v = visit({ failing: true });
  v.click('https://instagram.com/diceappclips');
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(v.calls.length, 2);
});
