//eslint-disable no-console
import { env } from './config/environment'
import express from 'express'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, GET_DB, CLOSE_DB } from '~/config/mongodb'
const START_SERVER = () => {

  const app = express()


  app.get('/', async (req, res) => {
    console.log(process.env)
    process.exit(0)
    res.end('<h1>Hello World!</h1><hr>')
  })

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`Hello ${env.AUTHOR}, I am running at http://${env.APP_HOST}:${env.APP_PORT}/`)
  })
  exitHook(() => {
    console.log('Disconnecting from MongoDB')
    CLOSE_DB()
    console.log('Disconnected from MongoDB')

  })

}
// phải kết nối được với database mới start server
CONNECT_DB()
  .then(() => console.log('Connected to MongoDB Cloud Atlas!'))
  .then(() => START_SERVER())
  .catch(error => {
    console.error(error)
    process.exit(0)
  })