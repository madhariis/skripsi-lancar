const { getManager } = require(`typeorm`)
module.exports = {
  async findOne (Entity, options = {}) {
    return this.find(Entity, options, true)
  },

  async find (Entity, options = {}, asSingle = false) {
    if (asSingle) {
      const result = await Entity.findOne(options)
      return result
    }
    const result = await Entity.find(options)
    return result
  },

  async create (Entity, input) {
    return this.save(Entity, input, `INSERT`)
  },

  async update (Entity, input) {
    return this.save(Entity, input, `UPDATE`)
  },

  async updateByRef (Entity, input) {
    const existing = await this.findOne(Entity, {
      ref_id: input.ref_id
    })
    if (existing) {
      input[`id`] = existing.id
      return this.save(Entity, input, `UPDATE`)
    }
    return undefined
  },

  async save (Entity, input, kind) {
    const entity = await (async () => {
      switch (kind) {
        case `INSERT`: return new Entity()
        case `UPDATE`:
          const result = await this.findOne(Entity, {
            where: {
              id: input.id
            }
          })
          return result
        default: return undefined
      }
    })()
    if (entity) {
      entity.fill(input)
      const saved = await entity.save()
      return saved
    }
    return undefined
  },

  async delete (Entity, args = {}) {
    const entityManager = getManager()
    const result = await entityManager.delete(Entity, args)
    return result
  }
}
