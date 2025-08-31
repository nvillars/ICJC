"use client"
import { useEffect, useState } from 'react'

export default function AdminPostsPage() {
  const [auth, setAuth] = useState<boolean | null>(null)
  const [posts, setPosts] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/admin/session').then(r => r.json()).then(d => setAuth(!!d.authenticated))
    fetch('/api/admin/posts').then(r => r.json()).then(d => setPosts(d || []))
  }, [])

  if (auth === null) return <p>Cargando...</p>
  if (!auth) return <div><p>No autenticado.</p><a href="/admin/login">Ir a login</a></div>

  return (
    <div>
      <h2>Posts (admin)</h2>
      <p><a href="/admin/content/posts/new">Crear post</a></p>
      <ul>
        {posts.map(p => <li key={p._id}>{p.title} — {p.status}</li>)}
      </ul>
    </div>
  )
}
