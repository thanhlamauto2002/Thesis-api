import express from 'express'
import { station3Controller } from '~/controllers/stationTv'

const Router = express.Router()

Router.route('/createdatatv')
  .post(station3Controller.createNew)

Router.route('/gettvstation')
  .get(station3Controller.getData)
export const tvRoute = Router