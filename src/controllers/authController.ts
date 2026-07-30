import { NextFunction, Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import { getUsrFrmIdTkn } from '../helpers/getUsrFrmIdTkn.js'

export const getTokenFrmCde = async (req: Request, res: Response, next: NextFunction) => {
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, 'postmessage')
  try {
    const code = req.body.code
    const {
      tokens: { access_token, refresh_token, expiry_date, id_token },
      ...rem
    } = await client.getToken(code)

    // usr
    const { email, name, profilePic } = getUsrFrmIdTkn(id_token!)

    // storing refresh_token
    console.log(refresh_token, rem, email, name, profilePic)

    // set cookie
    res.cookie('accessToken', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(expiry_date!)
    })

    // sending response
    res.json({ expireOn: expiry_date })
  } catch (error) {
    next(error)
  }
}
