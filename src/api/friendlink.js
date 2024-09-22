import request from '@/utils/request'

export function getAllPageFriLinkList(friLinkName, pageNum, pageSize) {
  return request({
    url: '/busFriendLink/getAllPageFriLinkList',
    method: 'GET',
    params: {
      friLinkName: friLinkName,
      pageNum: pageNum,
      pageSize: pageSize
    }
  })
}

export function addOrEditFriLink(data) {
  return request({
    url: '/busFriendLink/addOrEditFriLink',
    method: 'POST',
    data
  })
}


export function delFriLink(friLinkID) {
  return request({
    url: `/busFriendLink/delFriLink/${friLinkID}`,
    method: 'DELETE'
  })
}

export function delFriLinkBatch(data) {
  return request({
    url: `/busFriendLink/delFriLinkBatch`,
    method: 'DELETE',
    data
  })
}
