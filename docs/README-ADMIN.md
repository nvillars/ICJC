
# README-ADMIN – Panel de Administración **/admin**
**Proyecto:** Sitio web IC “Jesucristo es el Camino” (ICJC)  
**Versión:** 1.0 • **Fecha:** 2025-08-31 • **Zona horaria:** America/Lima

> Este README está dirigido a **administradores, editores, autores y moderadores** del sitio. Complementa el manual largo y la hoja rápida:
> - `docs/MANUAL-OPERACION-ADMIN-ICJC.md`
> - `docs/CHEATSHEET-ADMIN-ICJC.md`

---

## 1) Acceso rápido
- **Panel:** `https://TU-DOMINIO/admin`  
- **Login:** `https://TU-DOMINIO/admin/login`  
- **Ayuda dentro del panel:** ícono `?` en la barra superior → abre el Manual en nueva pestaña.

> Sugerencia: habilitar `https://admin.TU-DOMINIO` (opcional) apuntando a `/admin` para acceso directo del equipo.

---

## 2) Primeros pasos (solo una vez)
### 2.1 Requisitos
- Navegador actualizado (Chrome/Edge/Firefox/Safari).
- Credenciales personales (no compartidas).

> Los pasos técnicos de deploy/configuración los gestiona el equipo de desarrollo. Si trabajas localmente:
- Node 18+ / 20+
- MongoDB Atlas (URI)
- Variables de entorno en `.env.local` (ver abajo)
- `npm` o `pnpm`

### 2.2 Variables `.env.local` (plantilla)
```bash
SITE_NAME="IC Jesucristo es el Camino"
SITE_URL="https://TU-DOMINIO"

# Auth
NEXTAUTH_URL="https://TU-DOMINIO"
NEXTAUTH_SECRET="REEMPLAZAR_CON_VALOR_FUERTE"

# DB
MONGODB_URI="mongodb+srv://usuario:pass@cluster/ICJC?retryWrites=true&w=majority"

# OAuth Facebook (opcional)
FACEBOOK_CLIENT_ID=""
FACEBOOK_CLIENT_SECRET=""

# Graph API Facebook (opcional para sync)
FB_GRAPH_VERSION="v19.0"
FB_PAGE_ID=""
FB_ACCESS_TOKEN=""
```

### 2.3 Crear el primer usuario **admin**
> Solo si el sistema está recién instalado y aún no hay usuarios.

Ejecuta el **seed** (desarrollo):
```bash
# con npm
npm run tsx -- scripts/seed-admin.ts

# con pnpm
pnpm tsx scripts/seed-admin.ts
```
El script crea por defecto `admin@icjc.org` y pedirá una contraseña segura (o la tomará de variables si están definidas).

---

## 3) Roles y permisos
- **admin:** acceso total (usuarios, roles, publicación, ajustes, sync, bitácora).
- **editor:** CRUD de contenidos y **publica**; no gestiona usuarios.
- **author:** crea/edita **borradores propios**; no publica.
- **moderator:** modera testimonios/comentarios/medios (si aplica).
- **viewer:** solo lectura (reportes).

### Estados editoriales
`draft → review → published → archived`

> *Author* envía a *review*; *Editor/Admin* **publica**. Todo queda registrado en **Bitácora**.

---

## 4) Tareas habituales (paso a paso)

### 4.1 Publicar un **Sermón**
1. Ir a **Contenido ▸ Sermones ▸ Nuevo**.  
2. Completar **Título**, **Predicador**, **Fecha (AAAA-MM-DD)**, **Serie** (opcional), **Pasaje**.  
3. En **Video/Fuente**, pega el **permalink** público de Facebook (live o grabado).  
4. Sube una **miniatura** (con *alt* descriptivo).  
5. Guarda como **Borrador** → **Enviar a revisión** → *Editor/Admin* **Publica**.

### 4.2 Crear un **Evento**
1. **Contenido ▸ Eventos ▸ Nuevo**.  
2. **Título**, **Inicio** (AAAA-MM-DDThh:mm-05:00), **Fin** (si aplica), **Lugar**, **Dirección**, **Mapa (URL de Google Maps)**.  
3. Publica (Editor/Admin). Al expirar, pasa a **Históricos** (no se borra).

### 4.3 Post/Noticia o **Devocional**
1. **Contenido ▸ Posts ▸ Nuevo**.  
2. **Título**, **Extracto** (140–160 chars), **Contenido** (con imágenes/embeds), **Tags**.  
3. Revisión → **Publicar**.

### 4.4 **En Vivo**
- Si el sistema detecta live en Facebook, se muestra automáticamente en `/en-vivo`.
- Si no, pega manualmente el **permalink** del video en el panel.

### 4.5 **Gestión de usuarios**
- **Usuarios ▸ Nuevo**: crea cuenta con **rol adecuado**.  
- Para cambiar permisos: **Editar usuario** → ajustar `rol`.  
- Para desactivar una cuenta: cambia **estado** a “inactivo”.

