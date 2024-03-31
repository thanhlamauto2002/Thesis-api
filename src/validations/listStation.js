import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    name: Joi.string().required(),
    position: Joi.object({
      lat: Joi.number().required(),
      lng: Joi.number().required()
    }),
    status: Joi.string().required()
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    const errorMessage = new Error(error).message
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(customError)
  }
}

export const listStationValidation = {
  createNew
}