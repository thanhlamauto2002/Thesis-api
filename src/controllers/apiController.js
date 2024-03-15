// import userService from '~/services/userService'


// const handleRegister = async (req, res) => {
//   try {
//     if (!req.body.email || !req.password) {
//       return res.status(200).json({
//         EM: 'Missing required params',
//         EC: '1',
//         DT: ''
//       })
//     }
//     let data = await userService.createNew(req.body)
    
//     return res.status(200).json({
//       EM: data.EM,
//       EC: data.EC,
//       DT: ''
//     })
//   } catch (error) {
//     return res.status(500).json({
//       EM: 'error from server',
//       EC: '',
//       DT: ''
//     })
//   }
// }