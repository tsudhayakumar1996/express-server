import { NextFunction, Request, Response } from 'express'
import { FCM_TKN_UPDTD_SUCCESS } from '../../../const/infoMsgs.js'
import User from '../../auth/schema/userSchema.js'

export const updateFcmTkns = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // fcm tkn from payload
    const fcmTkn = req.body.fcmTkn
    const pltFrm = req.body.pltFrm

    // session
    const userId = req.user?.id

    console.log(fcmTkn, pltFrm, userId, '3 *****')

    await User.syncFcmToken(userId!, fcmTkn, pltFrm)

    // response to client
    res.json({ message: FCM_TKN_UPDTD_SUCCESS })
  } catch (error) {
    next(error)
  }
}
