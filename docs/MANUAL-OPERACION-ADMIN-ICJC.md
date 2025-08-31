# Manual de Operación – Panel **/admin** (IC Jesucristo es el Camino)
**Versión:** 1.0 — **Fecha:** 2025-08-31 — **Zona horaria:** America/Lima  
**Dirigido a:** Equipo pastoral y de comunicación (admins, editores, autores, moderadores)  
**Objetivo:** Mantener el sitio **dinámico y actualizado** sin depender de programadores, con trazabilidad segura (bitácora/auditoría).

---

## 0) Acceso y seguridad
- **URL del panel:** `https://TU-DOMINIO/admin` (login en `https://TU-DOMINIO/admin/login`).  
  > Recomendado: también habilitar subdominio opcional `https://admin.TU-DOMINIO` con redirección al panel.
- **Ingreso:** email + contraseña. Si está habilitado, puedes usar **Facebook Login** (misma cuenta autorizada).
- **Roles:** `admin`, `editor`, `author`, `moderator`, `viewer` (ver capacidades en el apartado 2).
- **Buenas prácticas:**
  - No compartas credenciales. Usa cuentas personales con el rol correcto.
  - Activa 2FA si se habilita (TOTP). 
  - Cambia contraseñas al menos cada 6–12 meses o ante sospecha.
  - Cierra sesión al finalizar (especialmente en equipos compartidos).

---

## 1) Mapa del panel (qué encontrarás)
- **Dashboard:** atajos, métricas (últimos sermones, posts, eventos próximos, cambios recientes).
- **Contenido:** *Sermones, Series, Eventos, Posts/Noticias, Ministerios, Galería/Media, Tags*.
- **Usuarios:** altas, bajas, cambio de roles, activación/desactivación.
- **Bitácora (auditoría):** registro de *quién cambió qué y cuándo*; filtros y detalle.
- **Sincronización Facebook:** importar posts/videos/eventos públicos de la página oficial.
- **Ajustes:** identidad visual, enlaces, mensajes fijos (según configuración del proyecto).

---

## 2) Roles y permisos (RBAC)
- **admin:** todo (gestión de usuarios/roles, publicación, ajustes, sync, bitácora).
- **editor:** gestiona contenido y **publica**; no gestiona usuarios/roles.
- **author:** crea/edita **borradores propios**; no publica.
- **moderator:** modera testimonios/comentarios/medios (si aplica).
- **viewer:** sólo lectura del panel (reportes).

### Estados editoriales
`draft → review → published → archived`  
- *Author* envía a *review*; *Editor/Admin* publican.  
- Los contenidos publicados pueden **despublicarse** (unpublish) si es necesario.

---

## 3) Flujo de trabajo – paso a paso

### 3.1 Crear un **Sermón**
1. Ir a **Contenido ▸ Sermones ▸ Nuevo**.  
2. Completar: **Título**, **Predicador**, **Fecha** (AAAA-MM-DD), **Serie** (opcional), **Pasaje bíblico**, **Resumen**.
3. **Video**: pega el **permalink** del video de Facebook (live o grabado) en el campo “Fuente/Embed”.  
4. Añade **miniatura** (imagen) con texto alternativo (*alt*).
5. Guardar como **draft** → “Enviar a revisión” → el *Editor/Admin* **publica**.
6. El sermón aparecerá en **/sermones** y en la portada si así está configurado.

**Buenas prácticas:**  
- Usa títulos claros: “Servicio Dominical – 2025-09-14 – Juan 3:16”.  
- Completa **JSON-LD** (el sistema lo genera; sólo cuida campos básicos y fechas correctas).

### 3.2 Crear un **Evento**
1. **Contenido ▸ Eventos ▸ Nuevo**.  
2. **Título**, **Fecha y hora de inicio** (y fin si aplica), **Lugar**, **Dirección**, **Link de mapa** (Google Maps).  
3. Añade **Descripción** y **CTA** (“Cómo llegar”, “Inscribirme”).  
4. **Publicar** (editor/admin).  
5. Al pasar la fecha, el evento se mueve a **históricos** automáticamente (no se borra).

### 3.3 Crear un **Post/Noticia o Devocional**
1. **Contenido ▸ Posts ▸ Nuevo**.  
2. **Título**, **Extracto** (1–2 líneas), **Contenido** (puede incluir imágenes/embeds), **Tags**.  
3. Guardar **draft** → “Enviar a revisión” → **Publicar** (editor/admin).  
4. Se genera **slug** limpio y metadatos SEO automáticamente (puedes ajustar el *excerpt*).

### 3.4 **Ministerios** y **Páginas informativas**
- **Contenido ▸ Ministerios**: crea ficha por ministerio (Jóvenes, Niños, Matrimonios).  
- Incluye: propósito, horarios, responsable/contacto, CTA (“Únete”, “Escríbenos”).

### 3.5 **Galería / Media**
- **Contenido ▸ Media**: sube imágenes (JPG/PNG/WEBP) ≤ 2000px lado mayor.  
- Completa **alt** (accesibilidad). Usa carpetas/álbumes por fecha o evento.

