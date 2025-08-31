import mongoose, { Schema } from 'mongoose'

const EventSchema = new Schema({
  title: String,
  slug: { type: String, index: true, unique: true },
  description: String,
  start: Date,
  end: Date,
  place: String,
  mapUrl: String,
  status: { type: String, default: 'draft' },
  publishedAt: Date,
  fbId: { type: String, index: true },
  version: { type: Number, default: 1 }
}, { timestamps: true })

export default mongoose.models.Event || mongoose.model('Event', EventSchema)
