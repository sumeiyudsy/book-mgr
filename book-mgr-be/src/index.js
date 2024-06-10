const koa = require('koa')
const { connect } = require('./db')
const body = require('koa-body')
const registerRoutes = require('./routers')
const cors = require('@koa/cors')

const app = new koa()

connect().then(() => {
  app.use(cors())
  app.use(body.koaBody())

  registerRoutes(app)

  // 通过 app.use 注册中间件
  // 中间件本质上是一个函数，每次请求都会被执行
  // context 上下文 - 当前请求的所有信息都在里面
  
  app.listen(3000, () => {
    // 监听端口
    console.log('启动成功')
  })
})
