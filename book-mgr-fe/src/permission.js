import router from './router'
import store from '@/store'
import getPageTitle from './utils/get-page-tilte'
import { getToken } from './helpers/token'


router.beforeEach(async (to, from, next) => {
  document.title = getPageTitle(to.meta.title)

  const token = getToken()  
  if (token !== '') {
    if (to.path === '/auth') {
      next('/books')
    }
    next()
  } else {
    if (to.path !== '/auth') {
      next('/auth')
    }
    next()
    return
  }

  if (!store.state.characterInfo.length) {
    await store.dispatch('getCharacterInfo')
  }
  if (!store.state.userInfo.account) {
    await store.dispatch('getUserInfo')
  }
  if (!store.state.bookClassify.length) {
    await store.dispatch('getBookClassify')
  }
  next()
})