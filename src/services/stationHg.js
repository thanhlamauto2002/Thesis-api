// eslint-disable-next-line no-useless-catch

import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { station2Model } from '~/models/staionHG'

// hàm ghi data
const createNew = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const newdata = {
      ...reqBody
    }
    const createData = await station2Model.createNew(newdata)
    return createData
  } catch (error) {
    throw error
  }
}



const getData = async (startDate, endDate) => {
  try {
    const data = await station2Model.getData(startDate, endDate)
    return data
  } catch (error) {
    throw new Error(error)
  }
}


export const station2Service = {
  createNew,
  getData
}