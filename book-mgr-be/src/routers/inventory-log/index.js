const Router = require('@koa/router')
const mongoose = require('mongoose')

const InventoryLog = mongoose.model('InventoryLog')

const router = new Router({
  prefix: '/inventory-log',
})

router.get('/list', async (ctx) => {
  const {
    type,
  } = ctx.query

  let {
    page,
    size
  } = ctx.query

  page = Number(page)
  size = Number(size)

  const list = await InventoryLog
    .find({
      type
    })
    .sort({
      _id: -1
    })
    .skip((page - 1) * size)
    .limit(size)
    .exec()
  
  const total = await InventoryLog.find({
    type
  }).countDocuments().exec()

  ctx.body = {
    code: 1,
    data: {
      list,
      total
    },
    msg: '获取列表成功'
  }
    
})

module.exports = router
