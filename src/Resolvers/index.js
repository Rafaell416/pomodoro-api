'use strict'

const utilities = require('./utilities')()

const resolvers = {
  Query: {
    user: (_, args, context) => context.user
  },
  Mutation: {
    login: (_, args, context) => utilities.login(args.username, args.password),
    signup: (_, args) => utilities.signup(args.user),
    timerCreate: (_, args) => utilities.createTimer(args.timer),
    timerPlay: (_, args) => utilities.playTimer(args.uid),
    timerPause: (_, args) => utilities.pauseTimer(args.uid),
    timerChangeType: (_, args) => utilities.changeTimerType(args.uid, args.type),
    timerReset: (_, args) => utilities.resetTimer(args.uid)
  }
}

module.exports = resolvers
