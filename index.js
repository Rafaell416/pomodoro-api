const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const schema = require('./src/Schema')
const app = express()
const PORT = process.env.PORT || 3000

const server = new ApolloServer({ schema })

server.applyMiddleware({ app })

app.listen({ port: PORT }, () =>
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
)
