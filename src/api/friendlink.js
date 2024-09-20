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


export function delFriLinkByID(friLinkID) {
  return request({
    url: `/busFriendLink/delFriLinkByID/${friLinkID}`,
    method: 'DELETE'
  })
}

export function delFriLinkBatchByIDS(data) {
  return request({
    url: `/busFriendLink/delFriLinkBatchByIDS`,
    method: 'DELETE',
    data
  })
}
