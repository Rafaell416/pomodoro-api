const User = `
  type User {
    id: ID!
    username: String!
    email: String!
  }

  input newUser {
    username: String!
    email: String!
  }
`

module.exports = User
