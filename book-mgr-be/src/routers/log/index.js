const Router = require('@koa/router')
const mongoose = require('mongoose')

const Log = mongoose.model('Log')

const router = new Router({
  prefix: '/log'
})

router.get('/list', async (ctx) => {
  let {
    page,
    size
  } = ctx.query

  page = Number(page)
  size = Number(size)
  
  const list = await Log
    .find({
      show: true
    })
    .sort({
      _id: -1
    })
    .skip((page - 1) * size)
    .limit(size)
    .exec()

  const total = await Log.find({
    show: true
  }).countDocuments().exec()

  ctx.body = {
    code: 1,
    msg: '获取列表成功',
    data: {
      list,
      total
    }
  }
})

router.post('/delete', async (ctx) => {
  const { id } = ctx.request.body

  const one = await Log.findOne({ _id: id }).exec()

  if (!one) {
    ctx.body = {
      code: 0,
      msg: '删除成功',
      date: {}
    }
    return
  }

  one.show = false

  await one.save()

  ctx.body = {
    code: 1,
    msg: '删除成功'
  }
})

module.exports = router
