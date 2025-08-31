Pruebas y utilidades para el panel admin

- Para crear el admin local:
  npm run seed:admin
  (usuario por defecto: admin@icjc.org / ChangeMe123!)

- Prueba headless de login (requiere Playwright):
  npm i -D playwright
  npx playwright install
  node scripts/auto-login.js

- La prueba `scripts/auto-login.js` abre un navegador headless, hace login en /admin/login y consulta `/api/auth/session`. Se deja como herramienta dev; puedes borrarla antes de deploy si no la quieres en el repo.
