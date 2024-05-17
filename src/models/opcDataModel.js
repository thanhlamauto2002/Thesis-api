import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
const moment = require('moment');
const COLLECTION_NAME = 'OPCData'
const getDataChart = async (station, option) => {
  try {
    let data1 = null
    const currentTimeUnix = moment().valueOf()
    const oneHourAgoUnix = currentTimeUnix - (60 * 60 * 1000)
    const sevenDaysAgoUnix = currentTimeUnix - (7 * 24 * 60 * 60 * 1000)
    const thirtyDaysAgoUnix = currentTimeUnix - (30 * 24 * 60 * 60 * 1000)
    const startOfToday = moment().startOf('day').valueOf()
    switch (option) {
      case 'today':
        // Truy vấn dữ liệu từ MongoDB theo trường 'station' và thời gian 'createdAt' từ đầu ngày hôm nay đến hiện tại
        data1 = await GET_DB().collection(COLLECTION_NAME).find({
          'Station': station,
          'createdAt': { $gte: startOfToday }
        }).toArray();
        break;

      case 'l7day':
        // Truy vấn dữ liệu từ MongoDB theo trường 'station' và thời gian 'createdAt' trong 7 ngày gần nhất
        data1 = await GET_DB().collection(COLLECTION_NAME).find({
          'Station': station,
          'createdAt': { $gte: sevenDaysAgoUnix }
        }).toArray();
        break;

      case 'l30day':
        // Truy vấn dữ liệu từ MongoDB theo trường 'station' và thời gian 'createdAt' trong 30 ngày gần nhất
        data1 = await GET_DB().collection(COLLECTION_NAME).find({
          'Station': station,
          'createdAt': { $gte: thirtyDaysAgoUnix }
        }).toArray();
        break;
      case 'current':
        data1 = await GET_DB().collection(COLLECTION_NAME).find({
          'Station': station,
          'createdAt': { $gte: oneHourAgoUnix }
        }).toArray();
        break;
      default:
        throw new Error('Invalid option');
    }

    return data1;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};
const getDataReport = async (reqQuery) => {

  try {
    let data1 = null
    const startDateInt = parseInt(reqQuery.startDate, 10)
    const endDateInt = parseInt(reqQuery.endDate, 10)
    const option = reqQuery.option
    if (option === 'all-station') {
      const fieldNamePattern = reqQuery.gas
      const query = {
        createdAt: { $gte: startDateInt, $lte: endDateInt }  // createdAt nằm trong khoảng thời gian từ startDate đến endDate
      };
      const projection = {
        [fieldNamePattern]: 1, // Lấy trường fieldNamePattern
        createdAt: 1, // Lấy trường createdAt
        Station: 1, // Lấy trường Station
        StatusStation: 1,
        _id: 0
      };
      if (fieldNamePattern) {
        query[fieldNamePattern] = { $exists: true };
        const statusField = `Status${fieldNamePattern}`;
        projection[statusField] = 1;
      }

      data1 = await GET_DB().collection(COLLECTION_NAME).find(query).project(projection).toArray();
    } else {
      const station = reqQuery.station
      const optionDetail = reqQuery.optionDetail

      if (optionDetail !== 'allgas' && optionDetail !== 'Alarm') {
        const fieldNamePattern = reqQuery.optionDetail
        const query = {
          createdAt: { $gte: startDateInt, $lte: endDateInt },
          Station: station
        };
        const projection = {
          [fieldNamePattern]: 1, // Lấy trường fieldNamePattern
          createdAt: 1, // Lấy trường createdAt
          Station: 1, // Lấy trường Station
          StatusStation: 1,
          _id: 0
        };
        if (fieldNamePattern) {
          query[fieldNamePattern] = { $exists: true };
          const statusField = `Status${fieldNamePattern}`;
          projection[statusField] = 1;
        }
        data1 = await GET_DB().collection(COLLECTION_NAME).find(query).project(projection).toArray();

      } else {
        const query = {
          createdAt: { $gte: startDateInt, $lte: endDateInt },
          Station: station
        };
        const projection = {
          _id: 0,
          Latitude: 0,
          Longitude: 0,

        };
        console.log(query)
        data1 = await GET_DB().collection(COLLECTION_NAME).find(query).project(projection).toArray();
      }

      console.log(data1)
    }
    return data1;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}
export const opcDataModel = {
  COLLECTION_NAME,
  getDataChart,
  getDataReport
}