'use strict'

const utilities = require('./utilities')()

const resolvers = {
  Query: {
    user: (_, args) => {
      return {
        _id: '1',
        username: 'Rafaell416',
        email: 'rvillarreal416@gmail.com'
      }
    }
  },
  Mutation: {
    login: (_, args) => {username: 'Rafaell416'},
    signup: (_, args) => utilities.signup(args.user)
  }
}



module.exports = resolvers
