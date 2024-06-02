import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
import bcrypt from 'bcrypt'
import { createJWT } from '~/middlewares/JWTaction'

// import e from 'cors'
const USER_COLLECTION_NAME = 'users'
const USER_COLLECTION_SCHEMA = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string(),
  phone: Joi.string().pattern(new RegExp(/^(09|03|07|08)[0-9]{8}$/))
})
//schema modify
const USER_COLLECTION_SCHEMA_MODIFY = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().required(),
  role: Joi.string(),
  phone: Joi.string().pattern(new RegExp(/^(09|03|07|08)[0-9]{8}$/))
})
//Tao ham validate truoc khi them vao db
const salt = bcrypt.genSaltSync(10)
const validateBeforeCreate = async (data) => {
  return await USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}
//Tao ham validate truoc khi chinh sua
const validateBeforeEdit = async (data) => {
  return await USER_COLLECTION_SCHEMA_MODIFY.validateAsync(data, { abortEarly: false })
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
      return {
        success: true
      }
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
    const userPermission = await GET_DB().collection('Authorize').findOne({ email: data.email })


    if (!user || !await bcrypt.compare(data.password, user.password)) {
      return { message: 'Invalid email or password' }
    }
    // Nếu email và password khớp, trả về thành công và token
    let role = user.role
    let payload = {
      email: user.email,
      username: user.username,
      role: user.role,
      userPermission: userPermission
    }
    let accessToken = createJWT(payload)
    return {
      success: true,
      message: 'Login OK',
      role: role,
      accessToken: accessToken
    }
  } catch (error) {
    throw new Error(error)
  }
}
// Hàm lấy danh sách user
// lấy all
const getAllUser = async () => {
  try {
    const cursor = await GET_DB().collection(USER_COLLECTION_NAME).find({}).toArray()
    return cursor
  } catch (error) {
    throw new Error(error)
  }
}
//hàm lấy 1 người dùng theo email:
const getUser = async (data) => {
  try {
    const cursor = await GET_DB().collection(USER_COLLECTION_NAME).findOne({ email: data.email })
    return cursor
  } catch (error) {
    throw new Error(error)
  }
}
// hàm xóa người dùng
const deleteUser = async (data) => {
  try {
    const cursor = await GET_DB().collection(USER_COLLECTION_NAME).deleteOne({ email: data.email })
    return {
      delete: true
    }
  } catch (error) {
    throw new Error(error)
  }
}
//update user
const editUser = async (data) => {
  try {
    const dataEdit = {
      email: data.emailEdit,
      phone: data.phoneEdit,
      username: data.usernameEdit,
      role: data.roleEdit
    }
    const validDataEdit = await validateBeforeEdit(dataEdit)
    const cursor = await GET_DB().collection(USER_COLLECTION_NAME).updateOne(
      { email: data.emailToEdit }, // Điều kiện tìm kiếm: tìm bản ghi với email cụ thể
      { $set: { email: validDataEdit.email, phone: validDataEdit.phone, username: validDataEdit.username, role: validDataEdit.role } } // Dữ liệu cần cập nhật
    )
    return {
      edit: true
    }
  } catch (error) {
    throw new Error(error)
  }
}


const updatePermission = async (data) => {
  try {

    const checkExistingUser = await GET_DB().collection('Authorize').findOne({ email: data.email })
    if (!checkExistingUser) {
      const createUser = await GET_DB().collection('Authorize').insertOne(data)
    }
    else {
      const cursor = await GET_DB().collection('Authorize').updateOne(
        { email: data.email }, // Điều kiện tìm kiếm: tìm bản ghi với email cụ thể
        { $set: { email: data.email, permissions: data.permissions } } // Dữ liệu cần cập nhật
      )
    }
    return {
      edit: true
    }
  } catch (error) {
    throw new Error(error)
  }
}
const getPermissions = async () => {
  try {
    const cursor = await GET_DB().collection('Authorize').find({}).toArray()
    return cursor
  } catch (error) {
    throw new Error(error)
  }
}
export const userModel = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  createNew,
  handleUserLogin,
  getAllUser,
  deleteUser,
  getUser,
  editUser,
  updatePermission,
  getPermissions
}