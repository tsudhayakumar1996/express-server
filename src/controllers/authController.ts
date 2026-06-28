import { NextFunction, Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'

export const getTokenFrmCde = async (req: Request, res: Response, next: NextFunction) => {
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, 'postmessage')
  try {
    console.log(req.body, 'request dot body...')
    const code = req.body.code
    const { tokens } = await client.getToken(code)
    console.log(tokens, 'tokens here to check..***')
    res.json(tokens)
  } catch (error) {
    next(error)
  }
}
