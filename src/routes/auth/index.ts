import { Router } from 'express'
import { GEN_TKN_FRM_CDE_ROUTE } from './const/routeConsts.js'
import { getTokenFrmCde } from './controllers/authController.js'

const router = Router()

router.post(GEN_TKN_FRM_CDE_ROUTE, getTokenFrmCde)

export default router
