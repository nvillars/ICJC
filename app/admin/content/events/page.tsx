"use client"
import { useEffect, useState } from 'react'

export default function AdminEventsPage() {
  const [auth, setAuth] = useState<any>(null)
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string|null>(null)

  useEffect(() => {
    fetch('/api/admin/session').then(r => r.json()).then(d => setAuth(d))
    fetch('/api/admin/events').then(r => r.json()).then(d => setEvents(d || []))
  }, [])

  async function changeStatus(id: string, status: string) {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/events', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ _id: id, status }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Error')
      setEvents(events.map(e => e._id === id ? { ...e, status } : e))
    } catch (e:any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function canEdit(e: any) {
    if (!auth?.roles) return false
    if (auth.roles.includes('admin') || auth.roles.includes('editor')) return true
    if (auth.roles.includes('author') && e.authors?.includes(auth.userId)) return true
    return false
  }

  if (auth === null) return <p>Cargando...</p>
  if (!auth?.authenticated) return <div><p>No autenticado.</p><a href="/admin/login">Ir a login</a></div>

  const statusOptions = [
    { value: 'draft', label: 'Borrador' },
    { value: 'review', label: 'Revisión' },
    { value: 'published', label: 'Publicado' },
    { value: 'archived', label: 'Archivado' }
  ]

  return (
    <main aria-labelledby="events-heading" className="p-6 max-w-3xl mx-auto">
      <h2 id="events-heading" className="text-2xl font-bold mb-4">Eventos (admin)</h2>
      <nav aria-label="Acciones principales" className="mb-4">
        <a href="/admin/content/events/new" className="bg-blue-700 text-white px-4 py-2 rounded focus:outline focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 hover:bg-blue-800 transition">Crear evento</a>
      </nav>
      {error && <p role="alert" className="text-red-600 font-semibold">{error}</p>}
      <section aria-label="Listado de eventos">
        <ul className="divide-y divide-gray-200">
          {events.map(e => (
            <li key={e._id} className="py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2 group focus-within:bg-blue-50">
              <div>
                <span className="font-semibold text-lg text-gray-900">{e.title}</span>
                <span className="ml-2 text-sm text-gray-600">Estado: <b className={
                  e.status === 'published' ? 'text-green-700' :
                  e.status === 'review' ? 'text-yellow-700' :
                  e.status === 'draft' ? 'text-gray-500' :
                  'text-gray-400'
                }>{statusOptions.find(opt=>opt.value===e.status)?.label||e.status}</b></span>
              </div>
              {canEdit(e) && (
                <div className="flex items-center gap-2">
                  <a href={`/admin/content/events/${e._id}`} className="underline text-blue-700 focus:outline focus:ring-2 focus:ring-blue-400 rounded px-1">Editar</a>
                  <span className="text-gray-400">|</span>
                  <label className="sr-only" htmlFor={`status-${e._id}`}>Cambiar estado</label>
                  <select
                    id={`status-${e._id}`}
                    value={e.status}
                    disabled={loading}
                    onChange={ev => changeStatus(e._id, ev.target.value)}
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
