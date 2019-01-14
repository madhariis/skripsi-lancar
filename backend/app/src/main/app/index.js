(async () => {
  const isProduction = config.isProduction

  const emitter = require(`lib/emitter`)
  const trycatch = require(`lib/trycatch`)
  const uuid = require(`uuid/v4`)

  const Koa = require(`koa`)
  const bodyParser = require(`koa-body`)
  const cors = require(`@koa/cors`)

  const {
    DateTime
  } = require(`luxon`)

  DateTime.localJSDate = () => {
    return DateTime
    .local()
    .setZone(config.timezone)
    .toJSDate()
  }

  const app = new Koa()
  app.proxy = true

  try {
    await require(`db`)
  } catch (err) {
    process.emit(`uncaughtException`, err)
    process.exit()
  }

  app.on(`error`, err => {
    process.emit(`uncaughtException`, err)
  })
  require('koa-validate')(app)

  app.use(require(`lib/error_handler`))
  app.use(cors())
  app.use(bodyParser())

  app.useRouter = (router) => {
    app.use(router.routes())
    app.use(router.allowedMethods())
  }

  app.useRouter(require(`controller`))

  const server = require(`http`).Server(app.callback())

  const ws = require(`socket.io`)(server)
  ws.on(`connection`, async (client) => {
    const recipient = client.handshake.query.recipient
    client.join(recipient)
  })

  emitter.on(`server:push`, async (args) => {
    ws.emit(`push`, args)
  })

  server.listen(
    config.server.port,
    config.server.host,
    () => println(`Server is started\nisProduction: ${isProduction}.`)
  )
})()
