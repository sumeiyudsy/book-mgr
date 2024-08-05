const Router = require('@koa/router')
const mongoose = require('mongoose')
const { getBody } = require('../../helpers/utils')
const jwt = require('jsonwebtoken')
const config = require('../../project.config')

const User = mongoose.model('User')
const InviteCode = mongoose.model('InviteCode')

const router = new Router({
  prefix: '/auth',
})

router.post('/register', async (ctx) => {
  const { account, password, inviteCode } = getBody(ctx)

  if (account === '' || password === '' || inviteCode === '') {
    ctx.body = {
      code: 0,
      msg: '字段不能为空',
      data: null
    }
    return
  }

  const findCode = await InviteCode.findOne({
    code: inviteCode,
  }).exec()

  if ((!findCode) || findCode.user) {
    ctx.body = {
      code: 0,
      msg: '邀请码不正确',
      data: null
    }
    return
  }
  
  const findUser = await User.findOne({
    account
  }).exec()

  if (findUser) {
    ctx.body = {
      code: 0,
      msg: '已存在该用户',
      data: null
    }
    return
  }

  const user = new User({
    account,
    password,
  })

  const res = await user.save()
  
  findCode.user = res._id
  findCode.meta.updatedAt = new Date().getTime()

  await findCode.save()

  ctx.body = {
    code: 1,
    msg: '注册成功',
    data: res
  }
})

router.post('/login', async (ctx) => {
  const { account, password } = getBody(ctx)

  if (account === '' || password === '') {
    ctx.body = {
      code: 0,
      msg: '字段不能为空',
      data: null
    }
    return
  }

  const findUser = await User.findOne({
    account
  }).exec()

  if (!findUser) {
    ctx.body = {
      code: 0,
      msg: '用户名或密码错误',
      data: null
    }
    return
  }

  const user = {
    account: findUser.account,
    character: findUser.character,
    _id: findUser._id
  }
  if (findUser.password === password) {
    ctx.body = {
      code: 1,
      msg: '登录成功',
      data: {
        user,
        token: jwt.sign(user, config.JWT_SECRET)
      }
    }
    return
  }

  ctx.body = {
    code: 0,
    msg: '用户名或密码错误',
    data: null
  }
})

module.exports = router