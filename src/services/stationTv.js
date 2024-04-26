// eslint-disable-next-line no-useless-catch

import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { station3Model } from '~/models/stationTV'
import { station3AlarmModel } from '~/models/alarmTV'

// hàm ghi data
const createNew = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const newdata = {
      ...reqBody
    }
    const createData = await station3Model.createNew(newdata)
    return createData
  } catch (error) {
    throw error
  }
}


const getData = async (startDate, endDate) => {
  try {
    const data = await station3Model.getData(startDate, endDate)
    return data
  } catch (error) {
    throw new Error(error)
  }
}
const getDataChart = async (option) => {
  try {
    const data = await station3Model.getDataChart(option)
    return data
  } catch (error) {
    throw new Error(error)
  }
}
//Hàm ghi alarm
const createNewAlarm = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    console.log('reqbody: ', reqBody)
    // const newdata = {
    //   ...reqBody
    // }

    const createData = await station3AlarmModel.createNew(reqBody)
    return createData
  } catch (error) {
    throw error
  }
}
const getAlarms = async (startDate, endDate) => {
  try {
    const data = await station3AlarmModel.getAlarms(startDate, endDate)
    return data
  } catch (error) {
    throw new Error(error)
  }
}
export const station3Service = {
  createNew,
  getData,
  getDataChart,
  createNewAlarm,
  getAlarms
}