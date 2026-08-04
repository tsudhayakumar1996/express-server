import { Router } from 'express'
import { SEND_FCM, UPDATE_FCM } from './const/routeConsts.js'
import { sendFcm } from './controllers/sendFcmController.js'
import { updateFcmTkns } from './controllers/updteFcmTknsController.js'

const router = Router()

router.post(UPDATE_FCM, updateFcmTkns)
router.post(SEND_FCM, sendFcm)

export default router
