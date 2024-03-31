import express from 'express'
import { station1Controller } from '~/controllers/stationBk'
import { station2Controller } from '~/controllers/stationHg'
import { station3Controller } from '~/controllers/stationTv'


const Router = express.Router()

Router.route('/')
  .get(async (req, res) => {
    try {
      const { station, startDate, endDate } = req.query
      console.log('station: ', station)

      if (!station || !startDate || !endDate) {
        return res.status(400).json({ error: 'Missing parameters' });
      }
      switch (station) {
        case 'BK':
          await station1Controller.getData(res, startDate, endDate)
          break;
        case 'HG':
          station2Controller.getData(res, startDate, endDate)
          break;
        case 'TV':
          station3Controller.getData(res, startDate, endDate)
          break;
        default:
          return res.status(400).json({ error: 'Invalid selectedStation' });
      }
    } catch (error) {
      throw new Error(error)
    }
  })

export const dataReport = Router