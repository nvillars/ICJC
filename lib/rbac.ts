export function can(user: any, action: string, resource?: string, context?: any) {
  if (!user) return false
  const roles: string[] = user.roles || []
  if (roles.includes('admin')) return true
  if (roles.includes('editor')) {
    if (action.startsWith('content.')) return true
  }
  if (roles.includes('author')) {
    if (action === 'content.create') return true
    if (action === 'content.read') return true
    if (action === 'content.update' && context && context.owns) return true
  }
  return false
}
