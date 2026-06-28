import { Router } from 'express'
import { getTokenFrmCde } from '../../controllers/authController'
import { GEN_TKN_FRM_CDE_ROUTE } from './routeConsts'

const router = Router()

router.post(GEN_TKN_FRM_CDE_ROUTE, getTokenFrmCde)

export default router
