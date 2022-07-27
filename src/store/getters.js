const getters = {
  sidebar: (state) => state.app.sidebar,
  device: (state) => state.app.device,
  // 在根级的getters上将token设置成公共的访问属性放出
  token: (state) => state.user.token,
  // 在根级的getters上将name设置成公共的访问属性放出
  name: (state) => state.user.userInfo.username,
  userId: (state) => state.user.userInfo.userId,
  staffPhoto: (state) => state.user.userInfo.staffPhoto,
  companyId: (state) => state.user.userInfo.companyId
}
export default getters
