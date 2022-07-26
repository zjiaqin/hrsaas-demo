import request from '@/utils/request'

export function getDepartments() {
  return request({
    url: '/company/department'
  })
}
export function delDepartments(id) {
  return request({
    method: 'delete',
    url: `/company/department/${id}`
  })
}
export function addDepartments(data) {
  return request({
    method: 'post',
    url: '/company/department',
    data
  })
}
export function getDepartDetail(id) {
  return request({
    url: `/company/department/${id}`
  })
}
export function updateDepartments(data) {
  return request({
    method: 'put',
    url: `/company/department/${data.id}`,
    data
  })
}
