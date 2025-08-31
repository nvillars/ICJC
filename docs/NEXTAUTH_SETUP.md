```markdown
# NEXTAUTH Setup (ICJC)

Instrucciones para configurar NextAuth (Credentials + Facebook OAuth opcional) con MongoDB Adapter.

1. Variables `.env.local` (ver `docs/README-ADMIN.md`).
2. Instalar dependencias: `next-auth`, `@next-auth/mongodb-adapter` (o adapter personalizado), `bcrypt`.
3. Configurar `app/api/auth/[...nextauth]/route.ts` con Providers: Credentials + Facebook (opcional).
4. Usar `MongoDBAdapter` y la colección `users`.
5. En Credenciales, autenticar contra `User` (Mongoose) con `bcrypt.compare`.
6. Añadir `session` callback para incluir `roles` y `userId`.
7. Proteger rutas de admin con middleware (ver `docs/ADMIN_ROUTES_AND_GUARDS.md`).

Notas de seguridad: NextAuth SECRET fuerte, cookies seguras y SameSite, CSRF activado.
```
