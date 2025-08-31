import fs from 'fs'
import path from 'path'
import { connect } from '../lib/db'
import Post from '../models/Post'
import Sermon from '../models/Sermon'
import Event from '../models/Event'

async function build() {
  try {
    await connect()
    const base = process.env.SITE_URL || 'http://localhost:3000'
    const posts = await Post.find({ status: 'published' }).select('slug updatedAt publishedAt').lean()
    const sermons = await Sermon.find({ status: 'published' }).select('slug updatedAt publishedAt').lean()
    const events = await Event.find({ status: 'published' }).select('slug start updatedAt').lean()

    const urls: string[] = []
    urls.push(`${base}/`)
    posts.forEach(p => urls.push(`${base}/blog/${p.slug}`))
    sermons.forEach(s => urls.push(`${base}/sermones/${s.slug}`))
    events.forEach(e => urls.push(`${base}/eventos/${e.slug}`))

    const xml = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    urls.forEach(u => {
      xml.push('<url>')
      xml.push(`<loc>${u}</loc>`)
      xml.push('</url>')
    })
    xml.push('</urlset>')

    const outDir = path.join(process.cwd(), 'public')
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })
    fs.writeFileSync(path.join(outDir, 'sitemap.xml'), xml.join('\n'))
    console.log('sitemap.xml written to public/sitemap.xml')
  } catch (e) {
    console.error('build sitemap error', e)
    // fallback: copy data/sitemap.json if present
    try {
      const dataFile = path.join(process.cwd(), 'data', 'sitemap.json')
      if (fs.existsSync(dataFile)) {
        const s = fs.readFileSync(dataFile, 'utf8')
        fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap.xml'), s)
        console.log('fallback sitemap written')
      }
    } catch (e2) {
      console.error('fallback sitemap failed', e2)
    }
  }
}

if (require.main === module) build().catch(e => { console.error(e); process.exit(1) })
