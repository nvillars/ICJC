"use client"
import { useEffect, useState } from 'react'

export default function BitacoraPage(){
  const [items, setItems] = useState<any[]>([])
  useEffect(()=>{
    fetch('/api/admin/bitacora').then(r=>r.json()).then(d=>setItems(d||[]))
  },[])
  return (
    <div style={{ padding: 20 }}>
      <h2>Bitácora (últimos cambios)</h2>
      <ul>
        {items.map(it=> (
          <li key={it._id}><strong>{it.action}</strong> — {it.entityType} — {it.userEmail} — {new Date(it.timestamp).toLocaleString()}<pre>{JSON.stringify({before: it.before, after: it.after}, null, 2)}</pre></li>
        ))}
      </ul>
    </div>
  )
}
