import { IUser } from '../routes/auth/schema/userSchema.js'

export const getUsrToReq = (user: IUser) => {
  return {
    _id: user._id,
    email: user.email,
    fcmTokens: user.fcmTokens,
    name: user.name,
    profilePic: user.profilePic,
    tokenExpiredAt: user.tokenExpiredAt,
    createdAt: user.createdAt,
    accessToken: user.accessToken
  }
}
