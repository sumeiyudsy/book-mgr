const koa = require('koa')
const koaStatic = require('koa-static')
const { connect } = require('./db')
const body = require('koa-body')
const registerRoutes = require('./routers')
const { middleware: koaJwtMiddleware, catchTokenError, checkUser } = require('./helpers/token') 
const { logMiddleWare } = require('./helpers/log') 
const cors = require('@koa/cors')
const path = require('path')
const config = require('./project.config')

const app = new koa()

app.use(koaStatic(path.resolve(__dirname, '../public')))

connect().then(() => {
  app.use(cors())
  app.use(body.koaBody({
    multipart: true,
    formidable: {
      maxFileSize: 200 * 1024 *1024
    }
  }))
  app.use(catchTokenError)
  
  koaJwtMiddleware(app)

  app.use(checkUser)
  
  app.use(logMiddleWare)

  registerRoutes(app)

  // 通过 app.use 注册中间件
  // 中间件本质上是一个函数，每次请求都会被执行
  // context 上下文 - 当前请求的所有信息都在里面
  
  app.listen(config.SERVER_PORT, () => {
    // 监听端口
    console.log('启动成功')
  })
})
