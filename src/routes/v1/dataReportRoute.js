import express from 'express'
import { station1Controller } from '~/controllers/stationBk'
import { station2Controller } from '~/controllers/stationHg'
import { station3Controller } from '~/controllers/stationTv'


const Router = express.Router()

Router.route('/')
  .get(async (req, res) => {
    try {
      const { station, option, startDate, endDate } = req.query
      if (!station || !option || !startDate || !endDate) {
        return res.status(400).json({ error: 'Missing parameters' });
      }
      switch (station) {
        case 'BK':
          if (option === 'data') {
            await station1Controller.getData(res, startDate, endDate);
          } else if (option === 'alarm') {
            await station1Controller.getAlarms(res, startDate, endDate);
          } else {
            return res.status(400).json({ error: 'Invalid option' });
          }
          break;
        case 'HG':
          if (option === 'data') {
            await station2Controller.getData(res, startDate, endDate);
          } else if (option === 'alarm') {
            await station2Controller.getAlarms(res, startDate, endDate);
          } else {
            return res.status(400).json({ error: 'Invalid option' });
          } break;
        case 'TV':
          if (option === 'data') {
            await station3Controller.getData(res, startDate, endDate);
          } else if (option === 'alarm') {
            await station3Controller.getAlarms(res, startDate, endDate);
          } else {
            return res.status(400).json({ error: 'Invalid option' });
          } break;
        default:
          return res.status(400).json({ error: 'Invalid selectedStation' });
      }
    } catch (error) {
      throw new Error(error)
    }
  })

export const dataReport = Router