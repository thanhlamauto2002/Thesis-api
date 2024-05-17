import express from 'express'
import { opcDataController } from '~/controllers/opcDataController'


const Router = express.Router()

Router.route('/')
  .get(async (req, res) => {
    const reqQuery = { ...req.query }
    opcDataController.getDataReport(res, reqQuery)
  })

export const dataReport = Router