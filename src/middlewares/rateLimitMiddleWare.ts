import type { NextFunction, Request, Response } from 'express'
import { Redis } from 'ioredis'
import { RateLimiterRedis } from 'rate-limiter-flexible'
import { CONNECTION_VIOLATES } from '../const/infoMsgs.js'

const redisClient = new Redis() // use Redis so limits survive restarts & work across multiple server instances

// Rule 1: short burst limit — 30 requests per 60 seconds
const minuteLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'rl_minute',
  points: 30,
  duration: 60
})

// Rule 2: sustained-abuse limit — e.g. 5000 requests per day
const dayLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'rl_day',
  points: 500,
  duration: 60 * 60 * 24
})

// Rule 3: progressive penalty — track consecutive violations,
// and block for longer each time someone keeps hammering the limit
const banLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'rl_ban',
  points: 5, // allow 5 "over-limit" strikes
  duration: 60 * 10, // within a 10-minute window
  blockDuration: 60 * 60 // then block for 1 hour
})

const authLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'rl_auth',
  points: 10,
  duration: 60
})

export async function authRateLimitMiddleware(req: Request, res: Response, next: NextFunction) {
  const key = `ip_${req.ip}`
  try {
    await authLimiter.consume(key)
    next()
  } catch (_e) {
    return res.status(429).json({ error: CONNECTION_VIOLATES })
  }
}

export async function rateLimitMiddleware(req: Request, res: Response, next: NextFunction) {
  const key = req.user?._id ? `user_${req.user._id}` : `ip_${req.ip}`

  try {
    const banRes = await banLimiter.get(key)
    if (banRes && banRes.remainingPoints <= 0 && banRes.msBeforeNext > 0) {
      return res.status(429).json({ error: CONNECTION_VIOLATES })
    }

    await Promise.all([minuteLimiter.consume(key), dayLimiter.consume(key)])

    next()
  } catch (_e) {
    try {
      await banLimiter.consume(key)
    } catch (_e) {
      // already banned, ignore
    }
    return res.status(429).json({ error: CONNECTION_VIOLATES })
  }
}
