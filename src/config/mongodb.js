



import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from '~/config/environment'

let doanDatabaseInstance = null

//Khoi tao 1 doi tuong mongoClientInstance de connect toi MongoDB
const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }

})
export const CONNECT_DB = async () => {
  //Goi ket noi toi MongoDB Atlas voi URI da khai bao trong than cua clientInstance
  await mongoClientInstance.connect()
  doanDatabaseInstance = mongoClientInstance.db(env.DATABASE_NAME)
}
export const CLOSE_DB = async () => {
  await mongoClientInstance.close()

}
export const GET_DB = () => {
  if (!doanDatabaseInstance) throw Error('Must connect to Database first!')
  return doanDatabaseInstance
}
