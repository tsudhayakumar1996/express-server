import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import { errorHandler } from './middlewares/errorHandler'
import { API_ROUTE, AUTH_ROUTE } from './routeConsts'
import authRoutes from './routes/auth/authRoutes'

const app = express()

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true
  })
)

app.use(cookieParser())

app.use(express.json())

app.use(express.static('public'))

// Routes
app.use(API_ROUTE + AUTH_ROUTE, authRoutes)

// Global error handler (should be after routes)
app.use(errorHandler)

export default app
