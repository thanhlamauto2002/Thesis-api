import Joi from 'joi'
import { userService } from '~/services/userService'
import { StatusCodes } from 'http-status-codes'

const createNew = async (req, res, next) => {
  try {
    const createUser = await userService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createUser)

  } catch (error) { next(error) }
}

const getUser = async (req, res, next) => {
  try {
    const userId = req.params.id
    const user = await userService.getUser(userId)
    res.status(StatusCodes.OK).json(user)

  } catch (error) { next(error) }
}
export const userController = {
  createNew,
  getUser
}