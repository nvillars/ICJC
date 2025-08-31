const path = require('path')
// ensure app root is in module paths
const root = path.join(__dirname, '..')
process.chdir(root)

const mongoose = require('mongoose')
const MONGODB_URI = process.env.MONGODB_URI || ''

async function connect() {
  const uri = MONGODB_URI || 'mongodb://127.0.0.1:27017/icjc'
  console.log('Connecting to MongoDB at', uri)
  await mongoose.connect(uri)
}
let bcrypt
try {
  bcrypt = require('bcrypt')
} catch (e) {
  bcrypt = require('bcryptjs')
}
// minimal inline user model to avoid importing TS files from scripts
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  passwordHash: String,
  roles: [String],
  isActive: { type: Boolean, default: true }
}, { timestamps: true })
const User = mongoose.models.User || mongoose.model('User', userSchema)

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
