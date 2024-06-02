import express from 'express'
import { userController } from '~/controllers/userController'
import { checkRoleUser } from '~/middlewares/JWTaction'
const Router = express.Router()

//api xử lý login
Router.route('/checkuser')
  .post(userController.handleUserLogin)
//api thêm user
Router.route('/createuser')
  .post(checkRoleUser, userController.createNew)
//api xóa user
Router.route('/deleteuser')
  .post(checkRoleUser, userController.deleteUser)
//api sửa thông tin user
Router.route('/edituser')
  .post(checkRoleUser, userController.editUser)
//api lấy all user
Router.route('/getalluser')
  .get(userController.getAllUser)
//api lấy 1 user
Router.route('/getuser')
  .get(userController.getUser)
//api decode token
Router.route('/verifytoken')
  .post(userController.handToken)
Router.route('/updatePermissions')
  .post(userController.updatePermission)
Router.route('/getPermissions')
  .get(userController.getPermissions)
export const userRoute = Router