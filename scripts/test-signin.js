const { URLSearchParams } = require('url')
const fetch = global.fetch || require('node-fetch')

async function run() {
  const base = 'http://localhost:3000'
  console.log('Using MONGODB_URI:', process.env.MONGODB_URI || 'not set (will default to local icjc)')
  // 1) get CSRF token
  const cs = await fetch(base + '/api/auth/csrf')
  const csrfJson = await cs.json()
  console.log('csrf token:', csrfJson.csrfToken ? 'ok' : 'missing')

  // 2) POST credentials
  const params = new URLSearchParams()
  params.append('csrfToken', csrfJson.csrfToken)
  params.append('email', 'admin@icjc.org')
  params.append('password', 'ChangeMe123!')
  params.append('json', 'true')

  const loginRes = await fetch(base + '/api/auth/callback/credentials', {
    method: 'POST',
    body: params,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    redirect: 'manual'
  })
  console.log('login status', loginRes.status)
  // gather Set-Cookie headers from the initial response (node-fetch exposes raw())
  const rawSet = (loginRes.headers && loginRes.headers.raw && loginRes.headers.raw()['set-cookie']) || []
  console.log('set-cookie raw (initial):', rawSet)
  // read body once as text, then try to parse JSON if possible
  let loginText = ''
  try { loginText = await loginRes.text() } catch (e) { loginText = '' }
  let loginJson = null
  try { loginJson = loginText ? JSON.parse(loginText) : null } catch (e) { loginJson = null }
  const followUrl = (loginJson && loginJson.url) || loginRes.headers.get('location')
  console.log('follow URL (if any):', followUrl)

  // 3) normalize Set-Cookie headers and, if the callback returned a follow URL,
  //    request it so the server can complete the auth flow and set the session cookie.

  // We'll try to follow the flow: if the callback returned a URL, request it using any cookies
  // we already received so the server can set the session cookie.
  let combinedRaw = Array.isArray(rawSet) ? rawSet.slice() : rawSet ? [rawSet] : []
  if (followUrl) {
    // send the initial cookies (if any) when following the URL so server can set additional cookies
    const initialPairs = combinedRaw
      .map(s => String(s).match(/([^=;\s,]+=[^;\s,]+)/g))
      .filter(Boolean)
      .flat()
      .join('; ')
    const followRes = await fetch(followUrl, { headers: initialPairs ? { cookie: initialPairs } : undefined, redirect: 'follow' })
    const followRaw = followRes.headers && followRes.headers.raw && followRes.headers.raw()['set-cookie']
    if (followRaw && followRaw.length) combinedRaw = combinedRaw.concat(followRaw)
    console.log('set-cookie raw (follow):', followRaw)
  }

  if (combinedRaw.length) {
    // normalize combinedRaw into a Cookie header (only name=value parts)
    const headerText = combinedRaw.join('; ')
    const pairs = Array.from(headerText.matchAll(/([^=;\s,]+=[^;\s,]+)/g)).map(m => m[1])
    const cookieHeader = pairs.join('; ')
    console.log('sending cookie header preview:', cookieHeader.slice(0,200))
    const sess = await fetch(base + '/api/auth/session', { headers: { cookie: cookieHeader } })
    console.log('session status', sess.status)
    const sessJson = await sess.json()
    console.log('session:', sessJson)
  } else {
    console.log('No cookie to test session. login body preview:\n', loginText.slice(0,1000))
  }
}

run().catch(e=>{ console.error(e); process.exit(1) })
