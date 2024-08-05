const TOKEN_STORAGE_KEY = 'tt'

export const getToken = () => {
  return localStorage.getItem(TOKEN_STORAGE_KEY) || ''
}

export const setToken = (token) => {
  return localStorage.setItem(TOKEN_STORAGE_KEY, token)
}