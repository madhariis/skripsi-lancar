const Router = require(`koa-router`)
const router = new Router()

const { Image } = require(`repository`)

const { BadRequestCustom } = require(`lib/error`)

// Upload
router.post(`/upload`, async (ctx, next) => {
  const { body } = ctx.request
  try {
    const created = await Image.upload(body)
    if (created instanceof Error) throw created
    else {
      ctx.status = 201
      ctx.body = created
    }
  } catch (error) {
    throw new BadRequestCustom(error.message)
  }
})

module.exports = router
