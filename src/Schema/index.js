const { makeExecutableSchema } = require('graphql-tools')
const { ApolloServer } = require('apollo-server-express')

const User = require('./User')
const Timer = require('./Timer')

const rootQuery =`
  type Query {
    user (username: String!) : User
    timer (uid: String!) : Timer
  }
`

const schema = makeExecutableSchema({
  typeDefs: [rootQuery, User, Timer]
})

module.exports = schema
