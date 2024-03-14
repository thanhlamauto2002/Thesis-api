import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { userValidation } from '~/validations/userValidation'
import { userController } from '~/controllers/userController'
import apiController from '~/controllers/apiController'

const Router = express.Router()

Router.route('/:id')
  .get(userController.getUser)

export const getUserAPI = Router