'use strict'

const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const schema = require('./src/Schema')
const app = express()
const PORT = process.env.PORT || 3000
const config = require('./config')
const DB_URL = process.env.DB_URL || config.DB_URL
const db = require('./src/db')(DB_URL)
const utilities = require('./src/Resolvers/utilities')()
const context = utilities.context

const server = new ApolloServer({
  schema,
  context,
  formatError: error => {
    console.log(error)
    return new Error('Internal server error')
  },
})

server.applyMiddleware({ app })

app.listen({ port: PORT }, () =>
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
)
