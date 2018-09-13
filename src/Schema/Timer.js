const Timer = `
  type Timer {
    id: ID!
    minutes: Float!
    seconds: Float!
    active: Boolean!
    duration: Float!
    type: String!
  }
`

module.exports = Timer
