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

export function getAllCategoryListByCateName(categoryName) {
  // 返回一个axios对象 => promise  // 返回了一个promise对象
  return request({
    url: '/busCategory/getAllCategoryListByCateName',
    method: 'GET',
    params: {
      categoryName: categoryName
    }
  })
}

export function getAllPageCategoryList(categoryName, pageNum, pageSize) {
  return request({
    url: '/busCategory/getAllPageCategoryList',
    method: 'GET',
    params: {
      cateName: categoryName,
      pageNum: pageNum,
      pageSize: pageSize
    }
  })
}

export function addOrEditCategory(data) {
  return request({
    url: '/busCategory/addOrEditCategory',
    method: 'POST',
    data
  })
}

export function delCategory(cateID) {
  return request({
    url: `/busCategory/delCategory/${cateID}`,
    method: 'DELETE'
  })
}

export function delCategoryBatch(data) {
  return request({
    url: `/busCategory/delCategoryBatch`,
    method: 'DELETE',
    data
  })
}
