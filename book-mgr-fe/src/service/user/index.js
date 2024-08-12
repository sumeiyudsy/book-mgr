import { post, get, del } from '@/helpers/request'

export const list = (keyword = '', page = 1, size = 20) => {
  return get('/user/list', {
    keyword,
    page,
    size
  })
}

export const remove = (id) => {
  return del(`/user/${id}`)
}

export const add = (account, password, character) => {
  return post('/user/add', {
    account,
    password,
    character
  })
}

export const resetPassword = (id) => {
  return post('/user/reset/password', {
    id
  })
}

export const editCharacter = (characterId, userId) => {
  return post('/user/update/character', {
    characterId,
    userId
  })
}

export const info = () => {
  return get('/user/info')
}

export const addMany = (fileKey) => {
  return post('/user/addMany', {
    fileKey
  })
}
