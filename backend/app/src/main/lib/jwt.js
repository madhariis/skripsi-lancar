const jwt = require('jsonwebtoken')
const {
  secret,
  expiresIn
} = config.jwt

exports.encode = user => jwt.sign({
  id: user.id
}, secret, {
  expiresIn: expiresIn
})

exports.decode = token => jwt.decode(token, secret)
