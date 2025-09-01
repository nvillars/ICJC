# [SYSTEM] Copilot, actúa como: Tech Lead + Arquitecto Web + UX Lead + SEO/A11y + DevOps
Objetivo: Crear y dejar listo para producción el sitio de **“IC Jesucristo es el Camino (ICJC)”**, usando la info curada A–M de este documento. Debe existir:
- **Sitio público dinámico** (sin login) para visitantes.
- **Panel de administración /admin** (con login) para gestión de contenidos, sincronización con Facebook, flujo editorial y bitácora de cambios.

## 0) Alcance y restricciones
- **Sitio**: corporativo + blog/devocionales + archivo de sermones + eventos + ministerios + donaciones + contacto + en vivo.
- **Contenido fuente**: página de Facebook oficial https://www.facebook.com/ICJCOficial/?locale=es_LA (solo contenido **público**). Sin scrapping intrusivo: usar **Graph API** y/o **embeds** oficiales.
- **Zona horaria**: America/Lima. Fechas ISO (AAAA-MM-DD o date-time con -05:00).
- **Stack**: Next.js (App Router) + TypeScript + Tailwind + shadcn/ui + Zod + JSON-LD SEO + **MongoDB Atlas (Mongoose)** para persistencia **dinámica** (NO sitio estático).
- **Auth (panel)**: NextAuth (Credentials + Facebook OAuth opcional) + MongoDB Adapter + RBAC.
- **Rendimiento**: Core Web Vitals ≥ “Good”; imágenes optimizadas, lazy loading, splitting por ruta.
- **Accesibilidad**: WCAG 2.2 AA (teclado, contraste, ARIA, focus visible, alt texts).
- **Legal**: Privacidad/cookies/derechos de imagen; consentimiento explícito en formularios.
- **Idioma**: Español (preparado para i18n; MVP ES).

## 0.1) Personas y rutas
- **Rol Público (sin login):** accede a `/`, `/sermones`, `/eventos`, `/ministerios`, `/nosotros`, `/contacto`, `/donaciones`, `/blog`, `/galeria`, `/en-vivo`.
- **Rol Administrador/Editorial (con login):** accede a `/admin/**` (login en `/admin/login`), gestiona contenido y publicaciones, ejecuta sync Facebook, revisa bitácora.

## 1) Roles y responsabilidades (RACI interno del repo)
- **Sponsor pastoral / Enlace pastoral**: visión y tono doctrinal.
- **PM**: roadmap, backlog, KPIs (eventos, oraciones).
- **Comunicaciones**: audiencias, mensajes, calendario editorial.
- **Editor en jefe**: línea editorial y calidad.
- **Asesor doctrinal**: revisión teológica.
- **UX/UI**: IA, wireframes, prototipos, tests.
- **Marca**: identidad visual, plantillas.
- **Arquitecto/Tech Lead**: arquitectura, seguridad, performance.
- **Frontend**: UI/A11y/SEO técnico.
- **Backend/Integraciones**: Graph API, formularios, buscador.
- **Admin de CMS**: modelos, taxonomías, permisos.
- **DevOps**: CI/CD, SSL, CDN, observabilidad, backups.
- **QA/Tester**: funcional + A11y + performance.
- **SEO & Analytics**: Schema.org, sitemaps, GA4/Search Console.
- **AV/Streaming**: En Vivo + embeds + fallback.
- **Community/CRM**: newsletter, flujos de bienvenida.
*(No crear usuarios para estos roles; solo estructurar y automatizar entregables.)*

## 2) Información de contenido (A–M) para poblar el sitio
### A) Resumen ejecutivo (V1)
- **Quiénes son (bio pública Facebook)**: “Somos una iglesia llamada a restaurar los principios perdidos de la iglesia reformada.” Página “IC Jesucristo es el Camino Oficial”, ~2.7k seguidores.
- **Audiencias**: congregantes (Lima), nuevos visitantes, audiencia online de cultos/sermones.
- **Tono/CTAs**: “ven al servicio”, “ver en vivo”, “síguenos”, bautizos/campañas.
- **Canales**: Facebook oficial (validar YouTube relacionado).
### B) Inventario inicial
- 1419661129444843 — video/live — 2025-08-?? — “Servicios de Agosto (listado)”
- 1045723480764268 — video/live — 2025-08-27 — “SERVICIO MIÉRCOLES 27-08-25”
- 912149674457462 — live — 2025-08-13 — “LA EPÍSTOLA UNIVERSAL DE JUDAS – Servicio”
### C) Calendario/Ubicación
- Preparar **schedule_locations.csv** + endpoint; completar vía Graph API / posts fijados.
### D) Identidad visual (V1 estimada)
- Logotipo en portada (cruz+llama+libro); colores aprox: #0A4D9C, #0CB9C5, #0B2E6E (ajustar al extraer).
### E) Taxonomías/temas
- Servicios dominicales/miércoles, bautizos, series bíblicas (“Epístola de Judas”).
- Taxonomías: Sermones, Series, Eventos, Noticias, Testimonios, Ministerios.
### F) Mapa de sitio (usar para rutas públicas)
```json
{sitemap_json}
```

