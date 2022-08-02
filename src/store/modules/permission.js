import { constantRoutes, asyncRoutes } from '@/router'
const state = {
  routes: constantRoutes // 所有人默认的静态路由
}
const mutations = {
  setRoutes(state, newRoutes) {
    // 重设路由（所有人默认的静态路由+登录用户具备权限的动态路由）
    state.routes = [...constantRoutes, ...newRoutes]
  }
}
const actions = {
  filterRoutes(context, menus) {
    const routes = []
    menus.forEach((key) => {
      routes.push(...asyncRoutes.filter((item) => item.name === key))
    })
    context.commit('setRoutes', routes)
    return routes
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
