import express from 'express'
import { StatusCodes } from 'http-status-codes'
const Router = express.Router()

Router.route('/abc')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: 'GET: API get list station' })

  })
  .post((req, res) => {
    res.status(StatusCodes.CREATED).json({ message: 'POST: API creaate  new station' })
  })
export const stationRoutes = Router