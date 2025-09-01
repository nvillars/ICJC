"use client"
import { signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Link from 'next/link'

function SyncFacebookCard(){
  const [status, setStatus] = useState<any>(null)
  useEffect(()=>{
    fetch('/api/admin/sync/facebook').then(r=>r.json()).then(d=>setStatus(d)).catch(()=>setStatus(null))
  },[])
  return (
    <article className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-lg font-semibold">Facebook</h2>
      <p className="mt-2 text-sm text-gray-600">Estado token: <strong className="text-sm">{status?.hasToken ? 'Conectado' : 'No configurado'}</strong></p>
      <p className="mt-1 text-sm text-gray-600">Candidatos pendientes: <strong>{(status?.candidates?.length)||0}</strong></p>
  <p className="mt-3"><Link href="/admin/sync/facebook" className="inline-block bg-[#0A4D9C] text-white px-3 py-1 rounded">Ir a Sync</Link></p>
    </article>
  )
}

export default function AdminPage() {
  return (
    <main aria-labelledby="admin-heading" className="min-h-screen bg-white text-[#0B2E6E]">
      <header className="bg-[#0A4D9C] text-white py-4">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/brand/logo.svg" alt="ICJC logo" className="w-12 h-12 rounded-full bg-white p-1" />
            <h1 id="admin-heading" className="text-xl font-semibold">IC Jesucristo es el Camino — Panel</h1>
          </div>
          <div className="flex items-center gap-3">
            <a href="https://www.facebook.com/ICJCOficial/?locale=es_LA" target="_blank" rel="noreferrer" className="bg-white text-[#0A4D9C] px-3 py-1 rounded shadow hover:underline">Ver Facebook</a>
            <button onClick={() => signOut({ callbackUrl: '/' })} className="bg-white/90 text-[#0A4D9C] px-3 py-1 rounded shadow">Cerrar sesión</button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <article className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-lg font-semibold">Atajos</h2>
            <ul className="mt-3 space-y-2">
              <li><Link href="/admin/content/posts" className="text-[#0A4D9C] underline">Posts</Link></li>
              <li><Link href="/admin/content/sermons" className="text-[#0A4D9C] underline">Sermones</Link></li>
              <li><Link href="/admin/content/events" className="text-[#0A4D9C] underline">Eventos</Link></li>
            </ul>
          </article>
          <SyncFacebookCard />
          <article className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-lg font-semibold">Editorial</h2>
            <p className="mt-2 text-sm text-gray-600">Flujo: Borrador → Revisión → Publicado → Archivado. Usa los controles en cada listado para cambiar estados.</p>
          </article>
          <article className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-lg font-semibold">Sincronización</h2>
            <p className="mt-2 text-sm text-gray-600">Importa contenidos públicos desde Facebook. Revisa candidatos antes de publicar. Idempotencia por fbId.</p>
            <p className="mt-3"><Link href="/admin/sync/facebook" className="inline-block bg-[#0A4D9C] text-white px-3 py-1 rounded">Ir a Sync</Link></p>
          </article>
        </div>

        <section aria-labelledby="recent-heading" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2">
            <div className="p-4 bg-white rounded-lg shadow">
              <h3 id="recent-heading" className="text-lg font-semibold">Actividad reciente</h3>
              <p className="text-sm text-gray-600 mt-2">Últimos cambios y publicaciones aparecerán aquí (integración con Bitácora).</p>
            </div>
          </div>
          <aside>
            <div className="p-4 bg-white rounded-lg shadow">
              <h4 className="text-md font-semibold">Ayuda rápida</h4>
              <p className="text-sm text-gray-600 mt-2">Accede al manual de operación y la cheatsheet para el equipo.</p>
              <p className="mt-3"><Link href="/docs/MANUAL-OPERACION-ADMIN-ICJC.md" target="_blank" className="text-[#0A4D9C] underline">Manual</Link></p>
              <p className="mt-1"><Link href="/docs/CHEATSHEET-ADMIN-ICJC.md" target="_blank" className="text-[#0A4D9C] underline">Cheatsheet</Link></p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  )
}
