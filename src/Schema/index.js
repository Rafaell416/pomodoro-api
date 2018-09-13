'use strict'

const { makeExecutableSchema } = require('graphql-tools')
const { ApolloServer } = require('apollo-server-express')
const User = require('./User')
const Timer = require('./Timer')
const resolvers = require('../Resolvers')

const rootQuery =`
  type Query {
    user (username: String!) : User
    timer (uid: String!) : Timer
  }

  type Mutation {
    signup (user: newUser) : User
    login (username: String!, password: String!) : User
  }
`

const schema = makeExecutableSchema({
  typeDefs: [rootQuery, User, Timer],
  resolvers
})

module.exports = schema
