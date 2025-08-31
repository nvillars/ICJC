import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function GET(req: Request) {
  try {
    const token = await getToken({ req: (req as any), secret: process.env.NEXTAUTH_SECRET })
    if (!token) return NextResponse.json({ authenticated: false })
    return NextResponse.json({ authenticated: true, token })
  } catch (e) {
    return NextResponse.json({ authenticated: false })
  }
}
