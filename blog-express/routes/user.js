const express = require('express')
const router = express.Router();
const { SuccessModel, ErrorModel } = require('../model/resModel')
const { login } = require('../contronller/user')

router.post('/login', function (req, res, next) {
  const { username, password } = req.body
  const result = login(username, password)
  result.then(data => {
    if (data) {
      // 设置session，express-session会将session同步到redis
      req.session.username = data.username
      req.session.realname = data.realname
      res.json(
        new SuccessModel()
      )
      return
    }
    res.json(
      new ErrorModel('登录失败')
    )
  }).catch(err => { 
    console.log(err) 
  })

})


module.exports = router