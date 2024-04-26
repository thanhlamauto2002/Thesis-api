import Joi, { number } from 'joi'
import { GET_DB } from '~/config/mongodb'
const { ObjectId } = require('mongodb');
const moment = require('moment');
const ALARM_HG_COLLECTION_NAME = 'AlarmHG'
const ALARM_HG_COLLECTION_SCHEMA = Joi.object({
  date: Joi.number().required(),
  value: Joi.required(), // Trường value là một số
  status: Joi.string().required(),
  name: Joi.string().required(),
  area: Joi.string().required(),
  acknowledged: Joi.boolean().required(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  id: Joi.string()

})

const ALARM_HG_ARRAY_SCHEMA = Joi.array().items(ALARM_HG_COLLECTION_SCHEMA);

// Validate data
const validateBeforeCreate = async (data) => {

  return await ALARM_HG_ARRAY_SCHEMA.validateAsync(data, { abortEarly: false })
}
const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const create = await GET_DB().collection(ALARM_HG_COLLECTION_NAME).insertMany(validData)

    return create
  } catch (error) {
    throw new Error(error)
  }
}
// Hàm lấy alarm
const getAlarms = async (startDate, endDate) => {
  try {
    const startDateInt = parseInt(startDate, 10)
    const endDateInt = parseInt(endDate, 10)

    const data = await GET_DB().collection(ALARM_HG_COLLECTION_NAME).find({
      date: {
        $gte: startDateInt,
        $lte: endDateInt
      }
    }).toArray();
    return data

  } catch (error) {
    throw new Error(error)
  }
}
//
export const station2AlarmModel = {
  ALARM_HG_COLLECTION_NAME,
  ALARM_HG_COLLECTION_SCHEMA,
  createNew,
  getAlarms
}
