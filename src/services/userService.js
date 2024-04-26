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
      ...reqBody
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
//hàm lấy all user
const getAllUser = async () => {
  // eslint-disable-next-line no-useless-catch
  try {
    const data = await userModel.getAllUser()
    return data
  } catch (error) {
    throw new Error(error)
  }
}
//hàm lấy 1 user
const getUser = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const data = await userModel.getUser(reqBody)
    return data
  } catch (error) {
    throw new Error(error)
  }
}
// hàm xóa user
const deleteUser = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const data = await userModel.deleteUser(reqBody)
    return data
  } catch (error) {
    throw new Error(error)
  }
}
//
const editUser = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const data = await userModel.editUser(reqBody)
    return data
  } catch (error) {
    throw new Error(error)
  }
}

export const userService = {
  createNew,
  handleUserLogin,
  getAllUser,
  deleteUser,
  getUser,
  editUser
}