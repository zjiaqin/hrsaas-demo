import request from '@/utils/request'

export function login(data) {
  return request({
    method: 'POST',
    url: '/sys/login',
    data
  })
}
// 获取用户基本信息的接口
export function getUserInfo() {
  return request({
    method: 'POST',
    url: '/sys/profile'
  })
}
export function logout() {}
// 获取用户信息详细信息的接口
export function getUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`
  })
}
