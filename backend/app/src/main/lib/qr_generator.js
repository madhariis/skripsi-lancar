const QRCode = require('qrcode')

exports.QRGenerator = async (args = {}) => {
  const {
    payload
  } = args
  return QRCode.toDataURL(payload)
}
module.exports = exports
