import axios from 'axios'
import { getToken, removeToken } from '../token'
import { message } from 'ant-design-vue'

const domain = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:80'

export const getHeaders = () => {
    return {
        Authorization: `Bearer ${getToken()}`
    }
}

const service = axios.create({
    baseURL: domain,
    timeout: 5000
})
  
// 请求拦截器
service.interceptors.request.use(
    (config) => {
        // 在这个位置需要统一的去注入token
        const token = getToken()
        if (token) {
            // 如果token存在 注入token
            config.headers.Authorization = `Bearer ${token}`
        }
        return config // 必须返回配置
    },
    (error) => {
        return Promise.reject(error)
    }
)
  
// 响应拦截器
service.interceptors.response.use(
    (response) => {
        const { status, data } = response
        //   要根据success的成功与否决定下面的操作
        if (status === 200) {
          return response
        } else {
          // 业务错误
          const { message } = data.data
          return Promise.reject(new Error(message))
        }
      },
    (error) => {
        // 处理 token 超时问题
        if (
            error.response &&
            error.response.status === 401
        ) {
            // token超时
            removeToken()
            message.error('认证失败，请重新登录')
            window.location.href = '/auth'
        }
        return Promise.reject(error)
    }
)

export const post = (url, data = {}) => {
    return service({
        url,
        method: 'POST',
        data
    })
}

export const del = (url) => {
    return service({
        url,
        method: 'DELETE'
    })
}

export const get = (url, data = {}) => {
    return service({
        url,
        params: data
    })
}
