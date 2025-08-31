import { NextResponse } from 'next/server'
import { z } from 'zod'
import { connect } from '../../../lib/db'
import Sermon from '../../../models/Sermon'
import { logAudit } from '../../../lib/audit'
import { can } from '../../../lib/rbac'

export async function GET(req: Request) {
  await connect()
  const items = await Sermon.find().sort({ createdAt: -1 }).lean()
  return NextResponse.json(items)
}

export async function POST(req: Request) {
  await connect()
  const body = await req.json().catch(() => ({}))
  const Schema = z.object({ title: z.string(), predicador: z.string().optional(), serie: z.string().optional(), pasaje: z.string().optional(), videoEmbed: z.string().optional(), thumbnail: z.string().optional(), thumbnailAlt: z.string().optional() })
  const parsed = Schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'invalid' }, { status: 422 })

  const headers = (req as any).headers || new Headers()
  const userId = headers.get ? headers.get('x-user-id') : headers['x-user-id']
  const rolesHeader = headers.get ? headers.get('x-user-roles') : headers['x-user-roles']
  const roles = rolesHeader ? String(rolesHeader).split(',').map((s:string)=>s.trim()) : []
  const user = { _id: userId, roles }

  if (!can(user, 'content.create')) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  const doc = await Sermon.create({ ...parsed.data, status: 'draft', authors: userId ? [userId] : [] } as any)
  await logAudit({ userId: userId || null, roles, action: 'create', entityType: 'Sermon', entityId: doc._id, after: doc.toObject() })
  return NextResponse.json(doc)
}

export async function PUT(req: Request) {
  await connect()
  const body = await req.json().catch(() => ({}))
  const Schema = z.object({ _id: z.string(), status: z.string().optional(), title: z.string().optional(), videoEmbed: z.string().optional(), publishedAt: z.string().optional() })
  const parsed = Schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'invalid' }, { status: 422 })

  const headers = (req as any).headers || new Headers()
  const userId = headers.get ? headers.get('x-user-id') : headers['x-user-id']
  const rolesHeader = headers.get ? headers.get('x-user-roles') : headers['x-user-roles']
  const roles = rolesHeader ? String(rolesHeader).split(',').map((s:string)=>s.trim()) : []
  const user = { _id: userId, roles }

  if (!can(user, 'content.update')) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  const item = await Sermon.findById(parsed.data._id)
  if (!item) return NextResponse.json({ error: 'not_found' }, { status: 404 })
  const before = item.toObject()
  if (parsed.data.status) item.status = parsed.data.status
  if (parsed.data.title) item.title = parsed.data.title
  if (parsed.data.videoEmbed) item.videoEmbed = parsed.data.videoEmbed
  if (parsed.data.publishedAt) item.publishedAt = new Date(parsed.data.publishedAt)
  item.version = (item.version || 1) + 1
  await item.save()
  await logAudit({ userId: userId || null, roles, action: 'update', entityType: 'Sermon', entityId: item._id, before, after: item.toObject() })
  return NextResponse.json(item)
}

export async function DELETE(req: Request) {
  await connect()
  const body = await req.json().catch(() => ({}))
  const Schema = z.object({ _id: z.string() })
  const parsed = Schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'invalid' }, { status: 422 })

  const headers = (req as any).headers || new Headers()
  const userId = headers.get ? headers.get('x-user-id') : headers['x-user-id']
  const rolesHeader = headers.get ? headers.get('x-user-roles') : headers['x-user-roles']
  const roles = rolesHeader ? String(rolesHeader).split(',').map((s:string)=>s.trim()) : []
  const user = { _id: userId, roles }

  if (!can(user, 'content.delete')) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  const item = await Sermon.findById(parsed.data._id)
  if (!item) return NextResponse.json({ error: 'not_found' }, { status: 404 })
  const before = item.toObject()
  await item.deleteOne()
  await logAudit({ userId: userId || null, roles, action: 'delete', entityType: 'Sermon', entityId: parsed.data._id, before })
  return NextResponse.json({ ok: true })
}
