const { BadRequest } = require(`lib/error`)
const { Menu } = require(`repository`)

exports.validateCreateMenu = async (ctx, next) => {
  ctx
    .checkBody(`title`)
    .notEmpty()
    .len(3, 100)
  ctx
    .checkBody(`price`)
    .notEmpty()
    .isNumeric()
  ctx.checkBody(`category`).notEmpty()
  if (ctx.errors) {
    throw new BadRequest(ctx.errors)
  } else {
    await next()
  }
}

exports.validateCreateMenuCategory = async (ctx, next) => {
  ctx
    .checkBody(`title`)
    .notEmpty()
    .len(3, 100)
  if (ctx.errors) {
    throw new BadRequest(ctx.errors)
  } else {
    await next()
  }
}

exports.validateUpdateMenu = async (ctx, next) => {
  const menus = await Menu.findOne({
    id: ctx.params.id
  })
  if (!menus) throw new BadRequest([{ id: `Invalid menu id` }])

  // ctx.checkBody('title').alphanum().len(3, 100)
  // ctx.checkBody('capacity').number().min(1).max(40)
  // ctx.checkBody('state').alphanum().min(1).max(40)

  if (ctx.errors) throw new BadRequest(ctx.errors)
  else await next()
}

module.exports = exports
