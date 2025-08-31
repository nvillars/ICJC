```markdown
# Editorial workflow (ICJC)

States: draft → review → published → archived

Transitions:
- Author: create draft, edit own draft, submit for review
- Editor: move review → published, request changes
- Admin: override states, archive

Implement optimistic locking with `version` and require `publishedAt` when publishing.
```