## 3) Arquitectura y diseño (público vs admin)
- **Público (SSR/ISR híbrido)**:
  - Páginas: Inicio, Sermones (listado + filtros por serie/predicador/fecha), Detalle de Sermón, Eventos (próximos + históricos), Ministerios, Nosotros, Contacto (con reCAPTCHA), Donaciones (instrucciones), Blog/Noticias, Galería, En Vivo (detección live; fallback último sermón).
  - **SEO**: JSON-LD (Organization/Event/Article), OG/Twitter Cards, sitemap.xml y robots.txt.
  - **A11y**: landmarks semánticos, skip-link, focus visible, alt.
- **Admin (/admin)**:
  - Login NextAuth (Credentials + Facebook opcional).
  - Dashboard; CRUD de **Post/Sermon/Event/Series/Ministry/Media/Tag**.
  - **Flujo editorial**: draft → review → published → archived (con controles por rol).
  - **Bitácora/Auditoría** (quién/cambio/cuándo, antes/después).
  - **Sincronización Facebook** (Graph API o import por enlaces/embeds).
  - **Bloques y Ajustes**: héroes, banners, enlaces, datos de contacto, colores (colecciones `Blocks`/`Settings`).

## 4) Modelos de datos (dinámicos)
- **User**: name, email (unique), image?, passwordHash?, roles: string[], isActive, lastLoginAt.
- **AuditLog**: timestamp, userId/email, roles, ip, userAgent, action, entityType, entityId, before, after, reason?.
- **Post/Sermon/Event/Series/Ministry/Media/Tag**: usar y extender los esquemas A–M (slug único, status, fechas, version para **optimistic locking**).
- **Blocks/Settings**: claves simples para contenido global (hero, CTA, enlaces, etc.).

> Incluir `content_schemas.json` para Post/Sermon/Event (como en A–M) y ampliarlo si es necesario.

## 5) RBAC (roles y permisos)
- **admin**: todo (usuarios/roles, publicación, ajustes, sync, bitácora).
- **editor**: CRUD + publicar; no usuarios/roles.
- **author**: crea/edita borradores propios; no publica.
- **moderator**: modera comentarios/medios.
- **viewer**: sólo lectura (panel).
- **Permisos por acción**: contenido.read/create/update/delete/publish/unpublish; usuarios.read/create/update/delete/role-update; sync.read/run; audit.read.
- Implementar helper `can(user, action, resource, context)` y **middleware** para `/admin/**`.

## 6) Flujo editorial y vista previa
- Estados: draft → review → published → archived.
- Validaciones: slug único (kebab-case), `publishedAt` al publicar, `version` obligatoria en updates.
- **Preview** de borradores con token seguro (modo previsualización en Next.js).

## 7) Sincronización con Facebook (contenido público)
- **Graph API** (si hay tokens/permisos):
  - Endpoints: `/{page-id}/posts`, `/videos`, `/events` (v19 aprox).
  - Campos: `id,created_time,message,permalink_url,attachments{media_type,url},shares,comments.summary(true),likes.summary(true)`.
  - Mapeo:
    - `videos` con `live_status` o títulos “Servicio” → **Sermon**.
    - `events` → **Event**.
    - `posts` → **Post**.
  - Idempotencia por **fbId**.
- **Sin token**: usar **embeds oficiales** + “Importar por enlaces” en /admin.
- **Operación**: /admin/sync/facebook con **“Sincronizar ahora”** y lista de candidatos (aprobar/descartar).

## 8) Seguridad
- NextAuth con MongoDB Adapter, CSRF, cookies seguras, **rate limit** en `/api/auth/*` y `/api/admin/*`.
- Hash de passwords (bcrypt), bloqueo temporal por intentos fallidos.
- Sanitización de HTML y validación Zod.
- Headers de seguridad (CSP, X-Frame-Options, X-Content-Type-Options).
- Backups Atlas y restauración probada.
- Bitácora de login/logout y cambios críticos.