---

## 5) Sincronización con Facebook
- Ir a **Sincronización ▸ Facebook**.  
- **Sincronizar ahora** (requiere `FB_ACCESS_TOKEN`) o **Importar por enlaces** (sin token).  
- Revisa la **lista de candidatos** → Aprueba (se crean como **borrador**).  
- Mapeo sugerido:
  - `/{{page-id}}/videos`: si `live_status` o títulos con “Servicio” → **Sermón**.
  - `/{{page-id}}/events` → **Evento**.
  - `/{{page-id}}/posts` → **Post**.

> Duplicados se evitan por `fbId`. Solo se importa contenido **público**.

---

## 6) Bitácora (auditoría)
- **Bitácora:** verás **quién cambió qué y cuándo** (login/logout, create/update/delete, publish).  
- Filtros por **fecha, usuario, entidad, acción**.  
- Detalle **antes/después** (cambios clave).  
- Puedes **exportar** CSV/JSON (si está habilitado por el equipo técnico).

---

## 7) SEO y Accesibilidad (checklist rápido)
- **Títulos** claros (≤ 60–70 chars) y **Extracto** (≤ 160 chars).  
- **Alt** en todas las imágenes.  
- **Fechas** correctas en *America/Lima*.  
- **Campos clave**: predicador, pasaje, serie, lugar de evento.  
- Links revisados (“Cómo llegar”, “Ver en vivo”).  
- Evita subir imágenes con texto ilegible o bajo contraste.

---

## 8) Flujo editorial recomendado
- **Reunión semanal (15 min):** próximos eventos, serie actual, responsables.  
- **Calendario editorial:** 4–6 categorías (Devocional semanal, Testimonio quincenal, Serie mensual).  
- **Revisión de calidad:** extractos, ortografía, respiración visual (párrafos/bullets).  
- **Métricas clave:** vistas de sermones, permanencia en “En Vivo”, formularios de Oración/Contacto, inscripciones a eventos.

---

## 9) Seguridad y privacidad
- Usa **cuentas personales**; no compartas contraseñas.  
- Cambia la contraseña si sospechas uso indebido.  
- Respeta **consentimiento** para imágenes, especialmente **menores**.  
- No publiques información sensible (salud, datos personales sin permiso).  
- Cierra sesión al terminar, sobre todo en equipos compartidos.

---

## 10) Solución de problemas (FAQ)
**P: Publico y no aparece en la web.**  
R: Verifica **estado = published**, **fecha** correcta, y luego recarga. Revisa que la sección donde debería aparecer no tenga filtros adicionales.

**P: El video no se ve.**  
R: Asegúrate de usar un **permalink público** de Facebook. Si el video es privado o restringido, no se mostrará.

**P: No puedo iniciar sesión.**  
R: Pide **reset** a un *admin*. Revisa mayúsculas/minúsculas del email y conexión.

**P: No encuentro el evento en el mapa.**  
R: Pega la **URL exacta de Google Maps** en el campo `mapUrl` del Evento.

**P: Al editar aparece error de versión.**  
R: Otro usuario actualizó el mismo contenido. Vuelve a cargar, revisa cambios en **Bitácora** y reintenta.

---

## 11) SOPs (procedimientos) – Atajos prácticos
**SOP-01 – Publicación rápida de sermón dominical**  
- Crear Sermón (título, predicador, fecha, pasaje) → pegar permalink → miniatura (alt) → Enviar a revisión → Publicar.

**SOP-02 – Crear evento de bautizos**  
- Evento (título, fecha/hora, lugar, mapa) → CTA “Inscribirme” (si aplica) → Publicar → Difundir en Portada.

**SOP-03 – Corrección de contenido sensible**  
- Editar → Añadir “Motivo” → Guardar → Publicar/Despublicar según política → Verificar **Bitácora**.

**SOP-04 – Importar desde Facebook**  
- Sincronizar ahora → Aprobar candidatos → Completar campos faltantes → Publicar.

---

## 12) Capturas (referenciales)
> Coloca tus imágenes en `public/admin/screenshots/` y actualiza estos enlaces.

- Dashboard: `![Dashboard](./public/admin/screenshots/dashboard.png)`  
- Lista de sermones: `![Sermones](./public/admin/screenshots/sermones.png)`  
- Editor de evento: `![Evento](./public/admin/screenshots/evento.png)`  
- Bitácora: `![Bitácora](./public/admin/screenshots/bitacora.png)`  
- Sync Facebook: `![Sync Facebook](./public/admin/screenshots/sync-facebook.png)`

---

## 13) Contactos
- **Editor responsable:** nombre / email  
- **Admin técnico:** nombre / email  
- **Soporte streaming/domingo:** nombre / teléfono

---

## 14) Historial de cambios (de este README)
- 1.0 – 2025-08-31: versión inicial.
