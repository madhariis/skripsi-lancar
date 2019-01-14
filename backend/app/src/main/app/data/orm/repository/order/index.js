const Util = require(`../util`)
const { Order, OrderItem, Table, Menu, Transaction, TransactionItem } = require(`entities`)

exports.find = async (args = {}) => {
  const result = await Util.find(Order, {
    where: args,
    relations: [`items`, `items.menu`, `table`]
  })
  return result
}

exports.findOne = async (args = {}) => {
  const result = await Util.findOne(Order, {
    where: args,
    relations: [`items`, `items.menu`, `table`]
  })
  return result
}

exports.getMyTransaction = async (args = {}) => {
  const result = await Util.findOne(Transaction, {
    where: args,
    relations: [`items`, `items.menu`, `table`]
  })
  return result
}

exports.closeMyTransaction = async (args = {}) => {
  const result = await Util.findOne(Transaction, {
    where: args,
    relations: [`items`, `items.menu`, `table`]
  })
  result.state = `paid`
  result.paymentMethod = result.total
  result.save()
  await Util.update(Table, {
    id: result.table.id,
    state: `empty`
  })
  return result
}

exports.create = async input => {
  const result = await Util.create(Order, input)
  return result
}

exports.update = async input => {
  const result = await Util.update(Order, input)
  return result
}

exports.createOrder = async (body, tableId) => {
  const table = await Util.findOne(Table, {
    where: {
      id: tableId
    }
  })

  const order = await Util.create(Order, {
    table: table
  })

  const items = []
  body.items.map(async item => {
    const menu = await Util.findOne(Menu, {
      where: {
        id: item.menuId
      }
    })
    let created = await Util.create(OrderItem, {
      order: order,
      menu: menu,
      qty: item.qty,
      total: item.qty * menu.price,
      waiting: item.qty
    })
    items.push(created)
  })
  return order
}

exports.updateOrder = async (body, tableId) => {
  const order = await this.findOne({
    id: body.orderId
  })
  if (!order) return new Error(`Invalid Order`)
  const orderItemsId = order.items.map(x => x.menu.id)

  const items = []
  body.items.map(async item => {
    let menu = await Util.findOne(Menu, {
      where: {
        id: item.menuId
      }
    })
    if (orderItemsId.includes(item.menuId)) {
      let orderedItem = await Util.findOne(OrderItem, {
        where: {
          menu: {
            id: menu.id
          },
          order: {
            id: order.id
          }
        }
      })
      orderedItem.qty = parseInt(orderedItem.qty) + item.qty
      orderedItem.total = parseInt(orderedItem.total) + (item.qty * menu.price)
      orderedItem.waiting = parseInt(orderedItem.waiting) + item.qty
      orderedItem.save()
    } else {
      let created = await Util.create(OrderItem, {
        order: order,
        menu: menu,
        qty: item.qty,
        total: item.qty * menu.price,
        waiting: item.qty
      })
      items.push(created)
    }
  })
  return order
}

exports.cancel = async (args, tableId) => {
  const order = await this.findOne({
    id: args.orderId
  })
  if (!order) return new Error(`Invalid Order Id`)
  if (tableId !== order.table.id) return new Error(`Invalid Table`)

  for (let index = 0, len = args.cancel.length; index < len; index++) {
    let item = args.cancel[index]
    const currentOrder = await Util.findOne(OrderItem, {
      where: {
        menu: {
          id: item.menuId
        },
        order: {
          id: args.orderId
        }
      },
      relations: [`menu`]
    })
    if (currentOrder.qty < item.qty || currentOrder.waiting < item.qty) return new Error(`Invalid Value`)

    currentOrder.qty = parseInt(currentOrder.qty) - item.qty
    currentOrder.waiting = parseInt(currentOrder.waiting) - item.qty
    currentOrder.total = parseInt(currentOrder.total) - (parseInt(item.qty) * parseInt(currentOrder.menu.price))
    currentOrder.save()
  }
  return order
}

exports.closeOrder = async (args, tableId) => {
  const order = await this.findOne({
    id: args.orderId
  })
  if (!order) return new Error(`Invalid Order Id`)
  if (tableId !== order.table.id) return new Error(`Invalid Table`)
  const { waitingCounter, onProgressCounter, readyToServeCounter } = (() => {
    let waitingCounter = 0
    let onProgressCounter = 0
    let readyToServeCounter = 0
    for (let index = 0, len = order.items.length; index < len; index++) {
      const item = order.items[index]
      if (item.waiting > 0) waitingCounter = waitingCounter + 1

      if (item.onProgress > 0) onProgressCounter = onProgressCounter + 1

      if (item.readyToServe > 0) readyToServeCounter = readyToServeCounter + 1
    }
    return { waitingCounter, onProgressCounter, readyToServeCounter }
  })()

  if (waitingCounter > 0) {
    return new Error(`Please Cancel First`)
  }
  if (onProgressCounter > 0) {
    return new Error(`Please Wait, Cooking Your Order`)
  }
  if (readyToServeCounter > 0) {
    return new Error(`Please Wait, Serving Your Order`)
  }

  const transaction = await Util.create(Transaction, {
    table: order.table,
    discount: args.discount || 0,
    total: order.items.reduce((item, current) => {
      return item + parseInt(current.total)
    }, 0)
  })
  order.items.map(async item => {
    await Util.create(TransactionItem, {
      transaction: transaction,
      menu: item.menu,
      qty: item.served,
      total: parseInt(item.served) * parseInt(item.menu.price)
    })
  })
  await Util.delete(OrderItem, order.items.map(x => x.id))
  await Util.delete(Order, {id: order.id})
  return transaction
}

exports.updateItems = async (args) => {
  console.log(`args : `)
  console.log(args)
  const order = await this.findOne({
    id: args.orderId
  })
  if (!order) return new Error(`Invalid Order Id`)
  let item = await Util.findOne(OrderItem, {
    id: args.itemId
  })
  console.log(`item : `)
  console.log(item)
  const { onProgress, readyToServe, served } = args
  if (onProgress) {
    // Pindahin ke onprogress
    item.onProgress = onProgress
    item.waiting = parseInt(item.waiting) - parseInt(onProgress)
  }

  if (readyToServe) {
    // Pindahin ke done
    item.readyToServe = readyToServe
    item.onProgress = parseInt(item.onProgress) - parseInt(readyToServe)
  }

  if (served) {
    // Pindahin ke done
    item.served = served
    item.readyToServe = parseInt(item.readyToServe) - parseInt(served)
  }
  item = await item.save()
  console.log(`update: `)
  console.log(item)
  return item
}

module.exports = exports
