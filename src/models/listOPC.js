import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
const COLLECTION_NAME = 'OPCServerList'

const createNew = async (req, res) => {
  const document = {
    IP: req.body.IP,
    Station: req.body.Station,
    servers: req.body.nodes
  };
  try {
    const create = await GET_DB().collection(COLLECTION_NAME).insertOne(document)
  } catch (error) {
    throw new Error(error)
  }
}
export const OPCServerListModel = {
  createNew
}