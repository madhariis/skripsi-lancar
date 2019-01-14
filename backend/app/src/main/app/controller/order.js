const Router = require(`koa-router`)
const router = new Router()

const { Order } = require(`repository`)

const { registeredCustomer, hasToken } = require(`./middleware/index`)

const { BadRequestCustom } = require(`lib/error`)

// Get All Order
router.get(`/all`, async (ctx, next) => {
  const order = await Order.find({
    state: `open`
  })
  ctx.status = 200
  ctx.body = order
})

// Get my order
router.get(`/me/:tableId`, hasToken, registeredCustomer, async (ctx, next) => {
  const { currentTable } = ctx
  const order = await Order.findOne({
    table: {
      id: currentTable.id
    },
    state: `open`
  })
  ctx.body = order
})

// Add and Create Order
router.put(
  `/:tableId/add`,
  hasToken,
  registeredCustomer,
  async (ctx, next) => {
    const { tableId } = ctx.params
    const { body } = ctx.request
    try {
      if (body.orderId) {
        // Update
        const updated = await Order.updateOrder(body, tableId)
        if (updated instanceof Error) throw updated
        ctx.status = 201
        ctx.body = updated
      } else {
        // Create
        const created = await Order.createOrder(body, tableId)
        if (created instanceof Error) throw created
        ctx.status = 201
        ctx.body = created
      }
    } catch (error) {
      throw new BadRequestCustom(error.message)
    }
  }
)

// Cancel Order
router.put(
  `/:tableId/cancel`,
  hasToken,
  registeredCustomer,
  async (ctx, next) => {
    const { tableId } = ctx.params
    const { body } = ctx.request
    try {
      const updated = await Order.cancel(body, tableId)
      if (updated instanceof Error) throw updated
      else ctx.status = 200
    } catch (error) {
      throw new BadRequestCustom(error.message)
    }
  }
)

// Close Order
router.put(
  `/:tableId/close`,
  hasToken,
  registeredCustomer,
  async (ctx, next) => {
    const { tableId } = ctx.params
    const { body } = ctx.request
    try {
      const closed = await Order.closeOrder(body, tableId)
      if (closed instanceof Error) throw closed
      else {
        ctx.status = 200
        ctx.body = closed
      }
    } catch (error) {
      throw new BadRequestCustom(error.message)
    }
  }
)

// My Trans
router.get(
  `/:tableId/mytransaction/:transactionId`,
  hasToken,
  registeredCustomer,
  async (ctx, next) => {
    const { tableId, transactionId } = ctx.params
    const transsaction = await Order.getMyTransaction({ table: { id: tableId }, id: transactionId })
    ctx.status = 200
    ctx.body = transsaction
  }
)

// End Transaction
router.patch(
  `/:tableId/end/:transactionId`,
  hasToken,
  registeredCustomer,
  async (ctx, next) => {
    const { tableId, transactionId } = ctx.params
    const transsaction = await Order.closeMyTransaction({
      table: { id: tableId },
      id: transactionId
    })
    ctx.status = 200
    ctx.body = transsaction
  }
)

// Update FoodStatus
router.put(`/foodstatus`, async (ctx, next) => {
  const { body } = ctx.request
  try {
    const updated = await Order.updateItems(body)
    if (updated instanceof Error) throw updated
    else {
      ctx.status = 200
      ctx.body = updated
    }
  } catch (error) {
    throw new BadRequestCustom(error.message)
  }
})

module.exports = router
