import router from './router'
import store from '@/store'
import { user } from '@/service'
import getPageTitle from './utils/get-page-tilte'

router.beforeEach(async (to, from, next) => {
  document.title = getPageTitle(to.meta.title)

  let res = {}

  try {
    res = await user.info()
  } catch (e) {
    if (e.message.includes('code 401')) {
      res.code = 401
    }
  }

  if (res.code === 401) {
    if (to.path === '/auth') {
      next()
      return
    }

    message.error('认证失败，请重新登录')
    next('/auth')

    return
  }

  // const reqArr = []
  if (!store.state.characterInfo.length) {
    await store.dispatch('getCharacterInfo')
  }
  if (!store.state.userInfo.length) {
    await store.dispatch('getUserInfo')
  }
  if (!store.state.bookClassify.length) {
    await store.dispatch('getBookClassify')
  }

  if (to.path === '/auth') {
    next('/books')

    return
  }
  next()
})