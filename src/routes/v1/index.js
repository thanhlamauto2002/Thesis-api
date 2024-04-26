

import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { userRoute } from './userRoute'
import { bkRoute } from './station1Route'
import { hgRoute } from './station2route'
import { tvRoute } from './station3route'
import { stationRoutes } from './stationRoutes'
import { dataReport } from './dataReportRoute'
import { dataChart } from './dataChart'
import { ExportReport } from './ExportReport'
const Router = express.Router()

Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'APIs V1 are ready', code: StatusCodes.OK })
})
Router.use('/users', userRoute)
Router.use('/databkstation', bkRoute)
Router.use('/datahgstation', hgRoute)
Router.use('/datatvstation', tvRoute)
Router.use('/liststation', stationRoutes)
Router.use('/getdatareport', dataReport)
Router.use('/getdatachart', dataChart)
Router.use('/export', ExportReport)

export const APIs_V1 = Router