## 9) Estructura de carpetas (mínima)
```
/app
  /(site)
    page.tsx
    /sermones/page.tsx
    /sermones/[slug]/page.tsx
    /sermones/series/page.tsx
    /eventos/page.tsx
    /eventos/[slug]/page.tsx
    /ministerios/page.tsx
    /nosotros/page.tsx
    /contacto/page.tsx
    /donaciones/page.tsx
    /blog/page.tsx
    /galeria/page.tsx
    /en-vivo/page.tsx
  /admin
    /login/page.tsx
    /page.tsx
    /content/{posts,sermons,events,series,ministries,tags,media}/page.tsx
    /bitacora/page.tsx
    /sync/facebook/page.tsx
  /api
    /auth/[...nextauth]/route.ts
    /admin/{posts,sermons,events,series,ministries,tags,media}/route.ts
    /admin/sync/facebook/route.ts
    /contact/route.ts
/components
/lib { auth.ts, rbac.ts, audit.ts, db.ts, facebook.ts, content.ts }
/models { User.ts, AuditLog.ts, Post.ts, Sermon.ts, Event.ts, Series.ts, Ministry.ts, Media.ts, Tag.ts, Block.ts, Settings.ts }
/scripts { seed-admin.ts, import-facebook.ts, build-sitemap.ts }
/public { brand/logo.svg, og-default.jpg }
/styles { globals.css }
/.github { copilot-instructions.md }
```

## 10) Endpoints (server) – criterios
- `/api/admin/*`: **protegidos** por rol; Zod para validar; devuelven errores claros; registran **AuditLog**.
- `/api/contact`: valida con Zod + anti-spam (reCAPTCHA u honeypot) y envía a email/cola.
- `/api/admin/sync/facebook`: GET estado; POST ejecuta sync (Graph API o CSV de muestra si no hay token).

## 11) Seeds y configuración
- `scripts/seed-admin.ts`: crea admin inicial (`admin@icjc.org`) con contraseña segura.
- `.env.local` plantilla:
```
SITE_NAME="IC Jesucristo es el Camino"
SITE_URL="https://icjc.example.org"
MONGODB_URI="mongodb+srv://..."
NEXTAUTH_URL="https://icjc.example.org"
NEXTAUTH_SECRET="REEMPLAZAR"
FACEBOOK_CLIENT_ID=""
FACEBOOK_CLIENT_SECRET=""
FB_GRAPH_VERSION="v19.0"
FB_PAGE_ID=""
FB_ACCESS_TOKEN=""
```

## 12) Definition of Done (DoD)
- **Público**: Home, Sermones (listado+detalle+filtros), Eventos (próximos/históricos), Blog, Ministerios, Nosotros, Contacto, Donaciones, En Vivo con detección o fallback.
- **SEO/A11y**: JSON-LD, OG/Twitter, sitemap.xml, robots, WCAG 2.2 AA básico.
- **Admin**: Login; CRUD completo (Post/Sermon/Event); flujo editorial; **Bitácora** visible y filtrable; Sync Facebook manual; Blocks/Settings básicos.
- **Seguridad**: RBAC, CSRF, rate limit, validaciones Zod, headers seguros.
- **Rendimiento**: Lighthouse ≥ 90 (Performance/A11y/SEO) en páginas clave.

## 13) QA y CI/CD
- Tests unitarios (modelos/validaciones) + e2e básicos (CRUD, publicación, login).
- (CI/CD local/manual, sin GitHub Actions en desarrollo)

## 14) Contenidos A–M (pegar archivos/seeds donde aplique)
- `sitemap.json`:
```json
{sitemap_json}
```
- `content_schemas.json`:
```json
{content_schemas_json}
```
- `facebook_inventory.csv`:
```
{facebook_inventory_csv}
```
- `schedule_locations.csv`:
```
{schedule_locations_csv}
```
- `seed_posts.json`:
```json
{seed_posts_json}
```
- `seed_events.json`:
```json
{seed_events_json}
```
- `openapi_stub.yaml`:
```yaml
{openapi_yaml}
```

## 15) Instrucciones para Copilot
1. **Genera** el proyecto con la estructura indicada y todos los archivos/seeds A–M.
2. Implementa **/admin** con NextAuth + RBAC + CRUD + flujo editorial + **Bitácora**.
3. Agrega **Sync Facebook** (Graph API si hay token; si no, CSV/embeds) con idempotencia por `fbId`.
4. Implementa **páginas públicas** leyendo desde MongoDB (no estático): filtros, orden, paginación.
5. Incluye **JSON-LD**, metatags OG/Twitter, `sitemap.xml`, `robots.txt`.
6. Asegura **A11y** y Core Web Vitals “Good”.
7. Entrega **README.md** con cómo correr, sincronizar y operar /admin.
