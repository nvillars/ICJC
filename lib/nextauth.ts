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
      ;(session as any).roles = token.roles || []
      const u = { id: token.userId || (session as any).user?.id, email: token.email || (session as any).user?.email, name: token.name || (session as any).user?.name }
      ;(session as any).user = u
      ;(session as any).userId = token.userId || u.id
      return session
    }
  },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET
}
