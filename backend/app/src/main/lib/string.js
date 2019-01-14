const bcrypt = require(`bcryptjs`)

exports.comparePassword = (userPassword, databasePassword) => bcrypt.compareSync(userPassword, databasePassword)
