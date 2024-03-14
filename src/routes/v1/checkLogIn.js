import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { userValidation } from '~/validations/userValidation'
import { userController } from '~/controllers/userController'
import apiController from '~/controllers/apiController'

const Router = express.Router()

Router.route('/')
  .post((req, res) => {
    const { email, password } = req.body

    if (email === 'thanhlama102@gmail.com' && password === '12345678') {
      res.json({ success: true })// Trả về phản hồi thành công nếu thông tin đăng nhập đúng
    } else {
      res.status(401).json({ success: false })// Trả về một phản hồi không thành công hoặc mã lỗi nếu thông tin đăng nhập không đúng
    }
  })
export const login = Router