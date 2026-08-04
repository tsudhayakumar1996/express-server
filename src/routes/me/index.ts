import { Router } from 'express'
import { GET_ME } from './const/routeConsts.js'
import { getMe } from './controllers/meController.js'

const router = Router()

router.get(GET_ME, getMe)

export default router
