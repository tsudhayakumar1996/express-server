import mongoose from 'mongoose'
import { USER_MODEL } from '../const/modelConsts.js'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: Number,
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model(USER_MODEL, userSchema)
