import type { ObjectId } from 'mongoose'
import mongoose, { Model } from 'mongoose'
import { USER_MODEL } from '../const/modelConsts.js'

// the document shape
export interface IUser {
  _id: ObjectId
  name: string
  email: string
  profilePic: string
  createdAt: Date
  accessToken: string
  refreshToken?: string
  tokenExpiredAt: Date
  fcmTokens?: string[]
}

interface UpsertGoogleData {
  email: string
  name: string
  profilePic: string
  accessToken: string
  refreshToken?: string
  tokenExpiredAt: Date
}

// the model shape (adds your static on top of the base Model)
interface IUserModel extends Model<IUser> {
  upsertFromGoogle(data: UpsertGoogleData): Promise<IUser>
  syncFcmToken(userId: ObjectId, token: string, platform: 'mobile' | 'web'): Promise<IUser>
}

const userSchema = new mongoose.Schema<IUser, IUserModel>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profilePic: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  accessToken: { type: String, required: true },
  refreshToken: { type: String },
  tokenExpiredAt: { type: Date, required: true },
  fcmTokens: {
    mobile: { type: String, default: null },
    web: { type: String, default: null }
  }
})

userSchema.statics.upsertFromGoogle = async function (data: UpsertGoogleData) {
  const update: Record<string, unknown> = {
    name: data.name,
    profilePic: data.profilePic,
    accessToken: data.accessToken,
    tokenExpiredAt: data.tokenExpiredAt
  }
  if (data?.refreshToken) update.refreshToken = data.refreshToken

  return this.findOneAndUpdate(
    { email: data.email },
    { $set: update, $setOnInsert: { email: data.email } },
    { upsert: true, returnDocument: 'after', runValidators: true }
  )
}

userSchema.statics.syncFcmToken = async function (userId: string, token: string, platform: 'mobile' | 'web') {
  return this.findByIdAndUpdate(userId, { $set: { [`fcmTokens.${platform}`]: token } }, { returnDocument: 'after' })
}

const User = mongoose.model<IUser, IUserModel>(USER_MODEL, userSchema)

export default User
