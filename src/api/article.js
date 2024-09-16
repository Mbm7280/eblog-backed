import request from '@/utils/request'

export function getAllArticleList(params) {
  // 返回一个axios对象 => promise  // 返回了一个promise对象
  return request({
    url: '/busArticle/getAllArticleList',
    method: 'GET',
    params
  })
}


/**
 * 删除文章
 * @param articleID
 * @returns {*}
 */
export function delArticle(articleID) {
  return request({
    url: `/busArticle/delArticle/${articleID}`,
    method: 'DELETE'
  })
}

export function addOrEditArticle(data) {
  return request({
    url: `/busArticle/addOrEditArticle`,
    method: 'POST',
    data
  })
}

export function getArticleByArticleID(articleID) {
  return request({
    url: `/busArticle/getArticleByArticleID`,
    method: 'GET',
    params: {
      articleID: articleID
    }
  })
}

