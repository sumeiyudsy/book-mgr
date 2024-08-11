import { createRouter, createWebHashHistory } from 'vue-router';
import store from '@/store'

const routes = [
  {
    path: '/auth',
    name: 'Auth',
    component: () => import(/* webpackChunkName: "auth" */ '../views/Auth/index.vue')
  },
  {
    path: '/',
    name: 'layout',
    component: () => import(/* webpackChunkName: "BasicLayout" */ '../layout/BasicLayout/index.vue'),
    children: [
      {
        path: '/books',
        name: 'Books',
        component: () => import(/* webpackChunkName: "Books" */ '../views/Books/index.vue')
      },
      {
        path: '/books/:id',
        name: 'BookDetail',
        component: () => import(/* webpackChunkName: "BookDetail" */ '../views/BookDetail/index.vue')
      },
      {
        path: '/user',
        name: 'User',
        component: () => import(/* webpackChunkName: "User" */ '../views/Users/index.vue')
      },
      {
        path: '/log',
        name: 'Log',
        component: () => import(/* webpackChunkName: "Log" */ '../views/Log/index.vue')
      },
      {
        path: '/reset/password',
        name: 'ResetPassword',
        component: () => import(/* webpackChunkName: "ResetPassword" */ '../views/ResetPassword/index.vue')
      },
      {
        path: '/reset/invite-code',
        name: 'InviteCode',
        component: () => import(/* webpackChunkName: "InviteCode" */ '../views/InviteCode/index.vue')
      },
      {
        path: '/reset/book-classify',
        name: 'BookClassify',
        component: () => import(/* webpackChunkName: "BookClassify" */ '../views/BookClassify/index.vue')
      },
      {
        path: '/profile',
        name: 'Profile',
        component: () => import(/* webpackChunkName: "Profile" */ '../views/Profile/index.vue')
      },
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import(/* webpackChunkName: "Dashboard" */ '../views/Dashboard/index.vue')
      },
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
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

  // await Promise.all(reqArr)
  
  next()
})

export default router;
