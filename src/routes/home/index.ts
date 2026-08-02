import { Router } from 'express'
import { GET_LIST } from './const/routeConsts.js'
import { getHome } from './controllers/homeController.js'

const router = Router()

router.get(GET_LIST, getHome)

export default router
