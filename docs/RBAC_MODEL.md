```markdown
# RBAC model (ICJC)

Roles:
- admin
- editor
- author
- moderator
- viewer

Permissions (actions):
- content.read/create/update/delete/publish/unpublish
- users.read/create/update/delete/role-update
- sync.read/run
- audit.read

Helper: `can(user, action, resource, context)` returns boolean. Implement server-side middleware that rejects with 403 when unauthorized.

Example mapping:
- admin: all
- editor: content.* except users.*
- author: content.create, content.read, content.update (own), content.submit_for_review
- moderator: content.read, media.moderate
- viewer: content.read

Store roles on `User.roles: string[]` and evaluate at runtime. Use optimistic locking (`version` field) on content updates.
```
