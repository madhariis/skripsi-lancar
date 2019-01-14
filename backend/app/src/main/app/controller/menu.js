const Router = require(`koa-router`)
const router = new Router()

const { Menu } = require(`repository`)

const {
  validateCreateMenu,
  validateUpdateMenu,
  validateCreateMenuCategory
} = require(`./validation/menu`)

// Find
router.get(`/`, async (ctx, next) => {
  const menus = await Menu.find({
    state: `available`
  })
  ctx.body = menus
})

// Find
router.get(`/category`, async (ctx, next) => {
  const menus = await Menu.findByCategory({
    menu: {
      state: `available`
    }
  })
  ctx.body = menus
})

// Find
router.get(`/category/all`, async (ctx, next) => {
  const category = await Menu.findCategory()
  ctx.body = category
})

// FindOne
router.get(`/:id`, async (ctx, next) => {
  const menus = await Menu.findOne({
    id: ctx.params.id,
    state: `available`
  })
  ctx.body = menus
})

// async function getCategory (input) {
//   let result = input.map(x => Menu.findOneCategory({ id: x }))
//   return Promise.all(result)
// }

// Create
router.post(`/`, validateCreateMenu, async (ctx, next) => {
  const { body } = ctx.request
  let category
  if (body.category) {
    category = await Menu.findOneCategory({ id: body.category })
  }
  const menus = await Menu.create({
    title: body.title,
    state: `available` ? body.state : body.state,
    price: body.price,
    discount: body.discount ? body.discount : undefined,
    category: category,
    description: body.description
  })
  ctx.status = 201
  ctx.body = menus
})

// Create Menu Category
router.post(`/category`, validateCreateMenuCategory, async (ctx, next) => {
  const { body } = ctx.request
  const category = await Menu.createCategory({
    title: body.title
  })
  ctx.status = 201
  ctx.body = category
})

// Update
router.put(`/:id`, validateUpdateMenu, async (ctx, next) => {
  const { body } = ctx.request
  let category
  if (body.category) {
    category = await Menu.findOneCategory({ id: body.category })
  }
  const menus = await Menu.update({
    id: ctx.params.id,
    title: body.title,
    state: `available` ? body.state : body.state,
    price: body.price,
    discount: body.discount ? body.discount : undefined,
    category: category,
    description: body.description
  })
  ctx.status = 201
  ctx.body = menus
})

// Update Food Status to Available
router.patch(`/:id/available`, async (ctx, next) => {
  const menu = await Menu.update({
    id: ctx.params.id,
    state: `available`
  })
  ctx.status = 200
  ctx.body = menu
})

// Update Food Status to Out Of Stock
router.patch(`/:id/out-of-stock`, async (ctx, next) => {
  const menu = await Menu.update({
    id: ctx.params.id,
    state: `out_of_stock`
  })
  ctx.status = 200
  ctx.body = menu
})

// Delete Menu
router.delete(`/:id`, async (ctx, next) => {
  await Menu.deleteMenu({
    id: ctx.params.id
  })
  ctx.status = 204
})

// Delete Category
router.delete(`/category/:id`, async (ctx, next) => {
  await Menu.deleteCategory({
    id: ctx.params.id
  })
  ctx.status = 204
})

module.exports = router
