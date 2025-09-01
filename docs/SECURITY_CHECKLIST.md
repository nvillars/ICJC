```markdown
# Security checklist (ICJC MVP)

- NextAuth: secure secret, cookies secure, CSRF enabled
- Passwords hashed with bcrypt
- Rate limit on `/api/auth/*` and `/api/admin/*` (e.g., 100 req/15min per IP)
- Input validation with Zod
- HTML sanitization for rich content
- CSP headers, X-Frame-Options, X-Content-Type-Options (added via `next.config.js` headers())
- Recommend enabling HSTS in production (via hosting or proxy) and review the CSP to allow any additional external services before deploy.
- HTTPS required in production; HSTS header
- MongoDB Atlas access rules and backups
- AuditLog for admin actions
- 2FA support optional
```
