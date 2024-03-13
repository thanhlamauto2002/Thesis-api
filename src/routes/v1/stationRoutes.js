import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { stationValidation } from '~/validations/userValidation'
const Router = express.Router()

Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: 'GET: API get list station' })

  })
  .post(stationValidation.createNew)
export const stationRoutes = Router