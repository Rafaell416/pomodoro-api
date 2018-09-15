const User = `
  type User {
    _id: ID!
    username: String!
    email: String
    jwt: String
  }

  input newUser {
    username: String!
    email: String!
    password: String!
  }
`

module.exports = User
