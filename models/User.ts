import mongoose, { Schema } from 'mongoose'

const UserSchema = new Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  image: { type: String },
  passwordHash: { type: String },
  roles: { type: [String], default: ['viewer'] },
  isActive: { type: Boolean, default: true },
  lastLoginAt: { type: Date }
}, { timestamps: true })

export default mongoose.models.User || mongoose.model('User', UserSchema)
