'use strict'

const Mongoose = require('mongoose')

module.exports = async function (DB_URL) {
  Mongoose.connect(DB_URL)

  Mongoose.connection.on('error', () => console.log('There was an error connectin to database'))
  Mongoose.connection.once('open', () => console.log('Connection to db was setup successfully'))
}
