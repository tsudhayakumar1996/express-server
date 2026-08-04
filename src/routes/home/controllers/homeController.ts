import { NextFunction, Request, Response } from 'express'

export const getHome = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // sending response
    res.json({ data: { name: 'udhay' } })
  } catch (error) {
    next(error)
  }
}
