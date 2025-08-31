```markdown
# Admin routes and guards (ICJC)

Routes under `app/(site)/api/admin/*` should be protected by server-side checks. Use middleware to verify session and roles for `/admin/**` pages.

Server API routes:
- `/api/admin/{posts,sermons,events,series,ministries,tags,media}/route.ts` - CRUD with Zod validation.
- `/api/admin/sync/facebook/route.ts` - sync endpoints (GET status, POST run).

Middleware:
- Redirect unauthenticated to `/admin/login`.
- Return 403 for insufficient role.
- Log all admin API requests to AuditLog.

Client-side guards are optional for UX; do not rely on them for security.
```
