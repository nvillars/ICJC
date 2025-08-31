"use client"
import { useState } from 'react'
import { signIn } from 'next-auth/react'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      // Use redirect-based signIn so NextAuth can set cookies via normal redirect response
      await signIn('credentials', { email, password, callbackUrl: '/admin' })
    } catch (err: any) {
      setError(err?.message || 'Error al iniciar sesión')
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-white shadow p-6 rounded">
        <h1 className="text-2xl mb-4">Iniciar sesión — Panel</h1>
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-sm">Email</label>
            <input className="w-full border px-3 py-2 rounded" value={email} onChange={e => setEmail(e.target.value)} type="email" required />
          </div>
          <div>
            <label className="block text-sm">Contraseña</label>
            <input className="w-full border px-3 py-2 rounded" value={password} onChange={e => setPassword(e.target.value)} type="password" required />
          </div>
          <div>
            <button className="bg-brand text-white px-4 py-2 rounded" type="submit">Entrar</button>
          </div>
          {error && <p className="text-red-600">{error}</p>}
        </form>
      </div>
    </div>
  )
}
