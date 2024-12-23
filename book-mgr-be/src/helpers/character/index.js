`
 -1 无任何权限
 0 管理员权限
 1 增加权限
 2 删除权限
 3 查找权限
 4 修改权限
`

const defaultCharacters = [
  {
    title: '管理员权限',
    name: 'admin',
    power: {
      book: [0],
      user: [0]
    }
  },
  {
    title: '借阅权限',
    name: 'member',
    power: {
      book: [1],
      user: [-1]
    }
  },
  {
    title: '工作人员权限',
    name: 'staff',
    power: {
      book: [0],
      user: [0]
    }
  }
]

module.exports = {
  defaultCharacters
}
