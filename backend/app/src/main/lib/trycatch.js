module.exports = async (target, onError) => {
  try {
    return await target()
  } catch (err) {
    println(err)

    if (!onError) return undefined
    else return onError(err)
  }
}
