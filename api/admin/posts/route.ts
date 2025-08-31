import { NextResponse } from 'next/server'
import { z } from 'zod'
import { connect } from '../../../lib/db'
import Post from '../../../models/Post'
import { logAudit } from '../../../lib/audit'
import { can } from '../../../lib/rbac'

const QuerySchema = z.object({ method: z.string().optional() })

export async function GET(req: Request) {
  await connect()
  const posts = await Post.find().sort({ createdAt: -1 }).lean()
  return NextResponse.json(posts)
}

export async function PUT(req: Request) {
  await connect()
  const body = await req.json().catch(() => ({}))
  const UpdateSchema = z.object({ _id: z.string(), status: z.string().optional(), title: z.string().optional() })
  const parsed = UpdateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'invalid' }, { status: 422 })

  // Dev-friendly auth: use headers to identify user
  const headers = (req as any).headers || new Headers()
  const userId = headers.get ? headers.get('x-user-id') : headers['x-user-id']
  const rolesHeader = headers.get ? headers.get('x-user-roles') : headers['x-user-roles']
  const roles = rolesHeader ? String(rolesHeader).split(',').map((s:string)=>s.trim()) : []
  const user = { _id: userId, roles }

  if (!can(user, 'content.update')) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  const post = await Post.findById(parsed.data._id)
  if (!post) return NextResponse.json({ error: 'not_found' }, { status: 404 })

  const before = post.toObject()
  if (parsed.data.status) post.status = parsed.data.status
  if (parsed.data.title) post.title = parsed.data.title
  post.version = (post.version || 1) + 1
  await post.save()

  await logAudit({
    userId: userId || null,
    userEmail: null,
    roles,
    action: 'update',
    entityType: 'Post',
    entityId: post._id,
    before,
    after: post.toObject()
  })

  return NextResponse.json(post)
}

export async function POST(req: Request) {
  await connect()
  const body = await req.json().catch(() => ({}))
  const CreateSchema = z.object({ title: z.string(), excerpt: z.string().optional(), content: z.any().optional() })
  const parsed = CreateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'invalid' }, { status: 422 })

  const headers = (req as any).headers || new Headers()
  const userId = headers.get ? headers.get('x-user-id') : headers['x-user-id']
  const rolesHeader = headers.get ? headers.get('x-user-roles') : headers['x-user-roles']
  const roles = rolesHeader ? String(rolesHeader).split(',').map((s:string)=>s.trim()) : []
  const user = { _id: userId, roles }

  if (!can(user, 'content.create')) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  const doc = await Post.create({ ...parsed.data, authors: userId ? [userId] : [], status: 'draft' })

  await logAudit({ userId: userId || null, roles, action: 'create', entityType: 'Post', entityId: doc._id, after: doc.toObject() })

  return NextResponse.json(doc)
}

export async function DELETE(req: Request) {
  await connect()
  const body = await req.json().catch(() => ({}))
  const DeleteSchema = z.object({ _id: z.string() })
  const parsed = DeleteSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'invalid' }, { status: 422 })

  const headers = (req as any).headers || new Headers()
  const userId = headers.get ? headers.get('x-user-id') : headers['x-user-id']
  const rolesHeader = headers.get ? headers.get('x-user-roles') : headers['x-user-roles']
  const roles = rolesHeader ? String(rolesHeader).split(',').map((s:string)=>s.trim()) : []
  const user = { _id: userId, roles }

  if (!can(user, 'content.delete')) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  const post = await Post.findById(parsed.data._id)
  if (!post) return NextResponse.json({ error: 'not_found' }, { status: 404 })
  const before = post.toObject()
  await post.deleteOne()

  await logAudit({ userId: userId || null, roles, action: 'delete', entityType: 'Post', entityId: parsed.data._id, before })

  return NextResponse.json({ ok: true })
}
