import { Router } from 'express'
import { GEN_TKN_FRM_CDE_ROUTE, LOGOUT } from './const/routeConsts.js'
import { getTokenFrmCde } from './controllers/authController.js'
import { logout } from './controllers/logoutController.js'

const router = Router()

router.post(GEN_TKN_FRM_CDE_ROUTE, getTokenFrmCde)
router.post(LOGOUT, logout)

export default router
