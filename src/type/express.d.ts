// types/express.d.ts
import 'express'
import { User } from '../routes/auth/schema/userSchema.ts'

declare global {
  namespace Express {
    interface Request {
      user?: User
    }
  }
}
