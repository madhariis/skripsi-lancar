const path = require(`path`)
const { readdirSync } = require(`fs`)

module.exports = function (source, {
  asList = false,
  excludes = [],
  isModule = false
} = {}) {
  const list =
    readdirSync(source)
      .filter(filename => {
        const name = path.basename(filename, path.extname(filename))
        return (
          name !== `index` &&
          !excludes.includes(name)
        )
      })
      .map((filename) => {
        const name = path.basename(filename, path.extname(filename))
        if (!asList && !isModule) {
          return {
            [name]: require(path.resolve(source, name))
          }
        } else {
          return require(path.resolve(source, name))
        }
      })
  if (list && list.length > 0) {
    if (!asList) return Object.assign(...list)
    else return list
  } else return undefined
}
