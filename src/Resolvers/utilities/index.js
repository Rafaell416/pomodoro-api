'use strict'
const User = require('../../db/Models/User')
const Timer = require('../../db/Models/Timer')
const bcrypt = require('bcrypt')
const config = require('../../../config')
const JWT_SECRET = process.env.JWT_SECRET || config.JWT_SECRET
const jwt = require('jsonwebtoken')

const pubsub = require('./pubsub')()
const TIMER_COUNTER_UPDATED = 'TIMER_COUNTER_UPDATED'

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

      await createTimer({ uid: userCreated._id, minutes:0, seconds:0, active:false, duration:25, lastDuration: 0, type: 'work' })

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

  async function context ({req, connection}) {
    if (connection) {
       return {}
     } else {
       const token = req.headers.authorization || ""
       const user = await getUser(token)
       return { token, user }
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
    try {
      const timer = await Timer.findOne({ uid })
      return timer
    } catch (e) {
        _handleError(`There was an error gettin timer by uid: ==> ${e} `)
    }
  }

  async function getUserByUid (uid) {
    try {
      const user = await User.findOne({ _id: uid })
      return user
    } catch (e) {
        _handleError(`There was an error getting user by uid: ==> ${e} `)
    }
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

  function getTypeData (type) {
    switch (type) {
      case 'work':
        return {
          type: 'work',
          active: true,
          minutes: 0,
          seconds: 0,
          duration: 25,
          lastDuration: 0
        }
        break;
      case 'short_break':
        return {
          type: 'short_break',
          active: true,
          minutes: 0,
          seconds: 0,
          duration: 5,
          lastDuration: 0
        }
      case 'long_break':
        return {
          type: 'long_break',
          active: true,
          minutes: 0,
          seconds: 0,
          duration: 15,
          lastDuration: 0
        }
      default:
        return type
    }
  }

  async function changeTimerType (uid, type) {
    try {
      const data = getTypeData(type)
      const { duration, minutes, seconds, active, lastDuration } = data
      await Timer.findOneAndUpdate({ uid }, { type, duration, minutes, seconds, active, lastDuration }, {upsert: true})
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
        type: "work",
        lastDuration:0
      }, {upsert: true})
      const timerUpdated = await getTimerByUid(uid)
      return timerUpdated
    } catch (e) {
      _handleError(`There was an error reseting timer: ==> ${e}`)
    }
  }

  async function updateCounter (uid, minutes, seconds, lastDuration) {
    try {
      await Timer.findOneAndUpdate({ uid }, {
        minutes,
        seconds,
        lastDuration
      }, { upsert: true })
      const counterUpdated = await getTimerByUid(uid)
      return counterUpdated
    } catch (e) {
      _handleError(`There was an error updating counter: ==> ${e}`)
    }
  }


  let interval

  function startCountDown (timer) {
    const { duration } = timer
    const durationInSeconds = duration * 60

    calculateTime(durationInSeconds, timer)
  }

  function stopCountDown () {
    clearInterval(interval)
  }

  async function calculateTime (duration, counter) {
    try {
      const lastDuration = counter.lastDuration
      let timer = lastDuration > 0 ? lastDuration : duration
      let minutes
      let seconds
      interval = setInterval( async () => {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10)

        minutes = minutes < 10 ? "0" + minutes : minutes
        seconds = seconds < 10 ? "0" + seconds : seconds

        console.log(minutes, seconds)
        const lastDurationInSeconds = timer
        const counterUpdated = await updateCounter(counter.uid, minutes, seconds, lastDurationInSeconds)
        pubsub.publish(TIMER_COUNTER_UPDATED, { timerCounterUpdated: counterUpdated })

        if (--timer < 0) {
          timer = duration
        }
      }, 1000)
    } catch (e) {
      _handleError(`There was an error at calculateTime: ==> ${e}`)
    }
  }

  async function handleStartCounter (uid) {
    try {
      const Counter = await Timer.findOne({ uid })
      const timerStatus = Counter.active

      if (timerStatus) {
        startCountDown(Counter)
      } else {
        stopCountDown()
      }

    } catch (e) {
        _handleError(`There was an error hading start counter: ==> ${e}`)
    }
  }

  return {
    signup,
    login,
    context,
    playTimer,
    pauseTimer,
    changeTimerType,
    resetTimer,
    getTimerByUid,
    getUserByUid,
    handleStartCounter
  }
}
