const Router = require(`koa-router`)
const router = new Router()
const jwt = require('lib/jwt')
const {
  User
} = require(`repository`)

// const { comparePassword } = require(`lib/string`)

const {
  validateCreateUser,
  validateUpdateUser,
  // validateLogin,
  validateQR
} = require(`./validation/user`)

const {
  isAdmin,
  authenticate,
  hasToken
} = require(`./middleware/index`)

const {
  Unauthorized
} = require(`lib/error`)

// // Login
// router.post('/', validateLogin, async (ctx, next) => {
//   const { body } = ctx.request
//   const user = await User.findOne({
//     username: body.username
//   })

//   if (!user) throw new Unauthorized('Invalid Credentials')

//   if (!comparePassword(body.password, user.password)) throw new Unauthorized('Invalid Credentials')

//   user.token = jwt.encode({ id: user.id })
//   ctx.status = 201
//   ctx.body = user
// })

// Login By QRCode
router.post('/qrcode', validateQR, async (ctx, next) => {
  const { body } = ctx.request
  const user = await User.findOne({
    username: body.username,
    uniqueCode: body.uniqueCode
  })

  if (!user) throw new Unauthorized('Invalid Credentials')

  if (user.username !== body.username) throw new Unauthorized('Invalid Credentials')

  user.token = jwt.encode({ id: user.id })
  ctx.status = 200
  ctx.body = user
})

// Find
router.get('/all-qr', async (ctx, next) => {
  const users = await User.find()
  ctx.body = users
})

// Find
router.get('/', hasToken, authenticate, isAdmin, async (ctx, next) => {
  const users = await User.find()
  ctx.body = users
})

// FindOne
router.get('/:id', hasToken, authenticate, isAdmin, async (ctx, next) => {
  const user = await User.findOne({
    id: ctx.params.id
  })
  ctx.body = user
})

// FindOne
router.get('/me', hasToken, authenticate, async (ctx, next) => {
  const { id } = ctx.currentUser
  const user = await User.findOne({
    id: id
  })
  ctx.body = user
})

// Create
router.post('/', hasToken, authenticate, isAdmin, validateCreateUser, async (ctx, next) => {
  const { body } = ctx.request
  const user = await User.create({
    fullName: body.fullName,
    username: body.username,
    role: body.role ? body.role : `staff`
  })
  ctx.status = 201
  ctx.body = user
})

// Create
router.post(
  '/for-admin',
  async (ctx, next) => {
    const body = {
      fullName: `admin kodakadik`,
      username: `admin`,
      role: `admin`
    }
    const user = await User.create({
      fullName: body.fullName,
      username: body.username,
      role: body.role ? body.role : `staff`
    })
    ctx.status = 201
    ctx.body = user
  }
)

// Update
router.put('/:id', hasToken, authenticate, isAdmin, validateUpdateUser, async (ctx, next) => {
  const { body } = ctx.request
  const user = await User.update({
    fullName: body.fullName,
    username: body.username,
    role: body.role ? body.role : `staff`
  })
  ctx.status = 201
  ctx.body = user
})

module.exports = router
