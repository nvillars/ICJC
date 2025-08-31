```markdown
# Schemas: Users and Content (ICJC)

User (Mongoose):
- name: string
- email: string (unique)
- image?: string
- passwordHash?: string
- roles: string[]
- isActive: boolean
- lastLoginAt?: Date
- createdAt, updatedAt

AuditLog:
- timestamp: Date
- userId: ObjectId
- userEmail: string
- roles: string[]
- ip?: string
- userAgent?: string
- action: string
- entityType: string
- entityId: ObjectId | string
- before: object
- after: object
- reason?: string

Post/Sermon/Event (common):
- title, slug (unique), status (draft/review/published/archived)
- excerpt, content (rich text sanitized)
- tags: [ObjectId]
- authors: [ObjectId]
- publishedAt?: Date
- createdAt, updatedAt
- fbId?: string (optional)
- version: number (optimistic locking)

Index slugs, fbId, and publishedAt where relevant.
```
