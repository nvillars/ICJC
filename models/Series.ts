import mongoose, { Schema } from 'mongoose'

const SeriesSchema = new Schema({
  title: String,
  slug: { type: String, index: true, unique: true },
  description: String,
  startDate: Date,
  endDate: Date
}, { timestamps: true })

export default mongoose.models.Series || mongoose.model('Series', SeriesSchema)
