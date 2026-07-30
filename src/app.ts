import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import path from 'path'
import { errorHandler } from './middlewares/errorHandler.js'
import { API_ROUTE, AUTH_ROUTE } from './routeConsts.js'
import authRoutes from './routes/auth/authRoutes.js'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

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

// Routes
app.use(API_ROUTE + AUTH_ROUTE, authRoutes)
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'))
})

// global error handler
app.use(errorHandler)

export default app
