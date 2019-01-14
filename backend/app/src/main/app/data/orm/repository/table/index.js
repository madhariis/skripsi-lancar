const Util = require(`../util`)
const { Table, Order, OrderItem } = require(`entities`)
const { DateTime } = require(`luxon`)
const uuid = require(`uuid/v4`)

exports.find = async (args = {}) => {
  const result = await Util.find(Table, {
    where: args
  })
  return result
}

exports.findOne = async (args = {}) => {
  const result = await Util.findOne(Table, {
    where: args
  })
  return result
}

exports.create = async input => {
  input.registeredDate = DateTime.local().toJSDate()
  input.uniqueCode = uuid()
  const result = await Util.create(Table, input)
  return result
}

exports.update = async input => {
  const result = await Util.update(Table, input)
  return result
}

exports.reset = async () => {
  const result = await Util.find(Table)
  result.forEach(async element => {
    await Util.update(Table, {
      id: element.id,
      state: `empty`
    })
  })
  const orders = await Util.find(Order, {
    relations: [`items`, `items.menu`, `table`]
  })
  if (orders.length > 0) {
    orders.forEach(async el => {
      await Util.delete(OrderItem, el.items.map(x => x.id))
      await Util.delete(Order, { id: el.id })
    })
  } else {
    print(`kosong`)
  }
  return result
}

module.exports = exports
