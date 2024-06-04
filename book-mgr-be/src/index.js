const koa = require('koa')

const app = new koa()

// 通过 app.use 注册中间件
// 中间件本质上是一个函数，每次请求都会被执行
// context 上下文 - 当前请求的所有信息都在里面
app.use((context) => {})

app.listen(3000, () => {
  // 监听端口
  console.log('启动成功')
})