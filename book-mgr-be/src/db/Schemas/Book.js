const mongoose = require('mongoose')
const { getMeta, preSave } = require('../helpers')

const BookSchema = new mongoose.Schema({
  // 书名
  name: String,
  // 价格
  price: Number,
  // 作者
  author: String,
  // 日期
  publishDate: String,
  // 分类
  classify: String,
  // 库存
  count: Number,
  // 图书编号
  bookNo: String,
  // 出版社
  publish: String,

  meta: getMeta()
})

BookSchema.pre('save', preSave)

mongoose.model('Book', BookSchema)