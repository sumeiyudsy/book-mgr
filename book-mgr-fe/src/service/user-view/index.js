import { post, get } from '@/helpers/request'

export const list = (keyword = '', page = 1, size = 20) => {
  return get('/userView/list', {
    keyword,
    page,
    size
  })
}

export const add = (uName, view, time) => {
  return post('/userView/add', {
    uName,
    view,
    time
  })
}