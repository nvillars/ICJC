"use client"
import { useState } from 'react'

export default function NewSermonPage(){
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent){
    e.preventDefault()
    setSaving(true)
    setError(null)
    try{
      const res = await fetch('/api/admin/sermons', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, slug }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Error')
      window.location.href = '/admin/content/sermons'
    }catch(e:any){
      setError(e.message)
    }finally{ setSaving(false) }
  }

  return (
    <div style={{ maxWidth: 640, margin: '2rem auto' }}>
      <h2>Crear nuevo sermón</h2>
      <form onSubmit={onSubmit}>
        <label> Título<br/>
          <input value={title} onChange={e => setTitle(e.target.value)} required />
        </label>
        <br />
        <label> Slug<br/>
          <input value={slug} onChange={e => setSlug(e.target.value)} required />
        </label>
        <br />
        <button type="submit" disabled={saving}>{saving ? 'Guardando...' : 'Crear'}</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  )
}
