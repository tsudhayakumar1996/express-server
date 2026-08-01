import mongoose from 'mongoose'
import { USER_MODEL } from '../const/modelConsts.js'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profilePic: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: true },
  tokenExpiredAt: { type: Date, required: true }
})

const User = mongoose.model(USER_MODEL, userSchema)

export default User
