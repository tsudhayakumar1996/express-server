import { NextFunction, Request, Response } from 'express'
import { LOG_OUT_SUCCESS } from '../../../const/infoMsgs.js'
import { removeAuthCookie } from '../../../helpers/removeAuthCookie.js'
import User from '../schema/userSchema.js'

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.accessToken

    // null token on db
    if (token) {
      await User.findOneAndUpdate(
        { accessToken: token },
        { accessToken: null } // or you could store a separate "revoked" flag
      )
    }

    // remove cookie in req
    removeAuthCookie(res)

    // response to client
    res.json({ message: LOG_OUT_SUCCESS })
  } catch (error) {
    next(error)
  }
}
