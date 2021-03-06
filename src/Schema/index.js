'use strict'

const { makeExecutableSchema } = require('graphql-tools')
const { ApolloServer } = require('apollo-server-express')
const User = require('./User')
const Timer = require('./Timer')
const resolvers = require('../Resolvers')

const rootQuery =`
  type Query {
    currentUser : User
  }

  type Mutation {
    signup (user: newUser) : User
    login (username: String!, password: String!) : User
    timerPlay (uid: String!) : Timer
    timerPause (uid: String!) : Timer
    timerChangeType (uid: String!, type: String!) : Timer
    timerReset (uid: String!) : Timer
    timerGet (uid: String!) : Timer
  }

  type Subscription {
    timerStatusChanged : Timer
    timerCounterUpdated : Timer
  }
`

const schema = makeExecutableSchema({
  typeDefs: [rootQuery, User, Timer],
  resolvers
})

module.exports = schema
