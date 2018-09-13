'use strict'
const User = require('../../db/Models/User')
const Timer = require('../../db/Models/Timer')
const bcrypt = require('bcrypt')
const config = require('../../../config')
const JWT_SECRET = process.env.JWT_SECRET || config.JWT_SECRET
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

  async function createTimer (timer) {
    try {
      const { uid } = timer
      return await Timer.findOneAndUpdate({ uid }, timer, { upsert: true }) || timer;
    } catch (e) {
      _handleError(`There was an error creating the timer: ==> ${e}`)
    }
  }

  async function getTimerByUid (uid) {
    const timer = await Timer.findOne({ uid })
    return timer
  }

  async function playTimer (uid) {
    try {
      await Timer.findOneAndUpdate({ uid }, {active: true}, {upsert: true})
      const timerUpdated = await getTimerByUid(uid)
      return timerUpdated
    } catch (e) {
      _handleError(`There was an error updating active the timer: ==> ${e}`)
    }
  }

  async function pauseTimer (uid) {
    try {
      await Timer.findOneAndUpdate({ uid }, {active: false}, {upsert: true})
      const timerUpdated = await getTimerByUid(uid)
      return timerUpdated
    } catch (e) {
      _handleError(`There was an error updating inactive the timer: ==> ${e}`)
    }
  }

  async function changeTimerType (uid, type) {
    try {
      await Timer.findOneAndUpdate({ uid }, { type }, {upsert: true})
      const timerUpdated = await getTimerByUid(uid)
      return timerUpdated
    } catch (e) {
        _handleError(`There was an error changing timer type: ==> ${e}`)
    }
  }

  async function resetTimer (uid) {
    try {
      await Timer.findOneAndUpdate({ uid }, {
        minutes: 0,
        seconds: 0,
        active: false,
        duration: 25,
        type: "work"
      }, {upsert: true})
      const timerUpdated = await getTimerByUid(uid)
      return timerUpdated
    } catch (e) {
      _handleError(`There was an error reseting timer: ==> ${e}`)
    }
  }

  return {
    signup,
    login,
    context,
    createTimer,
    playTimer,
    pauseTimer,
    changeTimerType,
    resetTimer,
  }
}
