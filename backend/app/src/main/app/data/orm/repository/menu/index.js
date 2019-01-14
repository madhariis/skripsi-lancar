const Util = require(`../util`)
const {
  Menu,
  MenuCategory,
  Image
} = require(`entities`)

exports.find = async (args = {}) => {
  const result = await Util.find(Menu, {
    where: args,
    relations: [`images`, `category`]
  })
  return result
}

exports.findCategory = async (args = {}) => {
  const result = await Util.find(MenuCategory, {
    where: args
  })
  return result
}

exports.findByCategory = async (args = {}) => {
  const result = await Util.find(MenuCategory, {
    where: args,
    relations: [`menus.images`, `menus`]
  })
  return result
}

exports.findOne = async (args = {}) => {
  const result = await Util.findOne(Menu, {
    where: args,
    relations: [`images`, `category`]
  })
  return result
}

exports.findOneCategory = async (args = {}) => {
  const result = await Util.findOne(MenuCategory, {
    where: args
  })
  return result
}

exports.create = async input => {
  const result = await Util.create(Menu, input)
  return result
}

exports.createCategory = async input => {
  const result = await Util.create(MenuCategory, input)
  return result
}

exports.update = async input => {
  const result = await Util.update(Menu, input)
  return result
}

exports.deleteMenu = async input => {
  const images = await Util.find(Image, {
    where: {
      menu: input
    }
  })
  if (images.length > 0) {
    await Util.delete(Image, {
      menu: input
    })
  }
  const result = await Util.delete(Menu, input)
  return result
}

exports.deleteCategory = async input => {
  const menus = await Util.find(Menu, {
    where: {
      category: input
    }
  })
  if (menus) {
    await Util.delete(Menu, {
      category: input
    })
  }
  const result = await Util.delete(MenuCategory, input)
  return result
}

module.exports = exports
