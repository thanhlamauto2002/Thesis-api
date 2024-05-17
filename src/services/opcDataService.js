import { opcDataModel } from '~/models/opcDataModel';

const getDataChart = async (station, option) => {

  try {
    const data = await opcDataModel.getDataChart(station, option)
    return data
  } catch (error) {
    throw new Error(error)
  }
}

const getDataReport = async (reqQuery) => {

  try {
    const data = await opcDataModel.getDataReport(reqQuery)
    return data
  } catch (error) {
    throw new Error(error)
  }
}

export const opcDataService = {
  getDataChart,
  getDataReport
}