import Cookies from 'js-cookie'
const timeKey = 'hrsaas-timestamp-key'
const TokenKey = 'hrsaas-ihrm-token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setTimeStamp() {
  return Cookies.set(timeKey, Date.now())
}
export function getTimeStamp() {
  return Cookies.get(timeKey)
}
