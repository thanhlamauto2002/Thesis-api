import { userService } from '~/services/userService'
import { StatusCodes } from 'http-status-codes'
import { verifyToken } from '~/middlewares/JWTaction'
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
//Hàm verify Token
const handToken = async (req, res, next) => {
  console.log('token from react: ', req.body.token)
  try {
    const checkToken = await verifyToken(req.body.token)
    res.status(200).json(checkToken)
  } catch (error) {
    next(error)
  }
}

// Hàm lấy tất cả user
const getAllUser = async (req, res) => {
  try {
    const getData = await userService.getAllUser()
    res.status(201).json(getData)
  } catch (error) {
    throw new Error(error)
  }
}
// Hàm lấy 1 user
const getUser = async (req, res) => {
  try {
    const getData = await userService.getUser(req.query)
    res.status(201).json(getData)
  } catch (error) {
    throw new Error(error)
  }
}

// hàm xóa user
const deleteUser = async (req, res) => {
  try {
    const getData = await userService.deleteUser(req.body)
    res.status(201).json(getData)
  } catch (error) {
    throw new Error(error)
  }
}
//
const editUser = async (req, res) => {
  try {
    const getData = await userService.editUser(req.body)
    res.status(201).json(getData)
  } catch (error) {
    throw new Error(error)
  }
}
export const userController = {
  createNew,
  handleUserLogin,
  handToken,
  getAllUser,
  deleteUser,
  getUser,
  editUser
}