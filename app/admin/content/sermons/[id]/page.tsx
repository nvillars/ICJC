"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function EditSermonPage({ params }: any){
  const { id } = params
  const [sermon, setSermon] = useState<any>(null)
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const router = useRouter()

  useEffect(()=>{
    fetch('/api/admin/sermons').then(r=>r.json()).then(d=>{
      const s = d.find((x:any)=>x._id===id)
      setSermon(s)
      if (s){ setTitle(s.title); setSlug(s.slug) }
    })
  },[id])

  async function save(){
    const res = await fetch('/api/admin/sermons', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ _id: id, title, slug, version: sermon.version }) })
    const data = await res.json()
    if (!res.ok) return alert('Error: '+(data?.error||'unknown'))
    router.push('/admin/content/sermons')
  }

  async function del(){
    if (!confirm('¿Eliminar este sermón?')) return
    const res = await fetch('/api/admin/sermons', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ _id: id }) })
    const data = await res.json()
    if (!res.ok) return alert('Error: '+(data?.error||'unknown'))
    router.push('/admin/content/sermons')
  }

  if (!sermon) return <p>Cargando...</p>
  return (
    <div style={{ maxWidth: 640, margin: '2rem auto' }}>
      <h2>Editar sermón</h2>
      <label> Título<br/><input value={title} onChange={e=>setTitle(e.target.value)} /></label>
      <br />
      <label> Slug<br/><input value={slug} onChange={e=>setSlug(e.target.value)} /></label>
      <br />
      <p>Version: {sermon.version}</p>
      <button onClick={save}>Guardar</button>
      <button onClick={del} style={{ marginLeft: 8, color: 'red' }}>Eliminar</button>
    </div>
  )
}
