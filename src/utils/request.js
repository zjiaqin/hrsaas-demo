// 导出一个axios的实例  而且这个实例要有请求拦截器 响应拦截器
import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getTimeStamp } from './auth'
import router from '@/router'
// 定义token客户端过期时间，单位秒
const TimeOut = 3600
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
}) // 创建一个axios的实例
// 请求拦截器
service.interceptors.request.use(
  (config) => {
    if (store.getters.token) {
      if (IsCheckTimeOut()) {
        store.dispatch('user/logout')
        router.push('/login')
        return Promise.reject(new Error('token超时了'))
      }
      config.headers['Authorization'] = `Bearer ${store.getters.token}`
    }
    return config
  },
  (error) => {
    Message.error(error.message)
    return Promise.reject(error)
  }
)
// 反馈拦截器
service.interceptors.response.use(
  (response) => {
    // axios默认加了一层data
    const { success, message, data } = response.data
    //   要根据success的成功与否决定下面的操作
    if (success) {
      return data
    } else {
      // 业务已经错误了 还能进then ? 不能 ！ 应该进catch
      Message.error(message) // 提示错误消息
      return Promise.reject(new Error(message))
    }
  },
  (error) => {
    if (
      error.response &&
      error.response.data &&
      error.response.data.code === 10002
    ) {
      store.dispatch('user/logout') // 登出action 删除token
      router.push('/login')
    } else {
      Message.error(error.message) // 提示错误信息
    }
    return Promise.reject(error) // 返回执行错误 让当前的执行链跳出成功 直接进入 catch
  }
)
// 封装函数主动判定token时间是否过期
function IsCheckTimeOut() {
  const currentTime = Date.now()
  const timeStamp = getTimeStamp()
  return (currentTime - timeStamp) / 1000 > TimeOut
}
export default service // 导出axios实例
