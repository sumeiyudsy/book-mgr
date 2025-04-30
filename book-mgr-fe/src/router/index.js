import { createRouter, createWebHashHistory } from 'vue-router';
import layout from '../layout/BasicLayout'

const privateRoutes = [
  
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: layout,
    redirect: '/dashboard/index',
    children: [
      {
        path: '/dashboard/index',
        meta: {
          menu: true,
          title: '总览'
        },
        component: () => import(/* webpackChunkName: "Dashboard" */ '../views/Dashboard/index.vue')
      }
    ]
  },
  {
    path: '/books',
    name: 'Books',
    component: layout,
    redirect: '/books/list',
    children: [
      {
        path: '/books/list',
        meta: {
          menu: true,
          title: '书籍管理'
        },
        component: () => import(/* webpackChunkName: "Books" */ '../views/Books/index.vue'),
      },
      {
        path: '/books/:id',
        meta: {
          title: '书籍详情'
        },
        component: () => import(/* webpackChunkName: "BookDetail" */ '../views/BookDetail/index.vue')
      }
    ]
  },
  {
    path: '/user',
    name: 'User',
    component: layout,
    redirect: '/user/list',
    children: [
      {
        path: '/user/list',
        meta: {
          menu: true,
          title: '用户列表'
        },
        component: () => import(/* webpackChunkName: "User" */ '../views/Users/index.vue')
      }
    ]
  },
  {
    path: '/userview',
    name: 'UserView',
    component: layout,
    redirect: '/userview/index',
    children: [
      {
        path: '/userview/index',
        meta: {
          menu: true,
          title: '意见建议'
        },
        component: () => import(/* webpackChunkName: "User" */ '../views/UserView/index.vue')
      }
    ]
  },
  {
    path: '/log',
    name: 'Log',
    component: layout,
    redirect: '/log/index',
    children: [
      {
        path: '/log/index',
        meta: {
          menu: true,
          title: '操作日志'
        },
        component: () => import(/* webpackChunkName: "Log" */ '../views/Log/index.vue')
      }
    ]
  },
  {
    path: '/reset',
    name: 'Reset',
    component: layout,
    redirect: '/reset/password',
    meta: {
      menu: true,
      title: '杂项'
    },
    children: [
      {
        path: '/reset/password',
        meta: {
          menu: true,
          title: '重置密码'
        },
        component: () => import(/* webpackChunkName: "ResetPassword" */ '../views/ResetPassword/index.vue')
      },
      {
        path: '/reset/invite-code',
        meta: {
          menu: true,
          title: '邀请码'
        },
        component: () => import(/* webpackChunkName: "InviteCode" */ '../views/InviteCode/index.vue')
      },
      {
        path: '/reset/book-classify',
        meta: {
          menu: true,
          title: '图书分类管理'
        },
        component: () => import(/* webpackChunkName: "BookClassify" */ '../views/BookClassify/index.vue')
      }
    ]
  }
];

// 公开路由表
const publicRoutes = [
  {
    path: '/auth',
    name: 'Auth',
    component: () => import(/* webpackChunkName: "auth" */ '../views/Auth/index.vue')
  },
  {
    path: '/',
    component: layout,
    redirect: '/profile',
    children: [
      {
        path: '/profile',
        meta: {
          menu: true,
          title: '个人设置'
        },
        component: () => import(/* webpackChunkName: "Profile" */ '../views/Profile/index.vue')
      },
      {
        path: '/404',
        name: '404',
        component: () =>
          import(/* webpackChunkName: "error-page" */ '@/views/error-page/404')
      },
      {
        path: '/401',
        name: '401',
        component: () =>
          import(/* webpackChunkName: "error-page" */ '@/views/error-page/401')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: [...publicRoutes, ...privateRoutes],
});

export default router;
