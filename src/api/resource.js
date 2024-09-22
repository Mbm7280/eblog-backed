import request from '@/utils/request'

export function getAllPageResourceList(resName, pageNum, pageSize) {
  return request({
    url: '/umsResource/getAllPageResourceList',
    method: 'GET',
    params: {
      resName: resName,
      pageNum: pageNum,
      pageSize: pageSize
    }
  })
}

export function addOrEditResource(data) {
  return request({
    url: '/umsResource/addOrEditResource',
    method: 'POST',
    data
  })
}


export function delResource(resID) {
  return request({
    url: `/umsResource/delResource/${resID}`,
    method: 'DELETE'
  })
}

export function delResourceBatch(data) {
  return request({
    url: `/umsResource/delResourceBatch`,
    method: 'DELETE',
    data
  })
}
