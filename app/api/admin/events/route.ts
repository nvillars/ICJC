import { NextResponse } from 'next/server'
import { z } from 'zod'
import { connect } from '../../../../lib/db'
import Event from '../../../../models/Event'
import { logAudit } from '../../../../lib/audit'
import { requireAdminOrEditor } from '../../../../lib/adminGuard'
import { rateLimit } from '../../../../lib/rateLimit'

const BodySchema = z.object({ title: z.string().min(1), slug: z.string().min(1), start: z.string().optional(), end: z.string().optional(), place: z.string().optional() })

export async function POST(req: Request) {
  const rl = rateLimit(req)
  if (!(await rl.check())) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  const sessionCheck = await requireAdminOrEditor(req)
  if (!sessionCheck.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  const body = await req.json()
  const parsed = BodySchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  await connect()
  const e = await Event.create({ ...parsed.data, status: 'draft' })
  await logAudit({ action: 'create', entityType: 'Event', entityId: e._id, after: e, userEmail: sessionCheck.email })
  return NextResponse.json(e)
}

export async function GET(req: Request) {
  const sessionCheck = await requireAdminOrEditor(req)
  if (!sessionCheck.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  await connect()
  const items = await Event.find().sort({ start: -1 }).limit(50)
  return NextResponse.json(items)
}
