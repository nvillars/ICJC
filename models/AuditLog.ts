import mongoose, { Schema } from 'mongoose'

const AuditLogSchema = new Schema({
  timestamp: { type: Date, default: Date.now },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  userEmail: String,
  roles: [String],
  ip: String,
  userAgent: String,
  action: String,
  entityType: String,
  entityId: Schema.Types.Mixed,
  before: Schema.Types.Mixed,
  after: Schema.Types.Mixed,
  reason: String
}, { timestamps: false })

export default mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema)
