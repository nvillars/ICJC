import { NextResponse } from 'next/server'
import { connect } from 'lib/db'
import Sermon from 'models/Sermon'
import Post from 'models/Post'
import fs from 'fs'
import path from 'path'

async function importFromCSV() {
  const csv = fs.readFileSync(path.join(process.cwd(), 'data', 'facebook_inventory.csv'), 'utf8')
  const lines = csv.split('\n').slice(1).filter(Boolean)
  const items = lines.map(l => {
    const [fbId, type, title, permalink] = l.split(',')
    return { fbId: fbId.replace(/"/g, ''), type: type.replace(/"/g, ''), title: title.replace(/"/g, ''), permalink: permalink.replace(/"/g, '') }
  })
  return items
}

export async function POST() {
  await connect()
  // if FB token exists, ideally call Graph API (not implemented fully here)
  const fbToken = process.env.FB_ACCESS_TOKEN
  let items: any[] = []
  if (!fbToken) {
    items = await importFromCSV()
  }
  const created: any[] = []
  for (const it of items) {
    // idempotency by fbId
    if (it.type === 'video') {
      const exists = await Sermon.findOne({ fbId: it.fbId })
      if (exists) continue
      const s = await Sermon.create({ title: it.title, videoEmbed: it.permalink, status: 'draft', fbId: it.fbId })
      created.push(s)
    } else {
      const exists = await Post.findOne({ fbId: it.fbId })
      if (exists) continue
      const p = await Post.create({ title: it.title, content: `<p>Importado desde Facebook</p><a href="${it.permalink}">${it.permalink}</a>`, status: 'draft', fbId: it.fbId })
      created.push(p)
    }
  }
  return NextResponse.json({ imported: created.length, items: created })
}

export async function GET() {
  // Return a lightweight status: whether FB token is configured and number of candidates in CSV
  const fbToken = process.env.FB_ACCESS_TOKEN
  let candidates = 0
  try {
    const csv = await fs.promises.readFile(path.join(process.cwd(), 'data', 'facebook_inventory.csv'), 'utf8')
    candidates = csv.split('\n').slice(1).filter(Boolean).length
  } catch (e) {
    candidates = 0
  }
  return NextResponse.json({ hasToken: Boolean(fbToken), candidates })
}
