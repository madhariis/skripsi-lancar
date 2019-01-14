const jwt = require(`jsonwebtoken`)
const {
  Table,
  User
} = require(`repository`)

const {
  Unauthorized,
  Forbidden
} = require(`lib/error`)

const KITCHEN = `kitchen`
const WAITER = `waiter`
const ADMIN = `admin`

exports.parsePubSub = async (ctx, next) => {
  const {
    message
  } = ctx.request.body

  const { event } = message.attributes

  const text = Buffer.from(message.data, `base64`)
  const data = JSON.parse(text)

  ctx.message = {
    event,
    data
  }

  await next()
}

exports.hasToken = async (ctx, next) => {
  const { header: { token } } = ctx
  if (token) {
    await next()
  } else {
    throw new Unauthorized('Missing Auth Token')
  }
}

exports.registeredCustomer = async (ctx, next) => {
  const { header: { token } } = ctx
  const {
    secret
  } = config.jwt
  const {
    tableId
  } = ctx.params

  try {
    const decoded = jwt.verify(token, secret)
    const table = await Table.findOne({
      id: decoded.id
    })
    if (table && table.id) {
      if (table.id === tableId) {
        ctx.currentTable = table
        await next()
      } else {
        throw new Unauthorized('Table Mismatch')
      }
    } else {
      throw new Unauthorized('Missing Table')
    }
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new Unauthorized('Token Expired')
    } else if (err.name === 'JsonWebTokenError') {
      throw new Unauthorized('Invalid Token')
    } else {
      throw err
    }
  }
}

exports.isAdmin = async (ctx, next) => {
  const user = ctx.currentUser
  if (user) {
    if (user.role === ADMIN) {
      await next()
    } else {
      throw new Forbidden(`Forbidden Permission`)
    }
  } else {
    throw new Unauthorized('Missing User')
  }
}

exports.isStaff = async (ctx, next) => {
  const user = ctx.currentUser
  if (user) {
    if (user.role === KITCHEN) {
      await next()
    } else {
      throw new Forbidden(`Forbidden Permission`)
    }
  } else {
    throw new Unauthorized('Missing User')
  }
}

exports.isKitchen = async (ctx, next) => {
  const user = ctx.currentUser
  if (user) {
    if (user.role === KITCHEN) {
      await next()
    } else {
      throw new Forbidden(`Forbidden Permission`)
    }
  } else {
    throw new Unauthorized('Missing User')
  }
}

exports.isWaiter = async (ctx, next) => {
  const user = ctx.currentUser
  if (user) {
    if (user.role === WAITER) {
      await next()
    } else {
      throw new Forbidden(`Forbidden Permission`)
    }
  } else {
    throw new Unauthorized('Missing User')
  }
}

exports.authenticate = async (ctx, next) => {
  const { header: { token } } = ctx
  const {
    secret
  } = config.jwt

  try {
    const decoded = jwt.verify(token, secret)
    const user = await User.findOne({
      id: decoded.id
    })

    if (user && user.id) {
      ctx.currentUser = user
      await next()
    } else {
      throw new Unauthorized('Missing User')
    }
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new Unauthorized('Token Expired')
    } else if (err.name === 'JsonWebTokenError') {
      throw new Unauthorized('Invalid Token')
    } else {
      throw err
    }
  }
}

module.exports = exports
