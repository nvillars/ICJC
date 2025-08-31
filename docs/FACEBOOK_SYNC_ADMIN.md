```markdown
# Facebook Sync (Admin)

Endpoint: `/admin/sync/facebook`

Modes:
- Graph API (requires `FB_ACCESS_TOKEN`) — fetch `/videos`, `/posts`, `/events`.
- Manual import: paste permalinks or upload CSV.

Mapping rules:
- videos with live_status or title containing "Servicio" -> Sermon
- events -> Event
- posts -> Post

Idempotency: use `fbId` from Facebook as unique key. If exists, update; else create draft.

Approval: imported items become `draft` and appear in admin candidates list for approval.
```
