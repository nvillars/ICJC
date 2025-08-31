import mongoose, { Schema } from 'mongoose'

const BlockSchema = new Schema({
  key: { type: String, unique: true },
  value: Schema.Types.Mixed
}, { timestamps: true })

export default mongoose.models.Block || mongoose.model('Block', BlockSchema)
