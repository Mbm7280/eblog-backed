import request from '@/utils/request'

export function getCategoryByID(categoryID) {
  // 返回一个axios对象 => promise  // 返回了一个promise对象
  return request({
    url: '/busCategory/getCategoryByID/${categoryID}',
    method: 'GET'
  })
}

export function getAllCategoryList() {
  // 返回一个axios对象 => promise  // 返回了一个promise对象
  return request({
    url: '/busCategory/getAllCategoryList',
    method: 'GET'
  })
}
