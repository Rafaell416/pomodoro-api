'use strict'

const { PubSub } = require('apollo-server-express')

const utilities = require('./utilities')()

const pubsub = new PubSub()
const TIMER_STATUS_CHANGED = 'TIMER_STATUS_CHANGED'

const resolvers = {
  Subscription: {
    timerStatusChanged: {
      subscribe: () => pubsub.asyncIterator(TIMER_STATUS_CHANGED)
    }
  },
  Query: {
    currentUser: (_, args, context) => context.user
  },
  Mutation: {
    login: (_, args) => utilities.login(args.username, args.password),
    signup: (_, args) => utilities.signup(args.user),
    timerPlay: (_, args) => {
      pubsub.publish(TIMER_STATUS_CHANGED, { timerStatusChanged: args})
      return utilities.playTimer(args.uid)
    },
    timerPause: (_, args) => {
      pubsub.publish(TIMER_STATUS_CHANGED, { timerStatusChanged: args })
      return utilities.pauseTimer(args.uid)
    },
    timerChangeType: (_, args) => utilities.changeTimerType(args.uid, args.type),
    timerReset: (_, args) => utilities.resetTimer(args.uid),
    timerGet: (_, args) => utilities.getTimerByUid(args.uid),
    timerUpdateCounter: (_, args) => utilities.updateCounter(args.uid, args.minutes, args.seconds)
  }
}

module.exports = resolvers
