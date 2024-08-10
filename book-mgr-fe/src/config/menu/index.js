export default [
  {
    title: '书籍管理',
    url: '/books',
    onlyAdmin: false
  },
  {
    title: '用户管理',
    url: '/user',
    onlyAdmin: true
  },
  {
    title: '操作日志',
    url: '/log',
    onlyAdmin: true
  },
  {
    title: '杂项',
    onlyAdmin: false,
    children: [
      {
        title: '重置密码列表',
        url: '/reset/password',
        onlyAdmin: true,
      },
      {
        title: '邀请码',
        url: '/reset/invite-code',
        onlyAdmin: true,
      },
      {
        title: '图书分类管理',
        url: '/reset/book-classify',
        onlyAdmin: true,
      }
    ]
  }
]