const Router = require('@koa/router')
const mongoose = require('mongoose')
const config = require('../../project.config')

const UserView = mongoose.model('UserView')

const router = new Router({
  prefix: '/userView',
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
    query.uName = keyword
  }

  const list = await UserView
    .find(query)
    .sort({
      _id: -1
    })
    .skip((page - 1) * size)
    .limit(size)
    .exec()

  const total = await UserView.countDocuments().exec()

  ctx.body = {
    code: 1,
    data: {
      list,
      total
    },
    msg: '获取列表成功'
  }
    
})

router.post('/add', async (ctx) => {
  const {
    uName,
    view
  } = ctx.request.body
  let { time } = ctx.request.body
  time = Number(time)

  const userView = new UserView({
    view,
    time,
    uName
  })

  const res = await userView.save()

  ctx.body = {
    data: res,
    code: 1,
    msg: '添加成功'
  }
})

module.exports = router
