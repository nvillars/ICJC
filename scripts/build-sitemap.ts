import fs from 'fs'
import path from 'path'

// Simple sitemap builder: reads data/sitemap.json if present, else builds from seed files
const root = path.join(__dirname, '..')
const out = path.join(root, 'public', 'sitemap.xml')
const dataFile = path.join(root, 'data', 'sitemap.json')

function buildFromJson(items: any[]) {
  const urls = items.map(i => `  <url><loc>${i.loc}</loc><priority>${i.priority || 0.5}</priority></url>`).join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`
}

async function run() {
  let xml = ''
  if (fs.existsSync(dataFile)) {
    const raw = fs.readFileSync(dataFile, 'utf-8')
    const items = JSON.parse(raw)
    xml = buildFromJson(items)
  } else {
    xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>https://example.org/</loc><priority>1.0</priority></url>\n</urlset>`
  }
  fs.mkdirSync(path.dirname(out), { recursive: true })
  fs.writeFileSync(out, xml, 'utf-8')
  console.log('Wrote', out)
}

run().catch(e => { console.error(e); process.exit(1) })
