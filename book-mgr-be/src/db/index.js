require('./Schemas/User')
require('./Schemas/InviteCode')
require('./Schemas/Book')
require('./Schemas/InventoryLog')
require('./Schemas/Character')
require('./Schemas/Log')
require('./Schemas/LogResponse')

const mongoose = require('mongoose')

// Schema 映射了M哦能够DB下的一个集合，并且他的内容就是集合下文档的构成
// Modal 可以理解成是根据Schema生成的一套方法，这套方法用来操作MongoDB下的集合和集合下的文档

const connect = () => {
  return new Promise((resolve) => {
    // 连接数据库
    mongoose.connect('mongodb://127.0.0.1:27017/book-mgr')

    mongoose.connection.on('open', () => {
      console.log('连接数据库成功')
      resolve()
    })
  })
}

module.exports = {
  connect
}