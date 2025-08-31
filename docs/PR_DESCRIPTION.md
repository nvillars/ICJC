# PR: feat: ICJC sitio público dinámico + panel /admin with RBAC, workflow, bitácora and Facebook sync

Branch: feature/icjc-mvp-admin

What to test locally:
- Install deps: npm ci
- Create `.env.local` with MONGODB_URI and NEXTAUTH_SECRET
- Run seed: npm run seed:admin
- Start dev: npm run dev

Test flows:
- Visit `/` and `/admin` (placeholders)
- Run seed and check admin user in DB
- Check docs links in `/admin`

DoD checklist attached.
