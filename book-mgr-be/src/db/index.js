const mongoose = require('mongoose')

// Schema 映射了M哦能够DB下的一个集合，并且他的内容就是集合下文档的构成
// Modal 可以理解成是根据Schema生成的一套方法，这套方法用来操作MongoDB下的集合和集合下的文档
const UserSchema = new mongoose.Schema({
  nickname: String,
  password: String,
  age: Number
})

const UserModal = mongoose.model('User', UserSchema)

const connect = () => {
  // 连接数据库
  mongoose.connect('mongodb://127.0.0.1:27017/book-mgr')

  mongoose.connection.on('open', () => {
    console.log('连接成功')

    const user = new UserModal({
      nickname: 'xiaohong',
      password: '235',
      age: 12
    })
    user.save()
  })
}

connect()