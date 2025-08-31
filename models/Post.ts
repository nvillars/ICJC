import mongoose, { Schema } from 'mongoose'

const PostSchema = new Schema({
  title: String,
  slug: { type: String, index: true, unique: true },
  status: { type: String, default: 'draft' },
  excerpt: String,
  content: Schema.Types.Mixed,
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  authors: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  publishedAt: Date,
  fbId: { type: String, index: true },
  version: { type: Number, default: 1 }
}, { timestamps: true })

export default mongoose.models.Post || mongoose.model('Post', PostSchema)
