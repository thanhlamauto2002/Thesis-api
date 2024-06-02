//eslint-disable no-console
import { env } from './config/environment'
import express from 'express'
import cors from 'cors'
import { corsOptions } from './config/cors'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, GET_DB, CLOSE_DB } from '~/config/mongodb'
import { APIs_V1 } from './routes/v1'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'
import { station1Controller } from '~/controllers/stationBk'
import { station2Controller } from '~/controllers/stationHg'
import { station3Controller } from '~/controllers/stationTv'
const app = express()
var bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
const opcua = require('node-opcua');
var cookieParser = require('cookie-parser')
const { Server } = require('socket.io')
const http = require('http')
const nodemailer = require('nodemailer');



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
      // io.emit('data', { data1, data2, data3 })
    } catch (error) {
      console.error('Error fetching data from MongoDB:', error);
    }
  }
  io.on('connection', async (socket) => {
    console.log('user connected')

    fetchDataFromMongoDBAndEmitData(socket); // Gửi dữ liệu khi có kết nối mới

    const interval = setInterval(() => {
      // fetchDataFromMongoDBAndEmitData(socket);
    }, 1000); // 60000 milliseconds = 1 phút
    //alarm BK
    socket.on('saveAlarmsBK', (data) => {
      station1Controller.createNewAlarm(data)
    });
    //
    //alarm HG
    socket.on('saveAlarmsHG', (data) => {
      station2Controller.createNewAlarm(data)
    });
    //
    //alarm TV
    socket.on('saveAlarmsTV', (data) => {
      station3Controller.createNewAlarm(data)
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
  //gui mail


  //


  //OPC UA

  const connectionPool = new Map();
  function checkConnection(endpointUrl, timeout) {
    return new Promise((resolve, reject) => {
      const client = opcua.OPCUAClient.create();

      const timerId = setTimeout(() => {
        client.disconnect(() => {
          reject(new Error('Timeout khi kết nối tới OPC UA Server'));
        });
      }, timeout);

      client.connect(endpointUrl, (err) => {
        clearTimeout(timerId);
        if (err) {
          reject(err);
        } else {
          resolve(client); // Trả về đối tượng client nếu kết nối thành công
        }
      });
    });
  }

  async function initializeConnection(ip, checkFirst) {

    const endpointUrl = `opc.tcp://${ip}:4840`;
    const timeout = 5000; // Thời gian timeout là 5 giây
    try {
      // Kiểm tra kết nối đến OPC UA server trước khi khởi tạo kết nối và session

      const client = await checkConnection(endpointUrl, timeout);

      console.log(`Đã kết nối tới OPC UA server: ${ip}`);
      await GET_DB().collection('OPCServerList').updateOne(
        { IP: ip }, // Điều kiện tìm kiếm: tìm bản ghi với email cụ thể
        { $set: { FirstConnect: 0 } } // Dữ liệu cần cập nhật
      )
      io.emit('connectionSuccess', `Đã kết nối tới OPC UA Server ${ip}`)
      const session = await client.createSession();
      console.log('Đã tạo session');

      const opcServerInfo = await GET_DB().collection('OPCServerList').findOne({ IP: ip });
      if (!opcServerInfo) {
        throw new Error(`Không tìm thấy thông tin OPC Server với IP: ${ip}`);
      }

      const { Station, servers } = opcServerInfo;

      // Kiểm tra và thêm Station vào StationList nếu chưa tồn tại
      const stationInfo = await GET_DB().collection('StationList').findOne({ Station: Station });
      if (!stationInfo) {
        await GET_DB().collection('StationList').insertOne({
          Station: Station,
        });
      }

      // Lưu kết nối và session vào pool
      connectionPool.set(ip, { client, session });


    } catch (error) {
      console.error(`Lỗi khi kết nối và khởi tạo session tới OPC UA Server ${ip}:`, error);
      if (checkFirst === 1) {
        await GET_DB().collection('OPCServerList').deleteOne({ IP: ip });
        io.emit('connectionError', `Không kết nối được tới ${ip}`)

      }
      // Thực hiện xử lý lỗi khác nếu cần thiết
    }
  }
  async function readDataFromOPCServers() {
    try {
      // Lấy danh sách OPC Servers từ MongoDB
      const opcServers = await GET_DB().collection('OPCServerList').find({}).toArray();
      const collection = await GET_DB().collection('OPCData');

      // Tạo mảng các promise để khởi tạo kết nối đồng thời tới các OPC Server
      const connectionPromises = opcServers.map(async (opcServer) => {
        const { FirstConnect, IP, Station, servers } = opcServer;

        try {
          // Kiểm tra xem kết nối đã được khởi tạo chưa
          if (!connectionPool.has(IP)) {
            console.log('Đang khởi tạo kết nối tới OPC UA server:', IP);
            const stationInfo = await GET_DB().collection('StationList').findOne({ Station });
            if (stationInfo) {
              await GET_DB().collection('StationList').deleteOne({ Station: Station });
            }
            await initializeConnection(IP, FirstConnect);
          }

          // Lấy kết nối và session từ pool
          const { client, session } = connectionPool.get(IP);
          // if (!client.isConnected) {
          //   console.log(`Mất kết nối tới OPC UA server: ${IP}, đang tái kết nối...`);
          //   connectionPool.delete(IP);
          //   console.log(connectionPool)
          //   io.emit('connectionLost', `Kết nối tới OPC UA Server ${IP} đã bị ngắt.`);
          //   await initializeConnection(IP);
          // }

          // Đối tượng chứa dữ liệu đọc từ các nodes của OPC Server
          const dataObject = {
            Station: Station,
            createdAt: new Date().getTime(),
          };
          // Đọc dữ liệu từ các node của OPC Server
          for (const server of servers) {
            const stationInfo = await GET_DB().collection('StationList').findOne({ Station });
            const { parameterName, namespace, nodeId, setpoint } = server;

            // Tạo nodeId từ thông tin namespace và nodeId
            const fullNodeId = `ns=${namespace};i=${nodeId}`;

            // Đọc giá trị từ nodeId
            const dataValue = await session.read({ nodeId: opcua.resolveNodeId(fullNodeId) });
            const value = dataValue.value.value;
            if (parameterName === 'CO' || parameterName === 'NO' || parameterName === 'SO2' || parameterName === 'Dust') {
              // Lưu giá trị setpoint vào dataObject
              dataObject[`${parameterName}_setpoint`] = setpoint;
            }
            if (!parameterName.startsWith('Status')) {
              dataObject[parameterName] = value;
            } else {
              if (parameterName !== 'StatusStation') {
                const statusPropertyName = `${parameterName}`;
                dataObject[statusPropertyName] = getStatus(value);
              } else {
                const statusPropertyName = `${parameterName}`;
                dataObject[statusPropertyName] = getStatusConnect(value);
              }
            }

            if (parameterName === 'Latitude') {

              await GET_DB().collection('StationList').updateOne(
                { Station: Station },
                { $set: { Latitude: value } }
              );


            }
            if (parameterName === 'Longitude') {
              await GET_DB().collection('StationList').updateOne(

                { Station: Station },
                { $set: { Longitude: value } }
              );

            }

          }

          // Lưu dữ liệu vào MongoDB
          await collection.insertOne(dataObject);
          io.emit('opcData', { station: Station, data: dataObject });

        } catch (error) {
          console.error(`Lỗi khi đọc dữ liệu từ OPC UA Server ${IP}:`, error);
          if (connectionPool.has(IP)) {
            console.log(`Kết nối tới OPC UA server ${IP} bị ngắt. Xóa kết nối khỏi connectionPool.`);
            connectionPool.delete(IP);
            io.emit('connectionLost', `Kết nối tới OPC UA Server ${IP} đã bị ngắt.`);
          }
        }

      });

      // Chạy các promise song song và chờ cho đến khi tất cả hoàn thành
      await Promise.all(connectionPromises);

      console.log('Đã đọc dữ liệu từ tất cả OPC Servers thành công');
    } catch (error) {
      console.error('Lỗi khi đọc dữ liệu từ các OPC Server:', error);
    }
  }
  function getStatus(statusValue) {
    switch (statusValue) {
      case 0:
        return 'Normal';
      case 1:
        return 'Error';
      case 2:
        return 'Calib';
      default:
        return 'Unknown';
    }
  }
  function getStatusConnect(checkValue) {
    switch (checkValue) {
      case 0:
        return 'Connected';
      case 1:
        return 'Disconnected';
      default:
        return 'Unknown'; // Trường hợp không hợp lệ, bạn có thể xử lý tuỳ ý
    }
  }
  async function fetchDataFromOPCServersPeriodically() {
    // Sử dụng vòng lặp vô hạn để thực hiện việc đọc dữ liệu mỗi giây
    setInterval(async () => {
      try {
        // Gọi hàm đọc dữ liệu từ OPC Servers
        await readDataFromOPCServers();
      } catch (error) {
        console.error('Lỗi khi đọc dữ liệu từ các OPC Servers:', error);
      }
    }, 1000); // 1000 milliseconds = 1 giây
  }

  // Bắt đầu đọc dữ liệu từ OPC Servers mỗi giây
  fetchDataFromOPCServersPeriodically()

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
