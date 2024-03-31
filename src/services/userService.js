// eslint-disable-next-line no-useless-catch

import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/formaters'
import { userModel } from '~/models/userModel'
import { StatusCodes } from 'http-status-codes'

// hàm tạo user
const createNew = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const newUser = {
      ...reqBody,
      slug: slugify(reqBody.email)
    }
    const createUser = await userModel.createNew(newUser)
    return createUser
  } catch (error) {
    throw error
  }
}



// Hàm xử lý đăng nhập
const handleUserLogin = async (data) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const handleLogin = await userModel.handleUserLogin(data)
    return handleLogin
  } catch (error) {
    throw error
  }

}


export const userService = {
  createNew,
  handleUserLogin
}