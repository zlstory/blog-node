const { getList, getDetail, newBlog, updateBlog, delBlog } = require('../contronller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')

const loginCheck = require('../middleware/loginCheck')


var express = require('express');
var router = express.Router();

router.get('/list', async (req, res, next) => {
  let author = req.query.author || ''
  const keyword = req.query.keyword || ''
  // 管理员
  if (req.query.isadmin) {
    if (!req.session.username) {
      res.json(
        new ErrorModel('未登录')
      )
      return
    }
    // 强制查询自己的博客
    author = req.session.username
  }
  const result = getList(author, keyword)
  try {
    const listData = await result;
    res.json(new SuccessModel(listData));
  }
  catch (error) {
    console.log('caught', error);
  }
});

router.get('/detail', async (req, res, next) => {
  const result = getDetail(req.query.id)
  const data = await result;
  res.json(new SuccessModel(data));
})

router.post('/new', loginCheck, async (req, res, next) => {
  req.body.author = req.session.username
  const result = newBlog(req.body)
  const data = await result;
  res.json(new SuccessModel(data));
})

router.post('/update', loginCheck, async (req, res, next) => {
  const result = updateBlog(req.query.id, req.body)
  const val = await result;
  if (val) {
    res.json(new SuccessModel());
  }
  else {
    res.json(new ErrorModel('删除博客失败'));
  }
})

router.post('/del', loginCheck, async (req, res, next) => {
  const author = req.session.username
  const result = delBlog(req.query.id, author)
  const val = await result;
  if (val) {
    res.json(new SuccessModel());
  }
  else {
    res.json(new ErrorModel('删除博客失败'));
  }
})


module.exports = router;
