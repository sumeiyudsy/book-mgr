import store from '@/store'

export const getBookClassify = (id) => {
  const { bookClassify } = store.state

  const one = bookClassify.find(item => {
    return item._id === id
  })
  
  return one && one.title || '未知分类'
}