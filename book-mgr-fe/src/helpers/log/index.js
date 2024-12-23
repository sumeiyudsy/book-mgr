const LOG_MAP = [
  ['/character/list', '获取角色列表'],
  ['/log/list', '获取日志列表'],
  ['/user/info', '获取自己的登录信息'],
  ['/user/list', '获取用户列表'],
  ['/book/list', '获取图书列表'],
]

export const getLogInfoByPath = (path) => {
  let title = ''

  LOG_MAP.forEach(item => {
    if (path.includes(item[0])) {
      title = path.replace(item[0], item[1])
    }
  })

  return title || path
}