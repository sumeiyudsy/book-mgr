const { verify, getToken} = require('../token')
const mongoose = require('mongoose')

const Log = mongoose.model('Log')

const logMiddleWare = async (ctx, next) => {
  const startTime = Date.now()

  await next()

  let payload = {}

  try {
    payload = await(verify(getToken(ctx)))
  } catch (e) {
    payload = {
      account: '未知用户',
      id: ''
    }
  }

  const url = ctx.url
  const method = ctx.method
  const status = ctx.status
  let show = true

  if (url === '/log/delete') {
    show = false
  }

  let responseBody = ''

  if (typeof ctx.body === 'string') {
    const obj =  JSON.parse(ctx.body)
    responseBody = JSON.stringify({code: obj.code, msg: obj.msg})
  } else {
    try {
      responseBody = JSON.stringify({code: ctx.body.code, msg: ctx.body.msg})
    } catch(e) {
      responseBody = ''
    }
  }

  const endTime = Date.now()

  const log = new Log({
    user: {
      account: payload.account,
      id: payload.id
    },
    request: {
      url: url,
      responseBody,
      method,
      status
    },
    endTime,
    startTime,
    show
  })

  await log.save()

}

module.exports = {
  logMiddleWare
}