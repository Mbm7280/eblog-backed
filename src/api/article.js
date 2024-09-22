import request from '@/utils/request'

export function getAllArticleList(params) {
  // 返回一个axios对象 => promise  // 返回了一个promise对象
  return request({
    url: '/busArticle/getAllArticleList',
    method: 'GET',
    params
  })
}

export function getAllPageArticleList(articleTitle, pageNum, pageSize) {
  return request({
    url: '/busArticle/getAllPageArticleList',
    method: 'GET',
    params: {
      articleTitle: articleTitle,
      pageNum: pageNum,
      pageSize: pageSize
    }
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

export function delArticleBatch(data) {
  return request({
    url: `/busArticle/delArticleBatch`,
    method: 'DELETE',
    data
  })
}
