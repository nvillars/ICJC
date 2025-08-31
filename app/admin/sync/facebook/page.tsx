"use client"
import { useEffect, useState } from 'react'

export default function SyncFacebookPage() {
  const [status, setStatus] = useState<any>(null)
  const [candidates, setCandidates] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string|null>(null)

  useEffect(() => {
    fetch('/api/admin/sync/facebook').then(r => r.json()).then(setStatus)
  }, [])

  async function syncNow() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/sync/facebook', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Error')
      setCandidates(data.candidates || [])
    } catch (e:any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function approveCandidate(fbId: string) {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/sync/facebook', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fbId }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Error')
      setCandidates(candidates.filter(c => c.fbId !== fbId))
    } catch (e:any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto' }}>
      <h2>Sincronización Facebook</h2>
      <p>Estado: {status ? status.status : 'Cargando...'}</p>
      <button onClick={syncNow} disabled={loading}>{loading ? 'Sincronizando...' : 'Sincronizar ahora'}</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {candidates.length > 0 && (
        <div>
          <h3>Candidatos encontrados</h3>
          <ul>
            {candidates.map(c => (
              <li key={c.fbId}>
                <strong>{c.title}</strong> — {c.type} — {c.date}
                <button onClick={() => approveCandidate(c.fbId)} style={{ marginLeft: 8 }}>Aprobar</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
