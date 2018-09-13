'use strcit'

const Mongoose = require('mongoose')
const Schema = Mongoose.Schema


const Timer = new Schema({
  uid: {type: String, required: true},
  minutes: {type: Number, required: true},
  seconds: {type: Number, required: true},
  active: {type: Boolean, required: true},
  duration: {type: Number, required: true},
  type: {type: String, required: true},
})


module.exports = Mongoose.model('Timer', Timer)
