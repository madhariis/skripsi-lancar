const Router = require(`koa-router`)
const router = new Router()

const { Transaction } = require(`repository`)

const { BadRequestCustom } = require(`lib/error`)

// Get my order
// router.get(`/:tableId/me`, hasToken, registeredCustomer, async (ctx, next) => {
//   const { tableId } = ctx.params
//   const { id } = ctx.request.querystring
//   try {
//     const transsaction = await Order.getMyTransaction({ table: { id: tableId }, id })
//     if (transsaction instanceof Error) throw transsaction
//     else {
//       ctx.status = 200
//       ctx.body = transsaction
//     }
//   } catch (error) {
//     throw new BadRequestCustom(error.message)
//   }
// })

router.get('/', async (ctx, next) => {
  const { start, end } = ctx.query
  const args = {}
  if (start) {
    args.start = start
  }
  if (end) {
    args.end = end
  }
  try {
    const transsaction = await Transaction.getSalesPerMenu(args)
    const customer = await Transaction.countCustomer({
      ...args,
      state: `paid`
    })
    if (transsaction instanceof Error) throw transsaction
    else {
      ctx.status = 200
      ctx.body = {
        transaction: transsaction,
        customer: customer.length
      }
    }
  } catch (error) {
    throw new BadRequestCustom(error.message)
  }
})

module.exports = router
