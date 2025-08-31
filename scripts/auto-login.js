const { chromium } = require('playwright');

(async ()=>{
  const base = 'http://localhost:3000';
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  console.log('navigating to login page...');
  await page.goto(base + '/admin/login', { waitUntil: 'networkidle' });
  // give the page a short moment to stabilize
  await page.waitForTimeout(250);
  // Submit credentials using an actual HTML form from the page context so the browser
  // will perform a real POST and follow redirects, allowing HttpOnly cookies to be set.
  // Build and submit the form inside the page, then wait for navigation with Playwright
  try {
    await page.evaluate(() => {
      window.__pw_form_created = false;
      return (async () => {
        const csrfResp = await fetch('/api/auth/csrf');
        const csrfJson = await csrfResp.json();
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/api/auth/callback/credentials';
        const add = (name, value) => { const i = document.createElement('input'); i.type = 'hidden'; i.name = name; i.value = value; form.appendChild(i); }
        add('csrfToken', csrfJson.csrfToken || '');
        add('email', 'admin@icjc.org');
        add('password', 'ChangeMe123!');
        add('callbackUrl', '/admin');
        document.body.appendChild(form);
        window.__pw_form_created = true;
        form.submit();
      })();
    });
  } catch (e) {
    // ignore navigation-related errors and continue to wait
    console.log('evaluate submission caught error (ignored):', String(e));
  }
  // wait for navigation after submit
  try { await page.waitForNavigation({ waitUntil: 'networkidle', timeout: 10000 }); } catch(e) { /* ignore timeout */ }
  // evaluate session endpoint in page context so cookies are sent automatically
  const session = await page.evaluate(async ()=>{
    try { const r = await fetch('/api/auth/session'); return await r.json(); } catch(e){ return { error: String(e) } }
  });
  console.log('session from browser context:', session);
  // also print cookies
  const cookies = await contextCookies(page);
  console.log('cookies:', cookies);
  await browser.close();
  process.exit(0);
})().catch(e=>{ console.error(e); process.exit(1) });

async function contextCookies(page) {
  try {
    const cookies = await page.context().cookies();
    return cookies;
  } catch(e){ return { error: String(e) } }
}
