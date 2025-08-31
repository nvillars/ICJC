import { NextResponse } from 'next/server'
import { connect } from '../../../../lib/db'

export async function GET() {
  await connect()
  const Audit = (await import('../../../../models/AuditLog')).default
  const items = await Audit.find().sort({ timestamp: -1 }).limit(200)
  return NextResponse.json(items)
}
