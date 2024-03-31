import express from 'express'
import { listStationValidation } from '~/validations/listStation'
import { listStationCtrl } from '~/controllers/listStationCtrl'
import { StatusCodes } from 'http-status-codes'

const Router = express.Router()

Router.route('/create')
  .post(listStationValidation.createNew, listStationCtrl.createNew)

Router.route('/get')
  .get(listStationCtrl.getStation)
export const stationRoutes = Router