import type { NextFunction, Request, Response } from 'express'
import { NOT_AUTHENTICATED } from '../const/infoMsgs.js'
import { createError } from '../helpers/createError.js'

export const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // const
    const token = req?.cookies?.accessToken

    if (!token) next(createError(NOT_AUTHENTICATED, 401))
  } catch (error) {
    next(error)
  }
}
