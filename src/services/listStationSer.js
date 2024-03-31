import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/formaters'
import { listStationModel } from '~/models/listStationModel'
import { StatusCodes } from 'http-status-codes'


const createNew = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const newStation = {
      ...reqBody
    }
    const createStation = await listStationModel.createNew(newStation)
    return createStation
  } catch (error) {
    throw error
  }
}

const getStation = async () => {
  // eslint-disable-next-line no-useless-catch
  try {
    const data = await listStationModel.getStation()
    return data
  } catch (error) {
    throw new Error(error)
  }

}

export const listStationService = {
  createNew,
  getStation
}