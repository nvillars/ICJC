# PR: feat: ICJC sitio público dinámico + panel /admin con RBAC, workflow, bitácora y sync Facebook

Branch: feature/icjc-mvp-admin

Resumen
--------
Este PR implementa el esqueleto y MVP del sitio público y panel de administración según las especificaciones en `.github/copilot-instructions.md` y la documentación en `docs/`.

Qué incluye (alto nivel)
- Estructura inicial de páginas públicas y panel `/admin` (componentes y rutas).
- Modelos Mongoose: User, Post, Sermon, Event, Series, AuditLog, Settings, Tag, Media, Block.
- Helpers: `lib/db.ts`, `lib/rbac.ts`, `lib/audit.ts`.
- UI mínimo para CRUD de Posts/Sermons (listado y editor), dashboard y Sync Facebook UI.
- Seed script y data/ seeds provistas.
- Plantilla PR, workflow CI básico.

Cómo probar (local)
1. Crear y cambiar a la rama local `feature/icjc-mvp-admin`.
2. Instalar dependencias: `npm install`.
3. Crear `.env.local` con al menos `MONGODB_URI` y `NEXTAUTH_SECRET`.
4. Ejecutar seed admin: `npm run seed:admin`.
5. Levantar dev: `npm run dev`.
6. Visitar `/admin/login` y acceder con `admin@icjc.org` (si seed creado), luego probar crear un Post y cambiar estado a `published`.
7. Visitar `/admin/sync/facebook` y probar la importación por enlaces para validar idempotencia.

Checklist DoD (estado parcial)
- [x] Documentación: `docs/` revisada y presente.
- [x] Modelos básicos presentes en `models/`.
- [x] Helpers `lib/db.ts`, `lib/rbac.ts`, `lib/audit.ts` implementados.
- [ ] Completar endpoints protegidos `/api/admin/*` con Zod y audit logging.
- [ ] Tests unitarios y e2e.
- [ ] CI afinado y Lighthouse CI.

Notas para el revisor
- No he subido secretos. Revisa `.env.local` para pruebas.
- Si no hay MongoDB accesible, los seeds y pruebas fallarán; puedes usar `mongodb://127.0.0.1:27017/icjc` localmente.
