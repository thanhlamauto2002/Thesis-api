import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
const USER_COLLECTION_NAME = 'users'
const USER_COLLECTION_SCHEMA = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  slug: Joi.string().required().min(3).trim().strict()
})
//Tao ham validate truoc khi them vao db

const validateBeforeCreate = async (data) => {
  return await USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })

}
//Hàm tạo bản ghi mới vào db
const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const createUser = await GET_DB().collection(USER_COLLECTION_NAME).insertOne(validData)
    return createUser
  } catch (error) {
    throw new Error(error)
  }
}

// Hàm tìm data trong db
const findOneById = async (id) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)

    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}



const getUser = async (userId) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({
      _id: new ObjectId(userId)

    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}
export const userModel = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  getUser
}