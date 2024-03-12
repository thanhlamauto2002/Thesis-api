

import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { stationRoutes } from './stationRoutes'
const Router = express.Router()

Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'APIs V1 are ready', code: StatusCodes.OK })
})
Router.use('/stations', stationRoutes)
export const APIs_V1 = Router

