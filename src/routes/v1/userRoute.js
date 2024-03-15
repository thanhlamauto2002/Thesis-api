import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { userValidation } from '~/validations/userValidation'
import { userController } from '~/controllers/userController'
const Router = express.Router()

Router.route('/createuser')
  .post(userValidation.createNew, userController.createNew)
// Router.route('/:id')
//   .get(userController.getUser)
//   .put()
Router.route('/checkuser')
  .post(userController.handleUserLogin)
export const userRoute = Router