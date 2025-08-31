import { getToken } from 'next-auth/jwt'
import { NextRequest } from 'next/server'
import { checkPermission } from './permissions'

export async function requireSession(req: Request | NextRequest) {
  try {
    const token = await getToken({ req: (req as any), secret: process.env.NEXTAUTH_SECRET })
    if (!token) return { ok: false }
    const roles = (token as any).roles || []
    return { ok: true, userId: (token as any).userId || (token as any).sub, email: token.email, name: token.name, roles }
  } catch (e) {
    return { ok: false }
  }
}

export async function requirePermission(req: Request | NextRequest, action: string, context?: any) {
  const s = await requireSession(req)
  if (!s.ok) return { ok: false }
  const user = { id: s.userId, email: s.email, roles: s.roles }
  const allowed = checkPermission(user, action, undefined, context)
  return { ...s, ok: allowed }
}

export async function requireAdminOrEditor(req: Request | NextRequest) {
  const s = await requireSession(req)
  if (!s.ok) return { ok: false }
  const roles = s.roles || []
  if (roles.includes('admin') || roles.includes('editor')) return { ok: true, email: s.email }
  return { ok: false }
}
