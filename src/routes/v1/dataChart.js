import express from 'express'
import { station1Controller } from '~/controllers/stationBk'
import { station2Controller } from '~/controllers/stationHg'
import { station3Controller } from '~/controllers/stationTv'


const Router = express.Router()

Router.route('/')
  .get(async (req, res) => {
    try {
      const { station, option } = req.query


      if (!station || !option) {
        return res.status(400).json({ error: 'Missing parameters' });
      }
      switch (station) {
        case 'bk':
          await station1Controller.getDataChart(res, option)
          break;
        case 'hg':
          await station2Controller.getDataChart(res, option)
          break;
        case 'tv':
          await station3Controller.getDataChart(res, option)
          break;
        default:
          return res.status(400).json({ error: 'Invalid selectedStation' });
      }
    } catch (error) {
      throw new Error(error)
    }
  })

export const dataChart = Router