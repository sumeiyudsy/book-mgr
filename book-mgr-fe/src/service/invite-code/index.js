import { post, get, del } from '@/helpers/request'

export const list = (page, size) => {
  return get('/invite/list', {
    page,
    size
  })
}

export const add = (count) => {
  return post(`/invite/add`, {
    count
  })
}

export const remove = (id) => {
  return del(`/invite/${id}`)
}