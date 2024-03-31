import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
import e from 'cors'

const STATION_COLLECTION_NAME = 'StationList'
const STATION_COLLECTION_SCHEMA = Joi.object({
  name: Joi.string().required(),
  position: Joi.object({
    lat: Joi.number().required(),
    lng: Joi.number().required()
  }),
  status: Joi.string().required()
})
const validateBeforeCreate = async (data) => {
  return await STATION_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const createUser = await GET_DB().collection(STATION_COLLECTION_NAME).insertOne(validData)
    return createUser
  }

  catch (error) {
    throw new Error(error)
  }
}

const getStation = async () => {
  try {
    const cursor = await GET_DB().collection(STATION_COLLECTION_NAME).find({}).toArray()
    return cursor
  } catch (error) {
    throw new Error(error)
  }
}

export const listStationModel = {
  STATION_COLLECTION_NAME,
  STATION_COLLECTION_SCHEMA,
  createNew,
  getStation
}
