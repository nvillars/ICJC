"use strict"
const { default: User } = require('../../../../models/User')
const { connect } = require('../../../../lib/db')
const bcrypt = require('bcrypt')

/**
 * Dev-only login helper. Enabled when NODE_ENV !== 'production' or DEV_DEBUG_LOGIN=true.
 * POST { email, password } -> { ok, user }
 */
export async function POST(req) {
  if (process.env.NODE_ENV === 'production' && !process.env.DEV_DEBUG_LOGIN) {
    return new Response(JSON.stringify({ error: 'not available' }), { status: 404 })
  }
  try {
    const body = await req.json()
    const { email, password } = body || {}
    if (!email || !password) return new Response(JSON.stringify({ error: 'missing' }), { status: 400 })
    await connect()
    const user = await User.findOne({ email }).lean()
    if (!user || !user.passwordHash) return new Response(JSON.stringify({ ok: false }), { status: 401 })
    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) return new Response(JSON.stringify({ ok: false }), { status: 401 })
    const safe = { id: user._id.toString(), email: user.email, name: user.name, roles: user.roles || [] }
    return new Response(JSON.stringify({ ok: true, user: safe }), { status: 200 })
  } catch (e) {
    /* eslint-disable-next-line no-console */
    console.debug('debug-login error', e)
    return new Response(JSON.stringify({ error: 'server' }), { status: 500 })
  }
}
