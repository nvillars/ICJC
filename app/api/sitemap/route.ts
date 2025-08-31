import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { connect } from '../../../lib/db'
import Post from '../../../models/Post'
import Sermon from '../../../models/Sermon'
import Event from '../../../models/Event'

async function generateXml() {
  const base = process.env.SITE_URL || 'http://localhost:3000'
  await connect()
  const posts = await Post.find({ status: 'published' }).select('slug').lean()
  const sermons = await Sermon.find({ status: 'published' }).select('slug').lean()
  const events = await Event.find({ status: 'published' }).select('slug').lean()
  const urls: string[] = []
  urls.push(`${base}/`)
  posts.forEach(p => urls.push(`${base}/blog/${p.slug}`))
  sermons.forEach(s => urls.push(`${base}/sermones/${s.slug}`))
  events.forEach(e => urls.push(`${base}/eventos/${e.slug}`))
  const xml = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
  urls.forEach(u => { xml.push('<url>'); xml.push(`<loc>${u}</loc>`); xml.push('</url>') })
  xml.push('</urlset>')
  return xml.join('\n')
}

export async function GET() {
  try {
    const publicPath = path.join(process.cwd(), 'public', 'sitemap.xml')
    if (fs.existsSync(publicPath)) {
      const content = fs.readFileSync(publicPath, 'utf8')
      return new NextResponse(content, { headers: { 'Content-Type': 'application/xml' } })
    }
    const xml = await generateXml()
    return new NextResponse(xml, { headers: { 'Content-Type': 'application/xml' } })
  } catch (e) {
    // fallback to data/sitemap.json if exists
    try {
      const dataFile = path.join(process.cwd(), 'data', 'sitemap.json')
      if (fs.existsSync(dataFile)) {
        const s = fs.readFileSync(dataFile, 'utf8')
        return new NextResponse(s, { headers: { 'Content-Type': 'application/xml' } })
      }
    } catch (e2) {
      console.error('sitemap fallback error', e2)
    }
    return new NextResponse('Not found', { status: 404 })
  }
}
