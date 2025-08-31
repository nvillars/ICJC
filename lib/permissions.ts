import { can } from './rbac'

export const ACTIONS = {
  CONTENT_CREATE: 'content.create',
  CONTENT_READ: 'content.read',
  CONTENT_UPDATE: 'content.update',
  CONTENT_DELETE: 'content.delete',
  CONTENT_PUBLISH: 'content.publish'
}

export function checkPermission(user: any, action: string, resource?: string, context?: any) {
  return can(user, action, resource, context)
}
