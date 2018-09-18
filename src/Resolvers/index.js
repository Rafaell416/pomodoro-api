'use strict'


const utilities = require('./utilities')()
const pubsub = require('./utilities/pubsub')()

const TIMER_STATUS_CHANGED = 'TIMER_STATUS_CHANGED'
const TIMER_COUNTER_UPDATED = 'TIMER_COUNTER_UPDATED'

const resolvers = {
  Subscription: {
    timerStatusChanged: {
      subscribe: () => pubsub.asyncIterator(TIMER_STATUS_CHANGED)
    },
    timerCounterUpdated: {
      subscribe: () => pubsub.asyncIterator(TIMER_COUNTER_UPDATED)
    }
  },
  Query: {
    currentUser: (_, args, context) => context.user
  },
  Mutation: {
    login: (_, args) => utilities.login(args.username, args.password),
    signup: (_, args) => utilities.signup(args.user),
    timerPlay: async (_, args) => {
      const timerUpdated = await utilities.playTimer(args.uid)
      pubsub.publish(TIMER_STATUS_CHANGED, { timerStatusChanged: timerUpdated})
      utilities.handleStartCounter(timerUpdated.uid)
      return timerUpdated
    },
    timerPause: async (_, args) => {
      const timerUpdated = await utilities.pauseTimer(args.uid)
      pubsub.publish(TIMER_STATUS_CHANGED, { timerStatusChanged: timerUpdated})
      utilities.handleStartCounter(timerUpdated.uid)
      return timerUpdated
    },
    timerChangeType: (_, args) => utilities.changeTimerType(args.uid, args.type),
    timerReset: async (_, args) => {
      const timerReseted = await utilities.resetTimer(args.uid)
      utilities.handleStartCounter(timerReseted.uid)
      pubsub.publish(TIMER_STATUS_CHANGED, { timerStatusChanged: timerReseted })
      pubsub.publish(TIMER_COUNTER_UPDATED, { timerCounterUpdated: timerReseted })
      return timerReseted
    },
    timerGet: (_, args) => utilities.getTimerByUid(args.uid),
  }
}

module.exports = resolvers
