import { NextFunction, Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import { getUsrFrmIdTkn } from '../../../helpers/getUsrFrmIdTkn.js'
import User from '../schema/userSchema.js'

export const getTokenFrmCde = async (req: Request, res: Response, next: NextFunction) => {
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, 'postmessage')
  try {
    const code = req.body.code
    const {
      tokens: { access_token, refresh_token, expiry_date, id_token }
    } = await client.getToken(code)

    // usr
    const { email, name, profilePic } = getUsrFrmIdTkn(id_token!)

    // check prev user
    const existUser = await User.findOne({ email })

    // existing and new user
    if (existUser) {
      await User.findOneAndUpdate(
        { email },
        { name, profilePic, accessToken: access_token, tokenExpiredAt: expiry_date },
        { new: true, runValidators: true }
      )
    } else {
      await User.create({
        email,
        name,
        profilePic,
        accessToken: access_token!,
        refreshToken: refresh_token!,
        tokenExpiredAt: expiry_date!
      })
    }

    // set cookie
    res.cookie('accessToken', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      expires: new Date(expiry_date!)
    })

    // sending response
    res.json({ expireOn: expiry_date })
  } catch (error) {
    next(error)
  }
}
