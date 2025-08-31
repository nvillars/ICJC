"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function EditPostPage({ params }: any){
  const { id } = params
  const [post, setPost] = useState<any>(null)
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const router = useRouter()

  useEffect(()=>{
    fetch('/api/admin/posts').then(r=>r.json()).then(d=>{
      const p = d.find((x:any)=>x._id===id)
      setPost(p)
      if (p){ setTitle(p.title); setSlug(p.slug) }
    })
  },[id])

  async function save(){
    const res = await fetch('/api/admin/posts', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ _id: id, title, slug, version: post.version }) })
    const data = await res.json()
    if (!res.ok) return alert('Error: '+(data?.error||'unknown'))
    router.push('/admin/content/posts')
  }

  async function del(){
    if (!confirm('¿Eliminar este post?')) return
    const res = await fetch('/api/admin/posts', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ _id: id }) })
    const data = await res.json()
    if (!res.ok) return alert('Error: '+(data?.error||'unknown'))
    router.push('/admin/content/posts')
  }

  if (!post) return <p>Cargando...</p>
  return (
    <div style={{ maxWidth: 640, margin: '2rem auto' }}>
      <h2>Editar post</h2>
      <label> Título<br/><input value={title} onChange={e=>setTitle(e.target.value)} /></label>
      <br />
      <label> Slug<br/><input value={slug} onChange={e=>setSlug(e.target.value)} /></label>
      <br />
      <p>Version: {post.version}</p>
      <button onClick={save}>Guardar</button>
      <button onClick={del} style={{ marginLeft: 8, color: 'red' }}>Eliminar</button>
    </div>
  )
}
