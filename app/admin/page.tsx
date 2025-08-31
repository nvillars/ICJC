"use client"
import { signOut } from 'next-auth/react'

export default function AdminPage() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Dashboard</h1>
      <p>Panel de administración (esqueleto).</p>
      <p>
        <a href="/admin/content/posts">Posts</a> • <a href="/admin/bitacora">Bitácora</a> • <a href="/admin/sync/facebook">Sync Facebook</a>
      </p>
      <p>
        <a href="/docs/MANUAL-OPERACION-ADMIN-ICJC.md" target="_blank">Ayuda (Manual)</a> •
        <a href="/docs/CHEATSHEET-ADMIN-ICJC.md" target="_blank">Cheatsheet</a>
      </p>
      <button onClick={() => signOut({ callbackUrl: '/' })}>Cerrar sesión</button>
    </div>
  )
}
