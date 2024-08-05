import axios from 'axios'

export const list = (keyword = '', page = 1, size = 20) => {
  return axios.get('http://localhost:3000/user/list', {
    params: {
      keyword,
      page,
      size
    }
  })
}

export const remove = (id) => {
  return axios.delete(`http://localhost:3000/user/${id}`)
}

export const add = (account, password, character) => {
  return axios.post('http://localhost:3000/user/add', {
    account,
    password,
    character
  })
}

export const resetPassword = (id) => {
  return axios.post('http://localhost:3000/user/reset/password', {
    id
  })
}

export const editCharacter = (characterId, userId) => {
  return axios.post('http://localhost:3000/user/update/character', {
    characterId,
    userId
  })
}

export const info = () => {
  return axios.get('http://localhost:3000/user/info')
}
