import request from '@/utils/request'
import axios from 'axios'
import {
  Message,
  MessageBox
} from 'element-ui'
import store from '@/store'
import {
  getToken
} from '@/utils/auth'
// create an axios for login
const timeout = 10000
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['Authorization'] = getToken()
    }
    return config
  },
  error => {
    // console.log(error)
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.status !== "success" && res.status) {
      Message({
        message: '用户名或密码错误！' || 'Error',
        type: 'error',
        duration: 2 * 1000
      })
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      Message({
        message: '登陆成功',
        type: 'success',
        duration: 2 * 1000
      })
      return res
    }
  },
  error => {
    if (error.message == `timeout of ${timeout}ms exceeded`) {
      Message({
        message: '连接超时请重试',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.message || 'Error'))
    }
    if (error.message.indexOf('403') != -1) {
      MessageBox.confirm('您的账号已退出登录或在其他地方登录', '退出登录提示', {
        confirmButtonText: '重新登录',
        type: 'warning',
        showCancelButton: false,
        closeOnClickModal: false,
        showClose: false
      }).then(() => {
        store.dispatch('user/logout').then(() => {
          location.reload(true)
        })
      })
    }
    return Promise.reject(error)
  }
)

export function login(data) {
  return service({
    url: '/auth/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/userManager/info',
    method: 'get',
  })
}

// export function logout() {
//   return request({
//     url: '/vue-element-admin/user/logout',
//     method: 'post'
//   })
// }

export function getRouters(userId) {
  return request({
    url: `/roleManager/getRouters/${userId}`,
    method: 'get'
  })
}
