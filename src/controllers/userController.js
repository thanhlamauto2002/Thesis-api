import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'

const createNew = async (req, res, next) => {
  try {

    res.status(StatusCodes.CREATED).json({ message: 'POST: API creaate  new user' })
  } catch (error) { next(error) }
}
export const userController = {
  createNew
}