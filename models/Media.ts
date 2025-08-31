import mongoose, { Schema } from 'mongoose'

const MediaSchema = new Schema({
  filename: String,
  url: String,
  alt: String,
  width: Number,
  height: Number,
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true })

export default mongoose.models.Media || mongoose.model('Media', MediaSchema)
