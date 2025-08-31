import { NextResponse } from 'next/server'

// Simple session endpoint used by the admin UI.
// Development-friendly: accepts headers `x-user-id` and `x-user-roles` to simulate an authenticated user.
export async function GET(req: Request) {
  try {
    const headers = req.headers
    const userId = headers.get('x-user-id')
    const rolesHeader = headers.get('x-user-roles') || ''
    const roles = rolesHeader ? rolesHeader.split(',').map(s => s.trim()) : []

    if (!userId) {
      return NextResponse.json({ authenticated: false })
    }

    return NextResponse.json({
      authenticated: true,
      userId,
      roles
    })
  } catch (e: any) {
    return NextResponse.json({ authenticated: false, error: String(e) }, { status: 500 })
  }
}
