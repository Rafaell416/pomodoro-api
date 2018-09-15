const Timer = `
  type Timer {
    uid: ID!
    minutes: Float!
    seconds: Float!
    active: Boolean!
    duration: Float!
    type: String!
  }

  input newTimer {
    uid: ID!
    minutes: Float!
    seconds: Float!
    active: Boolean!
    duration: Float!
    type: String!
  }
`

module.exports = Timer
