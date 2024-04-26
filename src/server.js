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
    }, 1000); // 60000 milliseconds = 1 phút
    //alarm BK
    socket.on('saveAlarmsBK', (data) => {
      station1Controller.createNewAlarm(data)
      console.log('Received saveAlarmsBK from client:', data);
    });
    //
    //alarm HG
    socket.on('saveAlarmsHG', (data) => {
      station2Controller.createNewAlarm(data)
      console.log('Received saveAlarmsHG from client:', data);
    });
    //
    //alarm TV
    socket.on('saveAlarmsTV', (data) => {
      station3Controller.createNewAlarm(data)
      console.log('Received saveAlarmsTV from client:', data);
    });
    //
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
  // const endpointUrl = 'opc.tcp://10.143.161.1:4880';
  const endpointUrl = 'opc.tcp://192.168.1.104:4840';

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
            //station1
            'ns=2;i=2',  //no 1
            'ns=2;i=3',  //co 1
            'ns=2;i=4',  //SO2 1
            'ns=2;i=5',  //O2 1
            'ns=2;i=6',  //Temp 1
            'ns=2;i=7',  //Dust 1
            'ns=2;i=8',  //no status 1
            'ns=2;i=9',  //co status1
            'ns=2;i=10', //so2 status1
            'ns=2;i=11', //o2 status1
            'ns=2;i=12',  //temp status1
            'ns=2;i=13',  //dust status1
            //station2
            'ns=2;i=15',  //no 2
            'ns=2;i=16',  //co 2
            'ns=2;i=17',  //so2 2
            'ns=2;i=18',  //o2 2
            'ns=2;i=19',  //temp 2
            'ns=2;i=20',  //dust 2
            'ns=2;i=21',  //no status 2
            'ns=2;i=22', // co status 2
            'ns=2;i=23',// so2 status 2
            'ns=2;i=24', //o2 status2
            'ns=2;i=25', //temp status 2
            'ns=2;i=26', //dust status 2
            //station3
            'ns=2;i=28', //no 3
            'ns=2;i=29', //co 3
            'ns=2;i=30', //so2 3
            'ns=2;i=31', //o2 3
            'ns=2;i=32', //temp3
            'ns=2;i=33', //dust3
            'ns=2;i=34', //no status3
            'ns=2;i=35', //co status3
            'ns=2;i=36', //so2 status3
            'ns=2;i=37', //o2 status3
            'ns=2;i=38', //temp status3
            'ns=2;i=39', //dust status3

          ];
          const nodeIdsArray = nodeIds.map(nodeId => opcua.resolveNodeId(nodeId));

          // Đọc dữ liệu từ các nodeId
          session.readVariableValue(nodeIdsArray, (err, dataValues) => {
            // Đọc dữ liệu từ các nodeId
            //const dataValues = await session.read(nodeIds);
            const getStatus = (checkValue) => {
              switch (checkValue) {
                case 0:
                  return 'Normal';
                case 1:
                  return 'Calib';
                case 2:
                  return 'Error';
                default:
                  return 'Unknown'; // Trường hợp không hợp lệ, bạn có thể xử lý tuỳ ý
              }
            };
            const dataTerminal1 = {
              CO: dataValues[1].value.value,
              NO: dataValues[0].value.value,
              SO2: dataValues[2].value.value,
              Temperature: dataValues[4].value.value,
              O2: dataValues[3].value.value,
              Dust: dataValues[5].value.value,
              Station: 'Bach Khoa Station',
              //status signal
              StatusTemp: getStatus(dataValues[10].value.value),
              StatusDust: getStatus(dataValues[11].value.value),
              StatusO2: getStatus(dataValues[9].value.value),
              StatusSO2: getStatus(dataValues[8].value.value),
              StatusCO: getStatus(dataValues[7].value.value),
              StatusNO: getStatus(dataValues[6].value.value)
            };
            station1Controller.createNew(dataTerminal1)

            const dataTerminal2 = {

              CO: dataValues[13].value.value,
              NO: dataValues[12].value.value,
              SO2: dataValues[14].value.value,
              Temperature: dataValues[16].value.value,
              O2: dataValues[15].value.value,
              Dust: dataValues[17].value.value,
              Station: 'Hau Giang Station',
              //status signal
              StatusTemp: getStatus(dataValues[22].value.value),
              StatusDust: getStatus(dataValues[23].value.value),
              StatusO2: getStatus(dataValues[21].value.value),
              StatusSO2: getStatus(dataValues[20].value.value),
              StatusCO: getStatus(dataValues[19].value.value),
              StatusNO: getStatus(dataValues[18].value.value)
            };

            station2Controller.createNew(dataTerminal2)

            const dataTerminal3 = {

              CO: dataValues[25].value.value,
              NO: dataValues[24].value.value,
              SO2: dataValues[26].value.value,
              Temperature: dataValues[28].value.value,
              O2: dataValues[27].value.value,
              Dust: dataValues[29].value.value,
              Station: 'Tra Vinh Station',
              //status signal
              StatusTemp: getStatus(dataValues[34].value.value),
              StatusDust: getStatus(dataValues[35].value.value),
              StatusO2: getStatus(dataValues[33].value.value),
              StatusSO2: getStatus(dataValues[32].value.value),
              StatusCO: getStatus(dataValues[31].value.value),
              StatusNO: getStatus(dataValues[30].value.value)
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
