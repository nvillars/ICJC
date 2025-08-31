# ICJC — Sitio público dinámico + Panel /admin (MVP scaffold)

Este repo contiene un scaffold inicial para el MVP solicitado: Next.js + TypeScript + Tailwind + Mongoose + NextAuth.

Pasos rápidos para ejecutar localmente (Windows PowerShell):

1) Instalar dependencias

	npm install

2) Configurar variables de entorno (crear `.env.local`)

	MONGODB_URI=mongodb://127.0.0.1:27017/icjc
	NEXTAUTH_SECRET=REEMPLAZAR_CON_VALOR_FUERTE
	NEXTAUTH_URL=http://localhost:3000

3) Crear usuario admin (seed)

	npm run seed:admin

	Credenciales por defecto: admin@icjc.org / ChangeMe123!

4) Iniciar app en dev

	npm run dev

5) Verificar en el navegador

	- Home: http://localhost:3000
	- Admin login: http://localhost:3000/admin/login

Notas rápidas:
- El seed script crea un usuario admin local usando una conexión a MongoDB. Asegúrate de que MongoDB esté corriendo.
	- Nota: Si no defines `MONGODB_URI`, la aplicación por defecto usará la base de datos local `icjc` (mongodb://127.0.0.1:27017/icjc).
- Si la página de login redirige en bucle, borra cookies o reinicia el servidor; ya tenemos una exclusión en `middleware.ts` para `/admin/login`.
- Para producción, reemplaza `NEXTAUTH_SECRET` por un secreto fuerte y configura `MONGODB_URI` a Atlas, además de asegurar cookies y HTTPS.


Ver `docs/` para manuales y especificaciones.
