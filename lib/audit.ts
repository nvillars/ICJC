import { connect } from './db'

export async function logAudit(entry: any) {
  try {
    await connect()
    const Audit = (await import('../models/AuditLog')).default
    const doc = await Audit.create({ timestamp: new Date(), ...entry })
    return doc
  } catch (e) {
    /* eslint-disable-next-line no-console */
    console.debug('logAudit error', e)
    return null
  }
}
