'use strict'

const utilities = require('./utilities')()

const resolvers = {
  Query: {
    user: (_, args, context) => context.user
  },
  Mutation: {
    login: (_, args, context) => utilities.login(args.username, args.password),
    signup: (_, args) => utilities.signup(args.user)
  }
}

module.exports = resolvers
