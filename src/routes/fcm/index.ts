import { Router } from 'express'
import { UPDATE_FCM } from './const/routeConsts.js'
import { updateFcmTkns } from './controllers/updteFcmTknsController.js'

const router = Router()

router.post(UPDATE_FCM, updateFcmTkns)

export default router
