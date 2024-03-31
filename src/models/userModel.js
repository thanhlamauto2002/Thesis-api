import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
import bcrypt from 'bcrypt'
// import e from 'cors'
const USER_COLLECTION_NAME = 'users'
const USER_COLLECTION_SCHEMA = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  slug: Joi.string().required().min(3).trim().strict()
})
//Tao ham validate truoc khi them vao db
const salt = bcrypt.genSaltSync(10)
const validateBeforeCreate = async (data) => {
  return await USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}
//Hàm check email tồn tại
const checkEmailExist = async (userEmail) => {
  let user = await GET_DB().collection(USER_COLLECTION_NAME).findOne({
    email: userEmail
  })
  if (user) {
    return true
  }
  return false
}
//Hàm hash password
const hashUserPassword = (userPassword) => {
  let hashPassword = bcrypt.hashSync(userPassword, salt)
  return hashPassword
}

//Hàm tạo bản ghi mới vào db
const createNew = async (data) => {
  try {
    let isEmailExist = await checkEmailExist(data.email)
    if (!isEmailExist) {
      const validData = await validateBeforeCreate(data)
      let hashPassword = hashUserPassword(data.password)
      validData.password = hashPassword
      const createUser = await GET_DB().collection(USER_COLLECTION_NAME).insertOne(validData)
      return createUser
    }
    return {
      EM: 'The email already exist'
    }
  } catch (error) {
    throw new Error(error)
  }
}


//Hàm xử lý đăng nhập
const handleUserLogin = async (data) => {
  try {
    const user = await GET_DB().collection(USER_COLLECTION_NAME).findOne({ email: data.email })

    if (!user || !await bcrypt.compare(data.password, user.password)) {
      return { message: 'Invalid email or password' }
    }
    // Nếu email và password khớp, trả về thành công
    return {
      success: true,
      message: 'Login OK'
    }
  } catch (error) {
    throw new Error(error)
  }
}

export const userModel = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  createNew,
  handleUserLogin
}