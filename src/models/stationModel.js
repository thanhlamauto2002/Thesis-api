import Joi from 'joi'

const STATION1_COLLECTION_NAME = 'station1'
const STATION1_COLLECTION_SCHEMA = Joi.object({
  SO2: Joi.number().required(),
  NO2: Joi.number().required(),
  CO2: Joi.number().required(),
  CO: Joi.number().required(),
  NO: Joi.number().required(),
  H2S: Joi.number().required(),
  time: Joi.date().timestamp('javascript').default(Date.now)
    .raw()
    .custom((value, helpers) => {
      const date = new Date(value)
      if (isNaN(date.getTime())) {
        return helpers.error('any.invalid')
      }
      // Lấy giờ và phút từ date
      const hour = date.getHours()
      const minute = date.getMinutes()
      // Kiểm tra giờ và phút
      if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
        return helpers.error('date.invalid')
      }
      // Trả về giá trị sau khi kiểm tra
      return value
    }, 'Custom validation')
})

export const station1Model = {
  STATION1_COLLECTION_NAME,
  STATION1_COLLECTION_SCHEMA
}