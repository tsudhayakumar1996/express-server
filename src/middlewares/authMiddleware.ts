import type { NextFunction, Request, Response } from 'express'
import { NOT_AUTHENTICATED } from '../const/infoMsgs.js'
import { createOAuthClient } from '../const/oAuthClient.js'
import { createError } from '../helpers/createError.js'
import { getUsrFrmIdTkn } from '../helpers/getUsrFrmIdTkn.js'
import { setAuthCookie } from '../helpers/setAuthCookie.js'
import User from '../routes/auth/schema/userSchema.js'

export const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req?.cookies?.accessToken

    // no token
    if (!token) return next(createError(NOT_AUTHENTICATED, 401))

    const user = await User.findOne({ accessToken: token })
    // no user found in db
    if (!user) return next(createError(NOT_AUTHENTICATED, 401))

    // token expired
    const isExpired = new Date(user.tokenExpiredAt).getTime() < Date.now()

    // attach session in req obj
    if (!isExpired) {
      req.user = { id: user._id.toString(), email: user.email, name: user.name }
      return next()
    }

    // in db no refresh token found (not normal)
    if (!user.refreshToken) {
      return next(createError(NOT_AUTHENTICATED, 401))
    }

    // new refresh token
    const oAuthClient = createOAuthClient()
    oAuthClient.setCredentials({ refresh_token: user.refreshToken })
    const {
      credentials: { access_token, expiry_date, id_token }
    } = await oAuthClient.refreshAccessToken()

    // user for the time being
    const { email, name, profilePic } = getUsrFrmIdTkn(id_token!)

    const updatedUser = await User.upsertFromGoogle({
      email,
      name,
      profilePic,
      accessToken: access_token!,
      tokenExpiredAt: expiry_date! as unknown as Date
    })

    setAuthCookie(res, access_token!)

    req.user = { id: updatedUser!._id.toString(), email: updatedUser!.email, name: updatedUser!.name }
    next()
  } catch (error) {
    next(error)
  }
}
