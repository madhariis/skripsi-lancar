const {
  BadRequest
} = require(`lib/error`)
const {
  Table
} = require(`repository`)

exports.validateCreateTable = async (ctx, next) => {
  ctx.checkBody('title').notEmpty().isAlphanumeric().len(3, 100)
  ctx.checkBody('capacity').notEmpty().isNumeric().len(1, 40)
  if (ctx.errors) {
    throw new BadRequest(ctx.errors)
  } else {
    await next()
  }
}

exports.validateUpdateTable = async (ctx, next) => {
  const tables = await Table.findOne({
    id: ctx.params.id
  })
  if (!tables) throw new BadRequest([{ id: 'Invalid table id' }])

  ctx.checkBody('title').isAlphanumeric().len(3, 100)
  ctx.checkBody('capacity').isNumeric().len(1, 40)
  ctx.checkBody('state').isAlphanumeric().len(1, 40)

  if (ctx.errors) throw new BadRequest(ctx.errors)
  else await next()
}

exports.validateRegisterTable = async (ctx, next) => {
  ctx.checkParams('uniqueCode').notEmpty()
  if (ctx.errors) throw new BadRequest(ctx.errors)
  else await next()
}

module.exports = exports
