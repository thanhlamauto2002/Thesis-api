import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import { station3Service } from '~/services/stationTv'
//hàm ghi data vào db
const createNew = async (req, res, next) => {
  try {
    const create = await station3Service.createNew(req.body)
    res.status(StatusCodes.CREATED).json(create)

  } catch (error) { next(error) }
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


export const station3Controller = {
  createNew,
  getData
}