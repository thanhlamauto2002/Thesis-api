import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import { station3Service } from '~/services/stationTv'
//hàm ghi data vào db
const createNew = async (dataTerminal3) => {
  console.log('DataTV from OPC UA: ', dataTerminal3)

  try {
    const create = await station3Service.createNew(dataTerminal3)
    // res.status(StatusCodes.CREATED).json(create)

  } catch (error) { throw new Error(error) }
}
//hàm ghi alarm BK
const createNewAlarm = async (alarmTV) => {
  try {
    console.log('req: ', alarmTV)
    const create = await station3Service.createNewAlarm(alarmTV)
    // res.status(StatusCodes.CREATED).json(create)
  } catch (error) { throw new Error(error) }
}
// Hàm lấy data từ db
const getData = async (res, startDate, endDate) => {
  try {

    const data = await station3Service.getData(startDate, endDate)
    res.status(201).json(data)
  } catch (error) {
    throw new Error(error)
  }
}

//Hàm lấy data vẽ chart từ db
const getDataChart = async (res, option) => {

  try {

    const data = await station3Service.getDataChart(option)
    res.status(201).json(data)
  } catch (error) {
    throw new Error(error)
  }
}
// Hàm lấy alarm report từ db
const getAlarms = async (res, startDate, endDate) => {

  try {
    const data = await station3Service.getAlarms(startDate, endDate)
    res.status(201).json(data)
  } catch (error) {
    throw new Error(error)
  }
}
export const station3Controller = {
  createNew,
  getData,
  getDataChart,
  createNewAlarm,
  getAlarms
}