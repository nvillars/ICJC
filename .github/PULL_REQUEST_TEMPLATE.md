## Título
feat: ICJC sitio público dinámico + panel /admin con RBAC, workflow, bitácora y sync Facebook

## Descripción corta
Implementa el MVP del sitio público y el panel de administración según las especificaciones: rutas públicas dinámicas, CRUD de contenidos, flujo editorial, autenticación y sincronización con Facebook.

## Checklist DoD
- [ ] Público: rutas `/`, `/sermones`, `/eventos`, `/ministerios`, `/nosotros`, `/contacto`, `/donaciones`, `/blog`, `/galeria`, `/en-vivo` funcionales y leyendo desde MongoDB.
- [ ] Admin: `/admin/login`, dashboard, CRUD (Posts/Sermons/Events) con estados editoriales (draft→review→published→archived).
- [ ] Bitácora: registros create/update/delete/publish con before/after visibles en `/admin/bitacora`.
- [ ] Sync Facebook: `/admin/sync/facebook` y `/api/admin/sync/facebook` con idempotencia por `fbId`.
- [ ] Seguridad: RBAC server-side, Zod validations, rate limit básico, headers seguros.
- [ ] Seeds y scripts: `scripts/seed-admin.js` y `data/seed_*.json` incluidos.
- [ ] CI: flujo básico (lint, typecheck, build, tests) en GitHub Actions.

## Cómo probar rápidamente
1. Instalar dependencias: `npm install`
2. Crear `.env.local` con `MONGODB_URI` y `NEXTAUTH_SECRET`.
3. Correr seed admin: `npm run seed:admin`.
4. Levantar desarrollo: `npm run dev`.
5. Acceder a `/admin/login` y usar `admin@icjc.org` (si seed creado).
6. Crear un Post/Sermon/Event y probar estados y bitácora.
7. Ir a `/admin/sync/facebook` y probar import por enlaces (si no hay token).

## Notas
- No se incluyen secretos en este PR. Variables en `.env.local`.
feat: ICJC sitio público dinámico + panel /admin con RBAC, workflow, bitácora y sync Facebook

Resumen:
- Scaffold inicial Next.js + TS + Tailwind + Mongoose
- Modelos: User, AuditLog, Post, Sermon, Event, Series, Ministry, Media, Tag, Block, Settings
- Seed script para crear admin
- Docs añadidos: manuales, RBAC, sync, seguridad
- CI: GitHub Actions basic workflow

Checklist DoD:
- [ ] Rutas públicas básicas: /, /sermones, /eventos, /admin
- [ ] Auth + RBAC scaffold
- [ ] CRUD models scaffold
- [ ] AuditLog scaffold and logging helper
- [ ] Facebook sync stub
- [ ] Docs: manual y cheatsheet incluidos

Solicito revisión.
