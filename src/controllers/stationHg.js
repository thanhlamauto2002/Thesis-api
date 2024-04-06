import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import { station2Service } from '~/services/stationHg'
//hàm ghi data vào db
const createNew = async (dataTerminal2) => {
  try {
    const create = await station2Service.createNew(dataTerminal2)
    // res.status(StatusCodes.CREATED).json(create)

  } catch (error) { throw new Error(error) }
}

// Hàm lấy data từ db
const getData = async (res, startDate, endDate) => {
  try {

    const data = await station2Service.getData(startDate, endDate)
    res.status(201).json(data)
  } catch (error) {
    throw new Error(error)
  }
}

//Hàm lấy data vẽ chart từ db
const getDataChart = async (res, option) => {

  try {

    const data = await station2Service.getDataChart(option)
    res.status(201).json(data)
  } catch (error) {
    throw new Error(error)
  }
}

export const station2Controller = {
  createNew,
  getData,
  getDataChart
}