global.Promise = require(`bluebird`)
global.print = console.log
global.println = function () {
  print(...arguments)
  print()
}
global.delay = setTimeout
global.later = setImmediate
global.repeat = setInterval

process.on(`uncaughtException`, (error) => {
  println(error)
})

{
  const path = require(`path`)

  const aliases = {
    lib: path.resolve(__dirname, `lib`),
    app: path.resolve(__dirname, `app`),
    db: path.resolve(__dirname, `app/data/orm`),
    entities: path.resolve(__dirname, `app/data/orm/entity`),
    controller: path.resolve(__dirname, `app/controller`),
    repository: path.resolve(__dirname, `app/data/orm/repository`)
  }

  const Module = require(`module`)
  const $require = Module.prototype.require
  Module.prototype.require = function () {
    const target = path.parse(arguments[0])
    if (!target.root) {
      if (target.dir) {
        const dirs = target.dir.split(`/`)
        if (dirs[0] !== `.` && dirs[0] !== `..`) {
          const resolved = aliases[dirs[0]]
          if (resolved) {
            target.dir = path.join(resolved, dirs.slice(1).join(path.sep))
            arguments[0] = path.format(target)
          }
        }
      } else {
        const resolved = aliases[target.name]
        if (resolved) {
          arguments[0] = resolved
        }
      }
    }
    return $require.apply(this, arguments)
  }
}

{
  (
    process.env[`APP_TIMEZONE`] =
      process.env[`APP_TIMEZONE`] ||
      `Asia/Jakarta`
  );

  (
    process.env[`APP_SERVER_HOST`] =
      process.env[`APP_SERVER_HOST`] ||
      `0.0.0.0`
  );

  (
    process.env[`APP_SERVER_PORT`] =
      process.env[`APP_SERVER_PORT`] ||
      3000
  );
}

global.config = {
  isProduction: process.env[`NODE_ENV`] === `production`,
  timezone: process.env[`APP_TIMEZONE`],
  server: {
    host: process.env[`APP_SERVER_HOST`],
    port: process.env[`APP_SERVER_PORT`]
  },
  jwt: {
    secret: process.env['JWT_SECRET_KEY'],
    expiresIn: 36000
  }
}

require(`app`)
