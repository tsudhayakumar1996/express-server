import { NextFunction, Request, Response } from 'express'
import { IUser } from '../../auth/schema/userSchema.js'

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // user from req
    const user: Partial<IUser> | undefined = req?.user
    delete user?.refreshToken
    delete user?.fcmTokens
    delete user?.tokenExpiredAt
    delete user?.accessToken

    // sending response
    res.json({ data: user })
  } catch (error) {
    next(error)
  }
}
