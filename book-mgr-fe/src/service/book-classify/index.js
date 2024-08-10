import axios from 'axios'
import { getToken } from '../../helpers/token'

axios.defaults.headers['Authorization'] = `Bearer ${getToken()}`

export const list = () => {
  return axios.get(
    'http://localhost:3000/book-classify/list'
  )
}

export const add = (title) => {
    return axios.post('http://localhost:3000/book-classify/add', { title })
  }
  
export const remove = (id) => {
  return axios.delete(
    `http://localhost:3000/book-classify/${id}`
  )
}

export const updateTitle = (id, title) => {
  return axios.post(
    `http://localhost:3000/book-classify/update/title`,
    {
        id,
        title
    }
  )
}
