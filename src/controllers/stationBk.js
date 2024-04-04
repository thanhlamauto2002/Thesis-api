import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import { station1Service } from '~/services/stationBk'
//hàm ghi data vào db
const createNew = async (req, res, next) => {
  try {
    const create = await station1Service.createNew(req.body)
    res.status(StatusCodes.CREATED).json(create)

  } catch (error) { next(error) }
}

// Hàm lấy data report từ db
const getData = async (res, startDate, endDate) => {

  try {

    const data = await station1Service.getData(startDate, endDate)
    res.status(201).json(data)
  } catch (error) {
    throw new Error(error)
  }
}
//Hàm lấy data vẽ chart từ db
const getDataChart = async (res, option) => {

  try {

    const data = await station1Service.getDataChart(option)
    res.status(201).json(data)
  } catch (error) {
    throw new Error(error)
  }
}

export const station1Controller = {
  createNew,
  getData,
  getDataChart
}