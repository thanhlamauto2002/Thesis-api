

import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { userRoute } from './userRoute'
import { getUserAPI } from './api'
import { login } from './checkLogIn'
const Router = express.Router()

Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'APIs V1 are ready', code: StatusCodes.OK })
})
Router.use('/users', userRoute)
Router.use('/getusers', getUserAPI)
Router.use('/login', login)
export const APIs_V1 = Router

