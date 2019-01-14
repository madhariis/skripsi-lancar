const {
  BadRequest
} = require(`lib/error`)
const {
  User
} = require(`repository`)

exports.validateCreateUser = async (ctx, next) => {
  ctx.checkBody('fullName').notEmpty().len(3, 100)
  ctx.checkBody('username').notEmpty()
  if (ctx.errors) {
    throw new BadRequest(ctx.errors)
  }
  else {
    await next()
  }
}

exports.validateUpdateUser = async (ctx, next) => {
  const user = await User.findOne({
    id: ctx.params.id
  })
  if (!user) throw new BadRequest([{ id: 'Invalid user' }])

  ctx.checkBody('fullName').notEmpty().len(3, 100)
  ctx.checkBody('username').notEmpty()

  if (ctx.errors) throw new BadRequest(ctx.errors)
  else await next()
}

exports.validateLogin = async (ctx, next) => {
  ctx.checkBody('username').notEmpty()
  ctx.checkBody('password').notEmpty()
  if (ctx.errors) {
    throw new BadRequest(ctx.errors)
  }
  else {
    await next()
  }
}

exports.validateQR = async (ctx, next) => {
  ctx.checkBody('username').notEmpty()
  ctx.checkBody('uniqueCode').notEmpty()
  if (ctx.errors) {
    throw new BadRequest(ctx.errors)
  } else {
    await next()
  }
}

module.exports = exports
