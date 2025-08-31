import { NextResponse } from 'next/server'
import { z } from 'zod'
import { connect } from '../../../../lib/db'
import Post from '../../../../models/Post'
import { logAudit } from '../../../../lib/audit'
import { requireAdminOrEditor } from '../../../../lib/adminGuard'
import { rateLimit } from '../../../../lib/rateLimit'

const BodySchema = z.object({ title: z.string().min(1), slug: z.string().min(1), content: z.any().optional() })

export async function POST(req: Request) {
  // rate limit + auth
  const rl = rateLimit(req)
  if (!(await rl.check())) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

  const sessionCheck = await requireAdminOrEditor(req)
  if (!sessionCheck.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  const body = await req.json()
  const parsed = BodySchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  await connect()
  const p = await Post.create({ ...parsed.data, status: 'draft' })
  await logAudit({ action: 'create', entityType: 'Post', entityId: p._id, after: p, userEmail: sessionCheck.email })
  return NextResponse.json(p)
}

export async function GET(req: Request) {
  const sessionCheck = await requireAdminOrEditor(req)
  if (!sessionCheck.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  await connect()
  const items = await Post.find().sort({ createdAt: -1 }).limit(50)
  return NextResponse.json(items)
}

export async function PUT(req: Request) {
  const rl = rateLimit(req)
  if (!(await rl.check())) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  const sessionCheck = await requireAdminOrEditor(req)
  if (!sessionCheck.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  const body = await req.json()
  const UpdateSchema = z.object({ _id: z.string().min(1), title: z.string().optional(), slug: z.string().optional(), content: z.any().optional(), status: z.string().optional(), version: z.number().int() })
  const parsed = UpdateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })

  await connect()
  const id = parsed.data._id
  const doc = await Post.findById(id)
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // optimistic locking
  if (typeof parsed.data.version === 'number' && doc.version !== parsed.data.version) {
    return NextResponse.json({ error: 'Version conflict' }, { status: 409 })
  }

  const before = doc.toObject()
  if (parsed.data.title !== undefined) doc.title = parsed.data.title
  if (parsed.data.slug !== undefined) doc.slug = parsed.data.slug
  if (parsed.data.content !== undefined) doc.content = parsed.data.content
  if (parsed.data.status !== undefined) doc.status = parsed.data.status
  doc.version = (doc.version || 1) + 1
  const afterDoc = await doc.save()
  await logAudit({ action: 'update', entityType: 'Post', entityId: id, before, after: afterDoc, userEmail: sessionCheck.email })
  return NextResponse.json(afterDoc)
}

export async function DELETE(req: Request) {
  const rl = rateLimit(req)
  if (!(await rl.check())) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  const sessionCheck = await requireAdminOrEditor(req)
  if (!sessionCheck.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  const body = await req.json()
  const DelSchema = z.object({ _id: z.string().min(1) })
  const parsed = DelSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })

  await connect()
  const id = parsed.data._id
  const doc = await Post.findById(id)
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const before = doc.toObject()
  await Post.deleteOne({ _id: id })
  await logAudit({ action: 'delete', entityType: 'Post', entityId: id, before, after: null, userEmail: sessionCheck.email })
  return NextResponse.json({ ok: true })
}
