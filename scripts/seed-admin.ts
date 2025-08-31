// prefer bcrypt but fall back to bcryptjs to avoid native binding issues in dev
let bcrypt: any
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  bcrypt = require('bcrypt')
} catch (e) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  bcrypt = require('bcryptjs')
}
import { connect } from '../lib/db'
import User from '../models/User'

async function run() {
  await connect()
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@icjc.org'
  const pwd = process.env.SEED_ADMIN_PWD || 'ChangeMe123!'
  const hash = await bcrypt.hash(pwd, 10)
  const existing = await User.findOne({ email })
  if (existing) {
    console.log('Admin already exists:', email)
    return
  }
  const u = new User({ name: 'Admin', email, passwordHash: hash, roles: ['admin'] })
  await u.save()
  console.log('Admin created:', email)
}

run().catch((e) => { console.error(e); process.exit(1) })
