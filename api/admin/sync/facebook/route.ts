import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { connect } from '../../../../lib/db'
import Sermon from '../../../../models/Sermon'
import Post from '../../../../models/Post'

// GET: list candidates from FB_GRAPH (if token) or fallback to data/facebook_inventory.csv
export async function GET(req: Request) {
  const FB_ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN || ''
  const FB_PAGE_ID = process.env.FB_PAGE_ID || ''
  if (FB_ACCESS_TOKEN && FB_PAGE_ID) {
    // prefer real Graph API
    try {
  const fb = await import('../../../../lib/facebook')
      const data = await fb.fetchFacebookVideos(FB_PAGE_ID, FB_ACCESS_TOKEN, process.env.FB_GRAPH_VERSION)
      return NextResponse.json({ source: 'graph', data })
    } catch (e:any) {
      return NextResponse.json({ error: String(e) }, { status: 500 })
    }
  }

  // fallback: read CSV from data/
  try {
    const csvPath = path.join(process.cwd(), 'data', 'facebook_inventory.csv')
    if (!fs.existsSync(csvPath)) return NextResponse.json({ source: 'none', data: [] })
    const raw = fs.readFileSync(csvPath, 'utf-8')
    const lines = raw.split(/\r?\n/).filter(Boolean)
    const rows = lines.map(line => {
      const [fbId, type, date, title, permalink] = line.split(',')
      return { fbId, type, date, title, permalink }
    })
    return NextResponse.json({ source: 'csv', data: rows })
  } catch (e:any) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

// POST: import a candidate (simple mapping: videos -> Sermon, posts -> Post)
export async function POST(req: Request) {
  await connect()
  const body = await req.json().catch(() => ({}))
  const { fbId, type, title, permalink } = body || {}
  if (!fbId) return NextResponse.json({ error: 'fbId required' }, { status: 422 })

  if (type === 'video' || type === 'live') {
    // idempotent create Sermon by fbId
    const existing = await Sermon.findOne({ fbId })
    if (existing) return NextResponse.json({ ok: true, existing })
    const s = await Sermon.create({ title: title || 'Sermon import', videoEmbed: permalink, fbId, status: 'draft' })
    return NextResponse.json({ ok: true, created: s })
  }

  // default: post
  const existing = await Post.findOne({ fbId })
  if (existing) return NextResponse.json({ ok: true, existing })
  const p = await Post.create({ title: title || 'Post import', content: permalink ? { embed: permalink } : {}, fbId, status: 'draft' })
  return NextResponse.json({ ok: true, created: p })
}
