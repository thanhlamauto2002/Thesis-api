import Joi from 'joi'
import { listStationService } from '~/services/listStationSer'
import { StatusCodes } from 'http-status-codes'

//hàm tạo station
const createNew = async (req, res, next) => {
  console.log(req.body)

  try {
    const createUser = await listStationService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createUser)

  } catch (error) { next(error) }
}

// Hàm lấy station
const getStation = async (req, res) => {
  try {
    const getData = await listStationService.getStation()
    res.status(201).json(getData)
  } catch (error) {
    throw new Error(error)
  }
}


export const listStationCtrl = {
  createNew,
  getStation
}