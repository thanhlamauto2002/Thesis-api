import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'

const TV_COLLECTION_NAME = 'TVstation'
const TV_COLLECTION_SCHEMA = Joi.object({
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
  return await TV_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

//Ghi data vào db
const createNew = async (data) => {

  try {
    const validData = await validateBeforeCreate(data)
    const create = await GET_DB().collection(TV_COLLECTION_NAME).insertOne(validData)
    return create
  } catch (error) {
    throw new Error(error)
  }
}
// Hàm lấy data
const getData = async (startDate, endDate) => {
  try {
    const startDateInt = parseInt(startDate, 10)
    const endDateInt = parseInt(endDate, 10)

    const data = await GET_DB().collection(TV_COLLECTION_NAME).find({
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
export const station3Model = {
  TV_COLLECTION_NAME,
  TV_COLLECTION_SCHEMA,
  createNew, getData
}