import express from 'express'
import { station1Controller } from '~/controllers/stationBk'

const Router = express.Router()

Router.route('/createdata')
  .post(station1Controller.createNew)


Router.route('/getbkstation')
  .get(station1Controller.getData)
export const bkRoute = Router