const Router = require('@koa/router')
const mongoose = require('mongoose')

const Character = mongoose.model('Character')

const router = new Router({
  prefix: '/character',
})

router.get('/list', async (ctx) => {
  const list = await Character.find().exec()

  ctx.body = {
    data: list,
    code: 1,
    msg: '获取列表成功'
  }
    
})

module.exports = router
