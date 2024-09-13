import request from '@/utils/request'

export function login(data) {
  // 返回一个axios对象 => promise  // 返回了一个promise对象
  return request({
    url: '/umsUser/login',
    method: 'POST',
    data
  })
}

/**
 *  获取用户的基本资料
 * **/
export function getUserInfo() {
  return request({
    url: '/umsUser/getUserInfo',
    method: 'get'
  })
}

export function getInfo(token) {

}

export function logout() {

}

// import request from '@/utils/request'
//
// export function login(data) {
//   return request({
//     url: '/vue-admin-template/user/login',
//     method: 'post',
//     data
//   })
// }
//
// export function getInfo(token) {
//   return request({
//     url: '/vue-admin-template/user/info',
//     method: 'get',
//     params: { token }
//   })
// }
//
// export function logout() {
//   return request({
//     url: '/vue-admin-template/user/logout',
//     method: 'post'
//   })
// }
