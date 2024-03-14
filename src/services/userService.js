// eslint-disable-next-line no-useless-catch

import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/formaters'
import { userModel } from '~/models/userModel'
import { StatusCodes } from 'http-status-codes'

const createNew = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const newUser = {
      ...reqBody,
      slug: slugify(reqBody.email)
    }
    // Tạo bản ghi
    const createUser = await userModel.createNew(newUser)
    // Lấy bản ghi
    const getNewUser = await userModel.findOneById(createUser.insertedId.toString())
    // eslint-disable-next-line no-console


    return getNewUser

  } catch (error) {
    throw error
  }
}

const getUser = async (userId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const user = await userModel.getUser(userId)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found!')
    }
    // eslint-disable-next-line no-console
    return user
  } catch (error) {
    throw error
  }
}
export const userService = {
  createNew,
  getUser
}