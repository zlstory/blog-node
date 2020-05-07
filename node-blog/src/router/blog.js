const { getList, getDetail, newBlog, updateBlog, delBlog } = require('../contronller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')

/**
 * @description: 统一的登录验证函数
 * @param {type}} 
 * @return: 如果没有登录时有返回值，如果登录成功时返回undefined
 */

const loginCheck = (req) => {
  if (!req.session.username) {
    return Promise.resolve(
      new ErrorModel('尚未登录')
    )
  }
}



const handleBlogRouter = (req, res) => {
  const method = req.method // get post
  const id = req.query.id
  // 获取博客列表
  if (method === 'GET' && req.path === '/api/blog/list') {
    const author = req.query.author || ''
    const keyword = req.query.keyword || ''
    // const listData = getList(author, keyword)
    // return new SuccessModel(listData)
    const result = getList(author, keyword)
    return result.then(listData => { // return的是promise对象 所以在app.js中 处理路由时也要用promise的方式
      return new SuccessModel(listData)
    })
  }

  // 获取博客详情
  if (method === 'GET' && req.path === '/api/blog/detail') {
    // const data = getDetail(id)
    // return new SuccessModel(data)
    const result = getDetail(id)
    return result.then(data => {
      return new SuccessModel(data)
    })
  }

  // 新建博客
  if (method === 'POST' && req.path === '/api/blog/new') {
    // const data = newBlog(req.body)
    // return new SuccessModel(data)

    const loginCheckResult = loginCheck(req)
    if (loginCheckResult) { // 如果登录成功，loginCheckResult为undefined，则不做拦截作用
      return loginCheckResult
    }

    req.body.author = req.session.username
    const result = newBlog(req.body)
    return result.then(data => {
      return new SuccessModel(data)
    })
  }

  // 更新博客
  if (method === 'POST' && req.path === '/api/blog/update') {
    const loginCheckResult = loginCheck(req)
    if (loginCheckResult) { // 如果登录成功，loginCheckResult为undefined，则不做拦截作用
      return loginCheckResult
    }
    const result = updateBlog(id, req.body)
    return result.then(val => {
      if (val) {
        return new SuccessModel()
      } else {
        return new ErrorModel('更新博客失败')
      }
    })

  }

  // 删除博客
  if (method === 'POST' && req.path === '/api/blog/delete') {
    const loginCheckResult = loginCheck(req)
    if (loginCheckResult) { // 如果登录成功，loginCheckResult为undefined，则不做拦截作用
      return loginCheckResult
    }
    const author = req.session.username
    const result = delBlog(id, author)
    return result.then(val => {
      if (val) {
        return new SuccessModel()
      } else {
        return new ErrorModel('删除博客失败')
      }
    })
  }
}

module.exports = handleBlogRouter