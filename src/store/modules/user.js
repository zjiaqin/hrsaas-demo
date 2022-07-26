import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
const state = {
  token: getToken(),
  userInfo: {}
}
const mutations = {
  // 同时设置state中及cookie中的token的方法
  setToken(state, token) {
    state.token = token
    setToken(token)
  },
  // 同时删除state中及cookie中的token值的方法
  removeToken(state) {
    state.token = null
    removeToken()
  },
  // 设置userInfo的方法
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo
  },
  // 清空userInfo的方法
  removeUserInfo(state) {
    state.userInfo = {}
  }
}
const actions = {
  // 封装登录的action
  async login(context, data) {
    const res = await login(data)
    // 成功获取服务器返回的数据
    // 调用mutation中的setToken方法，用来修改state中的token值
    context.commit('setToken', res)
    setTimeStamp()
  },
  // 封装获取用户个人信息的action
  async getUserInfo(context) {
    const res = await getUserInfo()
    const detail = await getUserDetailById(res.userId)
    const baseResult = { ...res, ...detail }
    // 调用mutation中的setUserInfo方法，用来设置state中的userInfo值
    context.commit('setUserInfo', baseResult)
    return baseResult
  },
  logout(context) {
    context.commit('removeToken')
    context.commit('removeUserInfo')
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
