import { station1Service } from '~/services/stationBk'
//hàm ghi data vào db
const createNew = async (dataTerminal1) => {
  console.log('DataBK from OPC UA: ', dataTerminal1)
  try {
    const create = await station1Service.createNew(dataTerminal1)
    // res.status(StatusCodes.CREATED).json(create)

  } catch (error) { throw new Error(error) }
}
//hàm ghi alarm BK
const createNewAlarm = async (alarmBK) => {
  try {
    console.log('req: ', alarmBK)
    const create = await station1Service.createNewAlarm(alarmBK)
    // res.status(StatusCodes.CREATED).json(create)
  } catch (error) { throw new Error(error) }
}
// Hàm lấy data report từ db
const getData = async (res, startDate, endDate) => {

  try {

    const data = await station1Service.getData(startDate, endDate)
    res.status(201).json(data)
  } catch (error) {
    throw new Error(error)
  }
}
//Hàm lấy data vẽ chart từ db
const getDataChart = async (res, option) => {

  try {

    const data = await station1Service.getDataChart(option)
    res.status(201).json(data)
  } catch (error) {
    throw new Error(error)
  }
}
// Hàm lấy alarm report từ db
const getAlarms = async (res, startDate, endDate) => {

  try {
    const data = await station1Service.getAlarms(startDate, endDate)
    res.status(201).json(data)
  } catch (error) {
    throw new Error(error)
  }
}
export const station1Controller = {
  createNew,
  getData,
  getDataChart,
  createNewAlarm,
  getAlarms
}