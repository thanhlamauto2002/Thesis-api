import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
const { ObjectId } = require('mongodb');
const moment = require('moment');
const BK_COLLECTION_NAME = 'BKstation'
const BK_COLLECTION_SCHEMA = Joi.object({
  SO2: Joi.number().required(),
  NO2: Joi.number().required(),
  CO2: Joi.number().required(),
  O2: Joi.number().required(),
  Temperature: Joi.number().required(),
  Pressure: Joi.number().required(),
  Station: Joi.string().required(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now)
})

// Validate data

const validateBeforeCreate = async (data) => {
  console.log(data)

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
//Hàm lấy data vẽ chart

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
    console.log(data1)
    console.log('option: ', option)

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