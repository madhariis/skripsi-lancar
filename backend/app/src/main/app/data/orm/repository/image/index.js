const Util = require(`../util`)
const {
  Image,
  Menu
} = require(`entities`)

exports.find = async (args = {}) => {
  const result = await Util.find(Image, {
    where: args,
    relations: [`menu`]
  })
  return result
}

exports.findOne = async (args = {}) => {
  const result = await Util.findOne(Image, {
    where: args,
    relations: [`menu`]
  })
  return result
}

exports.create = async input => {
  const result = await Util.create(Image, input)
  return result
}

exports.upload = async input => {
  const menu = await Util.findOne(Menu, {
    id: input.menuId
  })
  input.menu = menu
  delete input.menuId
  const result = await Util.create(Image, input)
  return result
}

