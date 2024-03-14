import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { userValidation } from '~/validations/userValidation'
import { userController } from '~/controllers/userController'
const Router = express.Router()

Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: 'GET: API get list users' })

  })
  .post(userValidation.createNew, userController.createNew)
// Router.route('/:id')
//   .get(userController.getUser)
//   .put()
export const userRoute = Router