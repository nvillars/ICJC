import { getToken } from 'next-auth/jwt'
import { NextRequest } from 'next/server'

export async function requireAdminOrEditor(req: Request | NextRequest) {
  // accepts server Request or NextRequest
  // try NextAuth token
  try {
    const token = await getToken({ req: (req as any), secret: process.env.NEXTAUTH_SECRET })
    if (!token) return { ok: false }
    const roles = (token as any).roles || []
    if (roles.includes('admin') || roles.includes('editor')) return { ok: true, email: token.email }
    return { ok: false }
  } catch (e) {
    return { ok: false }
  }
}
