import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import path from 'path'
import { checkAuth } from './middlewares/authMiddleware.js'
import { errorHandler } from './middlewares/errorHandler.js'
import { AUTH_ROUTE } from './routes/auth/const/routeConsts.js'
import authRoutes from './routes/auth/index.js'
import { API_ROUTE } from './routes/const/routeConsts.js'
import { HOME_ROOUTE } from './routes/home/const/routeConsts.js'
import homeRoutes from './routes/home/index.js'

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
app.use(API_ROUTE + AUTH_ROUTE, authRoutes)
app.use(API_ROUTE + HOME_ROOUTE, checkAuth, homeRoutes)

// web app
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'))
})

// global error handler
app.use(errorHandler)

export default app
