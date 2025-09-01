"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AdminPostsPage() {
  const [auth, setAuth] = useState<any>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string|null>(null)

  useEffect(() => {
    fetch('/api/admin/session').then(r => r.json()).then(d => setAuth(d))
    fetch('/api/admin/posts').then(r => r.json()).then(d => setPosts(d || []))
  }, [])

  async function changeStatus(id: string, status: string) {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/posts', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ _id: id, status }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Error')
      setPosts(posts.map(p => p._id === id ? { ...p, status } : p))
    } catch (e:any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function canEdit(p: any) {
    if (!auth?.roles) return false
    if (auth.roles.includes('admin') || auth.roles.includes('editor')) return true
    if (auth.roles.includes('author') && p.authors?.includes(auth.userId)) return true
    return false
  }

  if (auth === null) return <p>Cargando...</p>
  if (!auth?.authenticated) return <div><p>No autenticado.</p><Link href="/admin/login">Ir a login</Link></div>

  const statusOptions = [
    { value: 'draft', label: 'Borrador' },
    { value: 'review', label: 'Revisión' },
    { value: 'published', label: 'Publicado' },
    { value: 'archived', label: 'Archivado' }
  ]

  return (
    <main aria-labelledby="posts-heading" className="p-6 max-w-3xl mx-auto">
      <h2 id="posts-heading" className="text-2xl font-bold mb-4">Posts (admin)</h2>
      <nav aria-label="Acciones principales" className="mb-4">
        <Link href="/admin/content/posts/new" className="bg-blue-700 text-white px-4 py-2 rounded focus:outline focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 hover:bg-blue-800 transition">Crear post</Link>
      </nav>
      {error && <p role="alert" className="text-red-600 font-semibold">{error}</p>}
      <section aria-label="Listado de posts">
        <ul className="divide-y divide-gray-200">
          {posts.map(p => (
            <li key={p._id} className="py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2 group focus-within:bg-blue-50">
              <div>
                <span className="font-semibold text-lg text-gray-900">{p.title}</span>
                <span className="ml-2 text-sm text-gray-600">Estado: <b className={
                  p.status === 'published' ? 'text-green-700' :
                  p.status === 'review' ? 'text-yellow-700' :
                  p.status === 'draft' ? 'text-gray-500' :
                  'text-gray-400'
                }>{statusOptions.find(opt=>opt.value===p.status)?.label||p.status}</b></span>
              </div>
              {canEdit(p) && (
                <div className="flex items-center gap-2">
                  <Link href={`/admin/content/posts/${p._id}`} className="underline text-blue-700 focus:outline focus:ring-2 focus:ring-blue-400 rounded px-1">Editar</Link>
                  <span className="text-gray-400">|</span>
                  <label className="sr-only" htmlFor={`status-${p._id}`}>Cambiar estado</label>
                  <select
                    id={`status-${p._id}`}
                    value={p.status}
                    disabled={loading}
                    onChange={e => changeStatus(p._id, e.target.value)}
                    className="border rounded px-2 py-1 focus:outline focus:ring-2 focus:ring-blue-400"
                  >
                    {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
