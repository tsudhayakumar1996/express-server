import { NextFunction, Request, Response } from 'express'

export const getHome = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.accessToken
  console.log(token)
  try {
    // sending response
    res.json({ data: { name: 'udhay' } })
  } catch (error) {
    next(error)
  }
}
