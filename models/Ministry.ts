import mongoose, { Schema } from 'mongoose'

const MinistrySchema = new Schema({
  title: String,
  slug: { type: String, index: true, unique: true },
  description: String,
  contact: String
}, { timestamps: true })

export default mongoose.models.Ministry || mongoose.model('Ministry', MinistrySchema)