### 3.6 **Página En Vivo**
- Si hay live en Facebook, el sistema puede detectarlo; si no, pega el **permalink embed**.  
- Si no hay transmisión, se muestra el **último sermón** como fallback.

---

## 4) Sincronización con Facebook (página oficial)
- Ir a **/admin/sync/facebook**.  
- Botón **“Sincronizar ahora”** (si hay token de Graph API) o **Importar por enlaces** (sin token).  
- Revisar la **lista de candidatos**: aprobar/descartar; se crean como **draft** en *Sermones/Eventos/Posts*.
- Idempotencia por `fbId`: evita duplicados.
- Si falla el token: seguir con **embeds oficiales** pegando el *permalink* manual.

> **Nota:** Respetar siempre los Términos de Facebook; sólo contenido **público** de la página oficial.

---

## 5) SEO y Accesibilidad (checklist rápido)
- Títulos concisos (≤ 60–70 caracteres); **Extracto** informativo (≤ 160 chars).  
- **Alt** descriptivo en todas las imágenes.  
- **Fechas correctas** y zona horaria *America/Lima*.  
- Campos clave llenos (predicador, pasaje, serie, lugar del evento).  
- Evita imágenes con texto minúsculo; usa contraste adecuado.  
- Verifica enlaces (“Cómo llegar”, “Ver en vivo”).

---

## 6) Política de imágenes y consentimiento
- Pedir **consentimiento** para fotos de congregantes, especialmente **menores**.  
- Info sensible (salud, situaciones personales) **no publicar** sin autorización explícita.  
- Si se solicita retiro de una imagen, **despublicar** de inmediato y registrarlo en **Bitácora**.

---

## 7) Bitácora (auditoría)
- Menú **Bitácora**: filtra por **fecha, usuario, entidad, acción**.  
- Cada entrada muestra **antes/después** (resumen de cambios).  
- Buenas prácticas: agrega **motivo** (“reason”) en cambios sensibles (ej.: corrección doctrinal, privacidad).  
- **Exportar**: descarga CSV/JSON para archivo mensual (si está habilitado).

---

## 8) Mantenimiento y continuidad
- **Respaldos**: MongoDB Atlas tiene backups; solicita al responsable técnico un **rescate mensual de prueba**.  
- **Actualizaciones**: revisar semanalmente el **panel** (errores, pendientes).  
- **Calendario editorial**: define 4–6 categorías con frecuencia (p.ej., Devocional semanal, Testimonio quincenal, Serie mensual).  
- **Reunión breve** (15–20 min/semana): revisar métricas, próximos eventos, tareas y responsables.

### Métricas pastorales sugeridas
- Visitas al sitio, vistas de página de **Sermones**.  
- Reproducciones y permanencia en “En Vivo”.  
- Formularios enviados: **Oración**, **Contacto**, **Voluntariado**.  
- Inscritos a **Eventos**.  
- Crecimiento en redes a partir de publicaciones del sitio.

---

## 9) Solución de problemas
- **No puedo iniciar sesión:** verifica email/contraseña; solicita **reset** a un *admin*; revisa conexión.  
- **No se ve el video:** asegúrate de pegar el **permalink público** de Facebook. Si es privado, no se mostrará.  
- **No aparece en la web tras publicar:** revisa estado (published), fecha, y limpia caché del navegador.  
- **Evento sin mapa:** pega URL válida de Google Maps en el campo **mapUrl**.  
- **Texto sin formato/errores de estilo:** usa los bloques de editor y evita pegar desde Word con formato oculto.

---

## 10) Plantillas (copiar y pegar)

### 10.1 Plantilla de **Sermón**
- Título: *“Servicio Dominical – AAAA-MM-DD – [Serie opcional] – [Pasaje]”*
- Predicador: *Nombre Apellido*
- Pasaje: *Libro capítulo:versículo(s)*
- Resumen (2–3 líneas): *Idea central + aplicación*
- Enlace video (Facebook): *permalink*
- Miniatura: *imagen 1280×720*, alt: *“Predicador compartiendo mensaje sobre [tema]”*
- Tags: *servicio, serie-[nombre], pasaje-[libro]*

### 10.2 Plantilla de **Evento**
- Título: *“Servicio [Día] – AAAA-MM-DD – [Tema opcional]”*
- Inicio: *AAAA-MM-DDThh:mm-05:00*
- Lugar/Dirección/Mapa
- CTA: *“Cómo llegar”* / *“Inscribirme”*
- Descripción: *qué, para quién, qué traer, costo (si aplica)*

### 10.3 Plantilla de **Post/Devocional**
- Título: *“[Serie/tema] – [título breve]”*
- Extracto: *140–160 caracteres con idea principal*
- Contenido: *introducción breve, desarrollo con 2–3 subtítulos, cierre y CTA*

---

## 11) Contactos y escalamiento
- **Editor responsable:** nombre / email
- **Admin técnico:** nombre / email
- **Soporte de urgencia (streaming/evento):** nombre / teléfono
- **Políticas y permisos (imágenes):** nombre / email

> Mantén este manual en el repositorio (`docs/MANUAL-OPERACION-ADMIN-ICJC.md`) y actualízalo cuando cambie el proceso.
