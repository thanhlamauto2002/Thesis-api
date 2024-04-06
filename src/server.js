//eslint-disable no-console
import { env } from './config/environment'
import express from 'express'
import cors from 'cors'
import { corsOptions } from './config/cors'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, GET_DB, CLOSE_DB } from '~/config/mongodb'
import { APIs_V1 } from './routes/v1'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'
import { createJWT, verifyToken } from '~/middlewares/JWTaction'
import { station1Controller } from '~/controllers/stationBk'
import { station2Controller } from '~/controllers/stationHg'
import { station3Controller } from '~/controllers/stationTv'

const opcua = require('node-opcua');
var cookieParser = require('cookie-parser')
const { Server } = require('socket.io')
const http = require('http')
const app = express()
app.use(cookieParser())

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
  // test JWT

  // phần khác
  app.get('/', async (req, res) => {
    // process.exit(0)
    res.end('<h1>Hello World!</h1><hr>')
  })
  //lấy dữ liệu từ OPC UA
  const endpointUrl = 'opc.tcp://192.168.1.154:4840';
  const client = opcua.OPCUAClient.create({ endpoint_must_exist: false });
  (async () => {
    try {
      // Kết nối đến OPC UA server
      await client.connect(endpointUrl);

      console.log('Đã kết nối tới OPC UA server');

      // Tạo một session
      const session = await client.createSession();

      console.log('Đã tạo session');

      // Đọc dữ liệu từ OPC UA server và lưu vào các collections mỗi phút
      setInterval(async () => {
        try {
          // Lấy ngày và giờ hiện tại
          // const currentDate = new Date();
          // const date = currentDate.toLocaleDateString();
          // const time = currentDate.toLocaleTimeString();

          // Mảng các nodeId cần đọc dữ liệu
          const nodeIds = [
            'ns=2;i=3',  //CO2
            'ns=2;i=2',  //NO2
            'ns=2;i=4',  //SO2
            'ns=2;i=6',  //Temp
            'ns=2;i=5',  //O2
            'ns=2;i=7',  //Press
            'ns=2;i=10', //co2
            'ns=2;i=9',  //no2
            'ns=2;i=11', //so2
            'ns=2;i=13',  //temp
            'ns=2;i=12',  //o2
            'ns=2;i=14',  //press
            'ns=2;i=17',  //co2
            'ns=2;i=16',  //no2
            'ns=2;i=18',  //so2
            'ns=2;i=20',  //temp
            'ns=2;i=19',  //o2
            'ns=2;i=21',  //press
          ];
          const nodeIdsArray = nodeIds.map(nodeId => opcua.resolveNodeId(nodeId));

          // Đọc dữ liệu từ các nodeId
          session.readVariableValue(nodeIdsArray, (err, dataValues) => {
            // Đọc dữ liệu từ các nodeId
            //const dataValues = await session.read(nodeIds);

            const dataTerminal1 = {
              CO2: dataValues[0].value.value,
              NO2: dataValues[1].value.value,
              SO2: dataValues[2].value.value,
              Temperature: dataValues[3].value.value,
              O2: dataValues[4].value.value,
              Pressure: dataValues[5].value.value,
              Station: 'Bach Khoa'
            };

            station1Controller.createNew(dataTerminal1)

            const dataTerminal2 = {

              CO2: dataValues[6].value.value,
              NO2: dataValues[7].value.value,
              SO2: dataValues[8].value.value,
              Temperature: dataValues[9].value.value,
              O2: dataValues[10].value.value,
              Pressure: dataValues[11].value.value,
              Station: 'Hau Giang'

            };
            station2Controller.createNew(dataTerminal2)

            const dataTerminal3 = {

              CO2: dataValues[12].value.value,
              NO2: dataValues[13].value.value,
              SO2: dataValues[14].value.value,
              Temperature: dataValues[15].value.value,
              O2: dataValues[16].value.value,
              Pressure: dataValues[17].value.value,
              Station: 'Tra Vinh'

            };
            station3Controller.createNew(dataTerminal3)

            console.log('Đã lưu dữ liệu vào các collections');
          });

        } catch (err) {
          console.error('Lỗi khi đọc giá trị từ OPC UA server:', err);

        }

      }, 60000); // Thực hiện mỗi phút
    } catch (err) {
      console.error('Không thể kết nối tới OPC UA server:', err);
      process.exit(1);
    }
  })();
  //
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
