'use strict'
const User = require('../../db/Models/User')
const bcrypt = require('bcrypt')

module.exports = function utilities () {


  function _handleError (error) {
    throw new Error(error)
  }

  async function signup (user) {
    try {
      const { username, email, password } = user
      const existingUser = await User.findOne({ username })
      const existingEmail = await User.findOne({ email })

      if (existingUser) return _handleError('This username already exist', 'error')

      if (existingEmail) return _handleError('This email is already taken', 'error')

      const hash = await bcrypt.hash(password, 10)

      const userToCreate = new User({ username, email, password: hash })

      const userCreated = await userToCreate.save()
      return userCreated
    } catch (e) {
        _handleError(`There was an error creating user: ==> ${e}`)
    }
  }


  return {
    signup
  }
}
