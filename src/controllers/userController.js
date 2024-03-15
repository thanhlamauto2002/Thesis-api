import Joi from 'joi'
import { userService } from '~/services/userService'
import { StatusCodes } from 'http-status-codes'

//hàm tạo user
const createNew = async (req, res, next) => {
  try {
    const createUser = await userService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createUser)

  } catch (error) { next(error) }
}

// Hàm xử lý đăng nhập
const handleUserLogin = async (req, res, next) => {
  try {
    const handleLogin = await userService.handleUserLogin(req.body)
    res.status(200).json(handleLogin)
  } catch (error) {
    next(error)
  }
}


export const userController = {
  createNew,
  handleUserLogin
}