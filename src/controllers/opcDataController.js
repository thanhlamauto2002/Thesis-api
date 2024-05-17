import { opcDataModel } from '~/models/opcDataModel';
import { opcDataService } from '~/services/opcDataService';
const getDataChart = async (req, res) => {

  try {
    const station = req.query.station
    const option = req.query.option
    const data = await opcDataService.getDataChart(station, option)
    res.status(201).json(data)
  } catch (error) {
    throw new Error(error)
  }
}

const getDataReport = async (res, reqQuery) => {

  try {
    const data = await opcDataService.getDataReport(reqQuery)
    res.status(201).json(data)
  } catch (error) {
    throw new Error(error)
  }
}

export const opcDataController = {
  getDataChart,
  getDataReport
}