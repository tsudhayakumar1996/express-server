import { NextFunction, Request, Response } from 'express'
import { CONNECTION_VIOLATES } from '../../../const/infoMsgs.js'
import { createError } from '../../../helpers/createError.js'
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
    next(createError(CONNECTION_VIOLATES, 409))
  } catch (error) {
    next(error)
  }
}
