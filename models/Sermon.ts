import mongoose, { Schema } from 'mongoose'

const SermonSchema = new Schema({
  title: String,
  slug: { type: String, index: true, unique: true },
  predicador: String,
  serie: { type: Schema.Types.ObjectId, ref: 'Series' },
  pasaje: String,
  status: { type: String, default: 'draft' },
  videoEmbed: String,
  thumbnail: String,
  thumbnailAlt: String,
  publishedAt: Date,
  fbId: { type: String, index: true },
  version: { type: Number, default: 1 }
}, { timestamps: true })

export default mongoose.models.Sermon || mongoose.model('Sermon', SermonSchema)
