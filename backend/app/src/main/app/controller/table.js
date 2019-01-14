const Router = require(`koa-router`)
const router = new Router()
const jwt = require('lib/jwt')
const {
  Table
} = require(`repository`)

const {
  BadRequest
} = require(`lib/error`)

const {
  QRGenerator
} = require(`lib/qr_generator`)

const {
  validateCreateTable,
  validateUpdateTable,
  validateRegisterTable
} = require(`./validation/table`)

// Find
router.get('/', async (ctx, next) => {
  const tables = await Table.find()
  ctx.body = tables
})

// Reset
router.get('/reset', async (ctx, next) => {
  const tables = await Table.reset()
  ctx.status = 200
  ctx.body = tables
})

// FindOne
router.get('/:id', async (ctx, next) => {
  const tables = await Table.findOne({
    id: ctx.params.id
  })
  ctx.body = tables
})

// Create
router.post('/', validateCreateTable, async (ctx, next) => {
  const { body } = ctx.request
  const tables = await Table.create({
    title: body.title,
    capacity: body.capacity
  })
  ctx.status = 201
  ctx.body = tables
})

// Update
router.put('/:id', validateUpdateTable, async (ctx, next) => {
  const { body } = ctx.request
  const tables = await Table.update({
    id: ctx.params.id,
    title: body.title,
    capacity: body.capacity,
    state: body.state
  })
  ctx.status = 201
  ctx.body = tables
})

// Update
router.patch('/:uniqueCode/register', validateRegisterTable, async (ctx, next) => {
  const table = await Table.findOne({
    uniqueCode: ctx.params.uniqueCode
  })
  if (!table) {
    throw new BadRequest([{ id: 'Invalid table id' }])
  } else {
    if (table.state === `empty`) {
      const updated = await Table.update({
        id: table.id,
        state: `occupied`
      })
      updated.token = jwt.encode({ id: table.id })
      ctx.status = 201
      ctx.body = updated
    } else {
      throw new BadRequest([{ id: 'Table Already Taken' }])
    }
  }
})

// Update
router.patch('/:uniqueCode/unregister', validateRegisterTable, async (ctx, next) => {
  const table = await Table.findOne({
    uniqueCode: ctx.params.uniqueCode
  })
  if (!table) {
    throw new BadRequest([{ id: 'Invalid table id' }])
  } else {
    const updated = await Table.update({
      id: table.id,
      state: `empty`
    })
    ctx.status = 201
    ctx.body = updated
  }
})

// Update
router.patch('/:id/generate-qr', async (ctx, next) => {
  const table = await Table.findOne({
    id: ctx.params.id
  })
  if (!table) {
    throw new BadRequest([{ id: 'Invalid table id' }])
  } else {
    if (!table.qrCode && !table.qrCodeLink) {
      const generated = await QRGenerator({
        payload: table.uniqueCode,
        payloadId: table.id
      })
      const link = `https://kodakadik.com/?code=${table.uniqueCode}`
      const generatedLink = await QRGenerator({
        payload: link,
        payloadId: table.id
      })
      const updated = await Table.update({
        id: table.id,
        qrCode: generated,
        qrCodeLink: generatedLink
      })
      ctx.status = 201
      ctx.body = updated
    } else {
      ctx.status = 200
      ctx.body = table
    }
  }
})

module.exports = router
