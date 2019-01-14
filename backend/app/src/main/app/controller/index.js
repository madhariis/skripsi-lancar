const Router = require(`koa-router`)
const router = new Router()
// const auth = require(`./auth`)
const tables = require(`./table`)
const menus = require(`./menu`)
const users = require(`./user`)
const orders = require(`./order`)
const transactions = require(`./transaction`)
const images = require(`./image`)

router.use('/api/table', tables.routes(), tables.allowedMethods())
router.use('/api/menu', menus.routes(), menus.allowedMethods())
router.use('/api/user', users.routes(), users.allowedMethods())
router.use('/api/order', orders.routes(), orders.allowedMethods())
router.use('/api/transaction', transactions.routes(), transactions.allowedMethods())
router.use('/api/image', images.routes(), images.allowedMethods())

module.exports = router
