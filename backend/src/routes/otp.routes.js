import {sendOtp} from '../controller/otp.controller.js'

import express from 'express'
const router = express.Router()

router.route("/send").post(sendOtp)

export default router