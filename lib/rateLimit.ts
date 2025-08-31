const MAP = new Map<string, { count: number, resetAt: number }>()

export function rateLimit(req: Request) {
  const ip = (req as any).headers?.get ? (req as any).headers.get('x-forwarded-for') || 'local' : 'local'
  const key = `rl:${ip}`
  const now = Date.now()
  const entry = MAP.get(key) || { count: 0, resetAt: now + 15 * 60 * 1000 }
  return {
    async check() {
      if (now > entry.resetAt) {
        entry.count = 0
        entry.resetAt = now + 15 * 60 * 1000
      }
      entry.count += 1
      MAP.set(key, entry)
      return entry.count <= 100
    }
  }
}
