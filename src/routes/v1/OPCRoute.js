import express from 'express'
import { OPCServerListModel } from '~/models/listOPC'
const Router = express.Router()

Router.route('/')
  .post(OPCServerListModel.createNew)
export const OPCRoute = Router