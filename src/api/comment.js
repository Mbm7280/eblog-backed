import request from '@/utils/request'

export function getAllPageCommentList(commentContent, pageNum, pageSize) {
  return request({
    url: '/busComment/getAllPageCommentList',
    method: 'GET',
    params: {
      commentContent: commentContent,
      pageNum: pageNum,
      pageSize: pageSize
    }
  })
}

export function addOrEditComment(data) {
  return request({
    url: '/busComment/addOrEditComment',
    method: 'POST',
    data
  })
}


export function delComment(commentID) {
  return request({
    url: `/busComment/delComment/${commentID}`,
    method: 'DELETE'
  })
}

export function delCommentBatch(data) {
  return request({
    url: `/busComment/delCommentBatch`,
    method: 'DELETE',
    data
  })
}
