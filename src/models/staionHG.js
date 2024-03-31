import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'

const HG_COLLECTION_NAME = 'HGstation'
const HG_COLLECTION_SCHEMA = Joi.object({
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
  return await HG_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

//Ghi data vào db
const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const create = await GET_DB().collection(HG_COLLECTION_NAME).insertOne(validData)
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
    const data = await GET_DB().collection(HG_COLLECTION_NAME).find({
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
export const station2Model = {
  HG_COLLECTION_NAME,
  HG_COLLECTION_SCHEMA,
  createNew, getData
}