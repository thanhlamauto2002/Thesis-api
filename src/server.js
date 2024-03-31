//eslint-disable no-console
import { env } from './config/environment'
import express from 'express'
import cors from 'cors'
import { corsOptions } from './config/cors'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, GET_DB, CLOSE_DB } from '~/config/mongodb'
import { APIs_V1 } from './routes/v1'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'
import { station1Controller } from '~/controllers/stationBk';

const { Server } = require('socket.io')
const http = require('http')
const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Thay đổi địa chỉ này thành địa chỉ của ứng dụng React của bạn
    methods: ['GET', 'POST']
  }
})

const START_SERVER = async () => {

  async function fetchDataFromMongoDBAndEmitData(socket) {
    try {
      const data1 = await GET_DB().collection('BKstation').findOne({}, { sort: { _id: -1 } })
      const data2 = await GET_DB().collection('HGstation').findOne({}, { sort: { _id: -1 } })
      const data3 = await GET_DB().collection('TVstation').findOne({}, { sort: { _id: -1 } })

      // Gửi dữ liệu đến client
      io.emit('data', { data1, data2, data3 })
    } catch (error) {
      console.error('Error fetching data from MongoDB:', error);
    }
  }
  io.on('connection', async (socket) => {
    console.log('user connected')

    fetchDataFromMongoDBAndEmitData(socket); // Gửi dữ liệu khi có kết nối mới

    const interval = setInterval(() => {
      fetchDataFromMongoDBAndEmitData(socket);
    }, 10000); // 60000 milliseconds = 1 phút

    socket.on('disconnect', () => {
      console.log('user disconnected');
      clearInterval(interval); // Dừng lên lịch khi client disconnect
    });
    socket.emit('message', 'Welcome to the server!')
    socket.on('clientEvent', (data) => {
      console.log('Received data from client:', data)
      // Gửi phản hồi cho client
      socket.emit('serverResponse', 'Message received by server')
    })
  })

  // Xử lý cors và json
  app.use(cors(corsOptions))
  app.use(express.json())
  //use APIs V1
  app.use('/v1', APIs_V1)

  //Middleware xử lý lỗi tập trung
  app.use(errorHandlingMiddleware)

  app.get('/', async (req, res) => {
    // process.exit(0)
    res.end('<h1>Hello World!</h1><hr>')
  })

  server.listen(env.APP_PORT, env.APP_HOST, () => {
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
  .then(() => console.log('Connected to MongoDB Local'))
  .then(() => START_SERVER())
  .catch(error => {
    console.error(error)
    process.exit(0)
  })
