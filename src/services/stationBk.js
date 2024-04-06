// eslint-disable-next-line no-useless-catch

import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { station1Model } from '~/models/stationBk'

// hàm ghi data
const createNew = async (reqBody) => {
  console.log('reqbody: ', reqBody)
  // eslint-disable-next-line no-useless-catch
  try {
    const newdata = {
      ...reqBody
    }
    const createData = await station1Model.createNew(newdata)
    return createData
  } catch (error) {
    throw error
  }
}


const getData = async (startDate, endDate) => {
  try {
    const data = await station1Model.getData(startDate, endDate)
    return data
  } catch (error) {
    throw new Error(error)
  }
}

const getDataChart = async (option) => {
  try {
    const data = await station1Model.getDataChart(option)
    return data
  } catch (error) {
    throw new Error(error)
  }
}
export const station1Service = {
  createNew,
  getData,
  getDataChart
}