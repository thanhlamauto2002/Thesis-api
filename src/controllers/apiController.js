const testApi = (req, res) => {
  return res.status(200).json({
    message: 'ok',
    data: 'test api'
  })
}
const getLogin = (req, res) => {
  return res.status(200).json({
    // email: ,
    // password:
  })
}
module.exports = {

  testApi
}