import request from '@/utils/request'

export function getHomepageInfo() {
  return request({
    url: '/busHomepage/getHomepageInfo',
    method: 'GET'
  })
}
