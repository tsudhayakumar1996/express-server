import { NextFunction, Request, Response } from 'express'
import { createOAuthClient } from '../../../const/oAuthClient.js'
import { getUsrFrmIdTkn } from '../../../helpers/getUsrFrmIdTkn.js'
import { setAuthCookie } from '../../../helpers/setAuthCookie.js'
import User from '../schema/userSchema.js'

export const getTokenFrmCde = async (req: Request, res: Response, next: NextFunction) => {
  const oAuthClient = createOAuthClient('postmessage')
  try {
    const code = req.body.code
    const { tokens } = await oAuthClient.getToken(code)
    const { email, name, profilePic } = getUsrFrmIdTkn(tokens.id_token!)

    await User.upsertFromGoogle({
      email,
      name,
      profilePic,
      accessToken: tokens.access_token!,
      refreshToken: tokens.refresh_token!,
      tokenExpiredAt: tokens.expiry_date! as unknown as Date
    })

    setAuthCookie(res, tokens.access_token!)
    res.json({ expireOn: tokens.expiry_date })
  } catch (error) {
    next(error)
  }
}
