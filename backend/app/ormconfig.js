const isProduction = process.env[`NODE_ENV`] === `production`;

module.exports = {
  type: process.env[`APP_DB_TYPE`] || `mysql`,
  host: process.env[`APP_DB_HOST`] || `mysql`,
  port: process.env[`APP_DB_PORT`] || 3306,
  username: process.env[`APP_DB_USERNAME`] || `default`,
  password: process.env[`APP_DB_PASSWORD`] || `secret`,
  database: process.env[`APP_DB_DATABASE`] || `default`,
  synchronize: true,
  logging: false,
  entities: [
    "src/main/app/data/orm/entity/*.ts"
  ],
  subscribers: [
    "src/main/app/data/orm/subscriber/*.ts"
  ],
  migrations: [
    "src/main/app/data/orm/migration/*.ts"
  ],
  cli: {
    "entitiesDir": "src/main/app/data/orm/entity",
    "migrationsDir": "src/main/app/data/orm/migration",
    "subscribersDir": "src/main/app/data/orm/subscriber"
  }
};