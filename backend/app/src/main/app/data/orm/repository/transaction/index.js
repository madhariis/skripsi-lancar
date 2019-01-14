const Util = require(`../util`)
const { Order, OrderItem, Table, Menu, Transaction, TransactionItem } = require(`entities`)
const { getManager } = require(`typeorm`)

exports.find = async (args = {}) => {
  const result = await Util.find(Transaction, {
    where: args,
    relations: [`items`, `items.menu`, `table`]
  })
  return result
}

exports.findOne = async (args = {}) => {
  const result = await Util.findOne(Transaction, {
    where: args,
    relations: [`items`, `items.menu`, `table`]
  })
  return result
}

exports.getSalesPerMenu = async (args = {}) => {
  const entityManager = getManager()
  let result = await entityManager
    .createQueryBuilder(TransactionItem, `transaction_item`)
    .leftJoinAndSelect(`transaction_item.menu`, `menu`)
    .addSelect(`SUM(transaction_item.total)`, `total`)

    // start >>> now >>> end
  if (args.start && args.end) {
    result = result
      .where(`DATE(transaction_item.createdDate) > DATE("${args.start}")`)
      .andWhere(`DATE(transaction_item.createdDate) < DATE("${args.end}")`)
  } else {
    if (args.start) {
      result = result.where(`DATE(transaction_item.createdDate) > DATE("${args.start}")`)
    }
    if (args.end) {
      result = result.where(`DATE(transaction_item.createdDate) < DATE("${args.end}")`)
    }
  }
  result = result
    .groupBy(`transaction_item.menuId`)
    // .printSql()
  return result.getRawMany()
}

exports.countCustomer = async (args = {}) => {
  const entityManager = getManager()
  // let result = await entityManager.count(Transaction, args)
  let result = await entityManager
    .createQueryBuilder(Transaction, `transaction`)

  if (args.start && args.end) {
    result = result
      .where(`DATE(transaction.createdDate) > DATE("${args.start}")`)
      .andWhere(`DATE(transaction.createdDate) < DATE("${args.end}")`)
  } else {
    if (args.start) {
      result = result.where(`DATE(transaction.createdDate) > DATE("${args.start}")`)
    }
    if (args.end) {
      result = result.where(`DATE(transaction.createdDate) < DATE("${args.end}")`)
    }
  }
  result = result.andWhere(`transaction.state = "${args.state}"`)
  return result.getRawMany()
}

module.exports = exports
