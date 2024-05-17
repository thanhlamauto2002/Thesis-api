import express from 'express'
import { opcDataController } from '~/controllers/opcDataController'
const Router = express.Router()

Router.route('/')
  .get(opcDataController.getDataChart)

export const opcDataRoute = Router