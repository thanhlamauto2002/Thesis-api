import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
const moment = require('moment');
const BK_COLLECTION_NAME = 'BKstation'
const BK_COLLECTION_SCHEMA = Joi.object({
  SO2: Joi.number().required(),
  NO: Joi.number().required(),
  CO: Joi.number().required(),
  O2: Joi.number().required(),
  Temperature: Joi.number().required(),
  Dust: Joi.number().required(),
  Station: Joi.string().required(),
  StatusTemp: Joi.string().required(),
  StatusDust: Joi.string().required(),
  StatusSO2: Joi.string().required(),
  StatusCO: Joi.string().required(),
  StatusNO: Joi.string().required(),
  StatusO2: Joi.string().required(),
  StatusConnect: Joi.string().required(),
  createdAt: Joi.number().required()
})
// Validate data
const validateBeforeCreate = async (data) => {
  return await BK_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}
//Ghi data vào db
const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const create = await GET_DB().collection(BK_COLLECTION_NAME).insertOne(validData)

    return create
  } catch (error) {
    throw new Error(error)
  }
}
// Hàm lấy data report
const getData = async (startDate, endDate) => {
  try {
    const startDateInt = parseInt(startDate, 10)
    const endDateInt = parseInt(endDate, 10)

    const data = await GET_DB().collection(BK_COLLECTION_NAME).find({
      createdAt: {
        $gte: startDateInt,
        $lte: endDateInt
      }
    }).toArray();
    return data

  } catch (error) {
    throw new Error(error)
  }
}

//Hàm lấy data vẽ trend

const getDataChart = async (option) => {
  try {
    let data1 = null
    const currentTimeUnix = moment().valueOf()
    const sevenDaysAgoUnix = currentTimeUnix - (7 * 24 * 60 * 60 * 1000)
    const thirtyDaysAgoUnix = currentTimeUnix - (30 * 24 * 60 * 60 * 1000)
    const startOfToday = moment().startOf('day').valueOf()

    switch (option) {
      case 'today':
        data1 = await GET_DB().collection(BK_COLLECTION_NAME).find({ 'createdAt': { $gte: startOfToday } }).toArray()

        break
      case 'l7day':
        data1 = await GET_DB().collection(BK_COLLECTION_NAME).find({ 'createdAt': { $gte: sevenDaysAgoUnix } }).toArray()
        break
      case 'l30day':
        data1 = await GET_DB().collection(BK_COLLECTION_NAME).find({ 'createdAt': { $gte: thirtyDaysAgoUnix } }).toArray()
        break
      default:
        throw new Error('Invalid option')
    }
    return data1
  } catch (error) {
    return null
  }
}

export const station1Model = {
  BK_COLLECTION_NAME,
  BK_COLLECTION_SCHEMA,
  createNew, getData, getDataChart
}