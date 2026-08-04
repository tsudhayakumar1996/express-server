import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import path from 'path'
import { checkAuth } from './middlewares/authMiddleware.js'
import { errorHandler } from './middlewares/errorHandler.js'
import { authRateLimitMiddleware, rateLimitMiddleware } from './middlewares/rateLimitMiddleWare.js'
import { AUTH_ROUTE } from './routes/auth/const/routeConsts.js'
import authRoutes from './routes/auth/index.js'
import { FCM_ROUTE } from './routes/fcm/const/routeConsts.js'
import fcmRoutes from './routes/fcm/index.js'
import { HOME_ROOUTE } from './routes/home/const/routeConsts.js'
import homeRoutes from './routes/home/index.js'
import { ME } from './routes/me/const/routeConsts.js'
import meRoutes from './routes/me/index.js'

dotenv.config()

const app = express()

app.use(
  cors({
    origin: 'http://localhost:3001',
    credentials: true
  })
)

// helpers
app.use(cookieParser())
app.use(express.json())

// static files serve
const publicPath = path.join(process.cwd(), 'public')
app.use(express.static(publicPath))

// routes
// connection
mongoose
  .connect(process.env.MONGO_DB_CONNECTION_URL!)
  .then(() => console.log('connection done'))
  .catch((err) => {
    throw new Error(err)
  })

// api routes
app.use(AUTH_ROUTE, authRateLimitMiddleware, authRoutes)
app.use(HOME_ROOUTE, checkAuth, rateLimitMiddleware, homeRoutes)
app.use(FCM_ROUTE, checkAuth, rateLimitMiddleware, fcmRoutes)
app.use(ME, checkAuth, rateLimitMiddleware, meRoutes)

// web app
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'))
})

// global error handler
app.use(errorHandler)

export default app
