import jwt from 'jsonwebtoken'
import { env } from '~/config/environment'
const cookieParser = require('cookie-parser');

const createJWT = (payload) => {
  let key = process.env.JWT_SECRET
  let token = null
  try {
    token = jwt.sign(payload, key)
    console.log(token)
  } catch (err) {
    console.log(err)
  }

  return token
}

const verifyToken = (token) => {
  let key = process.env.JWT_SECRET
  let data = null
  try {
    let decoded = jwt.verify(token, key)
    data = decoded
  } catch (err) {
    console.log(err)
  }
  return data
}
const checkRoleUser = async (req, res, next) => {
  try {
    const token = req.query.token
    const data = verifyToken(token)
    if (data.role === 'Admin') {
      next()
    } else {
      res.json({ message: 'You are not authorized' })
    }
  } catch (error) {
    next(error)
  }
}
module.exports = {
  createJWT,
  verifyToken,
  checkRoleUser
}