const mongoose = require('mongoose')
const { getMeta, preSave } = require('../helpers')

const UserViewSchema = new mongoose.Schema({
  // 用户名
  uName: String,
  // 意见
  view: String,
  // 日期
  time: Number,

  meta: getMeta()
})

UserViewSchema.pre('save', preSave)

mongoose.model('UserView', UserViewSchema)