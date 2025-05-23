const Router = require('@koa/router')
const mongoose = require('mongoose')
const config = require('../../project.config')
const { verify, getToken } = require('../../helpers/token')
const { loadExcel, getFirstSheet } = require('../../helpers/excel')

const User = mongoose.model('User')
const Character = mongoose.model('Character')

const router = new Router({
  prefix: '/user',
})

router.get('/list', async (ctx) => {
  let {
    page,
    size,
    keyword
  } = ctx.query

  page = Number(page)
  size = Number(size)

  const query = {}

  if (keyword) {
    query.account = keyword
  }

  const list = await User
    .find(query)
    .sort({
      _id: -1
    })
    .skip((page - 1) * size)
    .limit(size)
    .exec()
  
  const total = await User.countDocuments().exec()

  ctx.body = {
    code: 1,
    data: {
      list,
      total
    },
    msg: '获取列表成功'
  }
    
})

router.delete('/:id', async (ctx) => {
  const {
    id
  } = ctx.params

  const delMsg = await User.deleteOne({
    _id: id
  })

  ctx.body = {
    data: delMsg,
    code: 1,
    msg: '删除成功'
  }
})

router.post('/add', async (ctx) => {
  const {
    account,
    password,
    character
  } = ctx.request.body

  const char = await Character.findOne({
    _id: character
  })

  if (!char) {
    ctx.body = {
      code: 0,
      msg: '出错啦'
    }

    return
  }

  const user = new User({
    account,
    password: password || config.DEFAULT_PASSWORD,
    character
  })

  const res = await user.save()

  ctx.body = {
    data: res,
    code: 1,
    msg: '添加成功'
  }
})

router.post('/reset/password', async (ctx) => {
  const { id } = ctx.request.body

  const user = await User.findOne({
    _id: id
  }).exec()

  if (!user) {
    ctx.body = {
      msg: '找不到用户',
      code: 0
    }

    return
  }

  user.password = config.DEFAULT_PASSWORD

  const res = await user.save()

  ctx.body = {
    code: 1,
    data: {
      account: res.account,
      _id: res._id
    },
    msg: '修改成功'
  }
})

router.post('/update/character', async (ctx) => {
  const { characterId, userId } = ctx.request.body

  const char = await Character.findOne({
    _id: characterId
  })

  if (!char) {
    ctx.body = {
      code: 0,
      msg: '出错啦'
    }

    return
  }

  const user = await User.findOne({
    _id: userId
  })

  if (!user) {
    ctx.body = {
      code: 0,
      msg: '出错啦'
    }

    return
  }

  user.character = characterId

  const res = await user.save()

  ctx.body = {
    code: 1,
    data: res,
    msg: '修改成功'
  }
})

router.get('/info', async (ctx) => {
  ctx.body = {
    data: await verify(getToken(ctx)),
    code: 1,
    msg: '获取成功'
  }
})

router.post('/addMany', async (ctx) => {
  const { fileKey = '' } = ctx.request.body

  const path = `${config.UPLOAD_DIR}/${fileKey}`

  const excel = loadExcel(path)

  const sheet = getFirstSheet(excel)


  const character = await Character.find().exec()

  const member = character.find((item) => (item.name === 'member'))

  const arr = []
  sheet.forEach(record => {
    const [account, password = config.DEFAULT_PASSWORD] = record

    arr.push({
      account,
      password,
      character: member._id
    })
  })

  await User.insertMany(arr)

  ctx.body = {
    code: 1,
    msg: '添加成功',
    data: arr.length
  }
})

module.exports = router
