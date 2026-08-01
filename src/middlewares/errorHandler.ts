import type { NextFunction, Request, Response } from 'express'
import { MongoServerError } from 'mongodb'
import mongoose from 'mongoose'
import { ALREADY_EXISTS, INTERNAL_SERVER_ERROR } from '../const/infoMsgs.js'

export interface AppError extends Error {
  status?: number
}

export const errorHandler = (err: AppError, req: Request, res: Response, _next: NextFunction) => {
  // Mongoose validation errors
  if (err instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(err.errors).map((e) => e.message)
    return res.status(400).json({ error: messages.join(', ') })
  }

  // mongodb error
  if (err instanceof MongoServerError) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0]
      return res.status(409).json({ error: field + ALREADY_EXISTS })
    }
  }

  // fallback
  res.status(err.status || 500).json({
    error: err.message || INTERNAL_SERVER_ERROR
  })
}
