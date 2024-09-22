import request from '@/utils/request'

export function getAllPageRoleList(roleName, pageNum, pageSize) {
  return request({
    url: '/umsRole/getAllPageRoleList',
    method: 'GET',
    params: {
      roleName: roleName,
      pageNum: pageNum,
      pageSize: pageSize
    }
  })
}

export function addOrEditRole(data) {
  return request({
    url: '/umsRole/addOrEditRole',
    method: 'POST',
    data
  })
}


export function delRole(roleID) {
  return request({
    url: `/umsRole/delRole/${roleID}`,
    method: 'DELETE'
  })
}

export function delRoleBatch(data) {
  return request({
    url: `/umsRole/delRoleBatch`,
    method: 'DELETE',
    data
  })
}
