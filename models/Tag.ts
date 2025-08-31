import mongoose, { Schema } from 'mongoose'

const TagSchema = new Schema({
  name: String,
  slug: { type: String, index: true, unique: true }
}, { timestamps: true })

export default mongoose.models.Tag || mongoose.model('Tag', TagSchema)
