'use strict'

const utilities = require('./utilities')()

const resolvers = {
  Query: {
    user: (_, args, context) => context.user
  },
  Mutation: {
    login: (_, args) => utilities.login(args.username, args.password),
    signup: (_, args) => utilities.signup(args.user),
    timerPlay: (_, args) => utilities.playTimer(args.uid),
    timerPause: (_, args) => utilities.pauseTimer(args.uid),
    timerChangeType: (_, args) => utilities.changeTimerType(args.uid, args.type),
    timerReset: (_, args) => utilities.resetTimer(args.uid),
    timerGet: (_, args) => utilities.getTimerByUid(args.uid)
  }
}

module.exports = resolvers
