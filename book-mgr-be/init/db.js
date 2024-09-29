const mongoose = require('mongoose')
const { connect } = require('../src/db/index')
const character = require('../src/helpers/character')

const { defaultCharacters } = character

const Character = mongoose.model('Character')
const User = mongoose.model('User')

connect()
  .then(async () => {
    console.log('开始初始化角色集合', )

    const characherList = await Character.insertMany(defaultCharacters)

    const user = new User({
      account: 'admin',
      password: 'admin',
      character: characherList.find(item => (item.name === 'member'))._id
    })

    console.log('正在初始化', )

    await user.save()

    console.log('角色集合初始化成功', )
  })