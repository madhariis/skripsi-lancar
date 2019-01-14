const Util = require(`../util`)
const { User } = require(`entities`)
const uuid = require(`uuid/v4`)
const bcrypt = require(`bcryptjs`)
const { QRGenerator } = require(`lib/qr_generator`)

exports.find = async (args = {}) => {
  const result = await Util.find(User, {
    where: args
  })
  return result
}

exports.findOne = async (args = {}) => {
  const result = await Util.findOne(User, {
    where: args
  })
  return result
}

// exports.create = async input => {
//   const salt = bcrypt.genSaltSync()
//   const hash = bcrypt.hashSync(input.password, salt)
//   input.password = hash
//   const result = await Util.create(User, input)
//   return result
// }

exports.create = async input => {
  input.uniqueCode = uuid()
  const user = await Util.create(User, input)
  const generatedQr = await QRGenerator({
    payload: `user:${input.username}:${input.role}:${input.uniqueCode}`,
    payloadId: user.id
  })
  const result = await Util.update(User, {
    id: user.id,
    qrCode: generatedQr
  })
  return result
}

exports.update = async input => {
  const result = await Util.update(User, input)
  return result
}

module.exports = exports
