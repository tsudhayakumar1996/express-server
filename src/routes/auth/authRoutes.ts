import { Router } from 'express'
import { getTokenFrmCde } from '../../controllers/authController.js'
import { GEN_TKN_FRM_CDE_ROUTE } from './routeConsts.js'

const router = Router()

router.post(GEN_TKN_FRM_CDE_ROUTE, getTokenFrmCde)

export default router
