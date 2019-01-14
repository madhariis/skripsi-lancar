const emitter = require(`lib/emitter`)

emitter.on(`data:didChanged`, async (data) => {
  // if (data instanceof Schedule) {
  //   emitter.emit(`server:push`, {
  //     kind: `update`,
  //   });
  // }
})

const Table = require(`./table`)
const Menu = require(`./menu`)
const User = require(`./user`)
const Order = require(`./order`)
const Transaction = require(`./transaction`)
const Image = require(`./image`)

module.exports = {
  Table,
  Menu,
  Order,
  User,
  Transaction,
  Image
}
