'use strict'
const User = require('../../db/Models/User')
const bcrypt = require('bcrypt')
const config = require('../../../config')
const { JWT_SECRET } = config
const jwt = require('jsonwebtoken')


module.exports = function utilities () {


  function _handleError (error) {
    throw new Error(error)
  }

  async function signup (user) {
    try {
      const { username, email, password } = user
      const existingUser = await User.findOne({ username })
      const existingEmail = await User.findOne({ email })

      if (existingUser) return _handleError('This username already exist')

      if (existingEmail) return _handleError('This email is already taken')

      const hash = await bcrypt.hash(password, 10)

      const userToCreate = new User({ username, email, password: hash })

      const userCreated = await userToCreate.save()

      userCreated.jwt = jwt.sign({ _id: userCreated._id }, JWT_SECRET)
      return userCreated
    } catch (e) {
        _handleError(`There was an error../ creating user: ==> ${e}`)
    }
  }

  async function login (username, password) {
    try {
      const user = await User.findOne({ username })
      if (!user) _handleError('username not found')

      const validPassword = await bcrypt.compare(password, user.password)
      if (!validPassword) _handleError('Passowrd incorrect')

      user.jwt = jwt.sign({ _id: user._id }, JWT_SECRET)

      return user
    } catch (e) {
        _handleError(`There was an error getting user: ==> ${e}`)
    }
  }

  async function context (headers) {
    const user = await getUser(headers.req.headers.authorization)
    return {
      headers,
      user
    }
  }

  async function getUser (authorization) {
    const bearerLength = "Bearer ".length

    if (authorization && authorization.length > bearerLength) {
      const token = authorization.slice(bearerLength)

      const { ok, result } = await new Promise(resolve =>
        jwt.verify(token, JWT_SECRET, (err, result) => {
          if (err) resolve({ ok: false, result: err })
          resolve({ ok: true, result })
        })
      )

      if (ok) {
        const user = await User.findOne({ _id: result._id })
        return user
      } else {
        console.error(result)
        return null
      }
    }

    return null
  }


  return {
    signup,
    login,
    context
  }
}
