import mongoose, { Schema } from 'mongoose'

const SettingsSchema = new Schema({
  key: { type: String, unique: true },
  value: Schema.Types.Mixed
}, { timestamps: true })

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema)
