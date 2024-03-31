import express from 'express'
import { station2Controller } from '~/controllers/stationHg'

const Router = express.Router()

Router.route('/createdatahg')
  .post(station2Controller.createNew)

Router.route('/gethgstation')
  .get(station2Controller.getData)
export const hgRoute = Router