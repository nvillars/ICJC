import CredentialsProvider from 'next-auth/providers/credentials'
import FacebookProvider from 'next-auth/providers/facebook'
import { NextAuthOptions } from 'next-auth'
import { connect } from './db'
import User from '../models/User'
import bcrypt from 'bcrypt'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials) return null
        await connect()
        const user = await User.findOne({ email: credentials.email })
        if (!user || !user.passwordHash) return null
        const ok = await bcrypt.compare(credentials.password, user.passwordHash)
        if (!ok) return null
        return { id: user._id.toString(), email: user.email, name: user.name, roles: user.roles }
      }
    }),
    // Facebook OAuth optional - requires env vars
    ...(process.env.FACEBOOK_CLIENT_ID ? [FacebookProvider({ clientId: process.env.FACEBOOK_CLIENT_ID!, clientSecret: process.env.FACEBOOK_CLIENT_SECRET! })] : [])
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.roles = (user as any).roles || token.roles
        token.userId = (user as any).id || token.userId
        // also persist common user fields so session endpoint can return them
        token.email = (user as any).email || token.email
        token.name = (user as any).name || token.name
      }
      return token
    },
    async session({ session, token }) {
      // ensure a stable session.user object with id/email/name and roles
      const s: any = session
      s.roles = (token as any).roles || []
      const u = { id: (token as any).userId || s.user?.id, email: (token as any).email || s.user?.email, name: (token as any).name || s.user?.name }
      s.user = u
      s.userId = (token as any).userId || u.id
      return s
    }
  },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET
}
