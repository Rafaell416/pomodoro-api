'use strict'

const { PubSub } = require('apollo-server-express')
let pubSub = null

module.exports = function getPubSubInstance () {
  if (!pubSub) {
    pubSub = new PubSub()
  }
  return pubSub
}
