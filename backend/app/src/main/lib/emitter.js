const events = require(`events`)

class EventEmitter extends events {}

module.exports = new EventEmitter()
