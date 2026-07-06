import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import path from 'path'
import { errorHandler } from './middlewares/errorHandler.js'
import { API_ROUTE, AUTH_ROUTE } from './routeConsts.js'
import authRoutes from './routes/auth/authRoutes.js'

const app = express()

app.use(
  cors({
    origin: 'http://localhost:5173',
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
app.use(API_ROUTE + AUTH_ROUTE, authRoutes)
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'))
})

// global error handler
app.use(errorHandler)

export default app
