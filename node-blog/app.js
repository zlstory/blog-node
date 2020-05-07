const querystring = require('querystring');
const { get, set } = require('./src/db/redis')
const { access } = require('./src/utils/log')
const handleBlogRouter = require('./src/router/blog');
const handleUserRouter = require('./src/router/user');

// 设置cookie的过期时间
const getCookieExpires = () => {
  const d = new Date()
  d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
  return d.toGMTString()

}

// 解析session数据
// const SESSION_DATA = {}

// 用于解析post中的data
const getPostData = req => {
  const promise = new Promise((resolve, reject) => {
    if (req.method !== 'POST') {
      resolve({});
      return;
    }
    if (req.headers['content-type'] !== 'application/json') {
      resolve({});
      return;
    }
    let postData = '';
    req.on('data', chunk => {
      postData += chunk.toString();
    });
    req.on('end', () => {
      if (!postData) {
        resolve({});
        return;
      }
      resolve(JSON.parse(postData));
    });
  });
  return promise;
};

const serverHandle = (req, res) => {
  // 记录access log
  access(`${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}`)

  // 设置返回格式 JSON
  res.setHeader('Content-type', 'application/json');

  // 获取path
  const url = req.url;
  req.path = url.split('?')[0];

  // 解析query
  req.query = querystring.parse(url.split('?')[1]);

  // 解析cookie
  req.cookie = {}
  const cookieStr = req.headers.cookie || ''
  cookieStr.split(';').forEach(item => {
    if (!item) {
      return
    }
    const arr = item.split('=')
    const key = arr[0].trim()
    const val = arr[1]
    req.cookie[key] = val
  })

  // 解析session
  // let needSetCookie = false // 是否需要设置cookie
  // let userId = req.cookie.userid
  // if (userId) {
  // 如果有的话不需要设置needSetCookie
  //   if (!SESSION_DATA[userId]) {
  //     SESSION_DATA[userId] = {}
  //   }
  // } else {
  //   needSetCookie = true // 如果没有 则需要设置
  //   userId = `${Date.now()}_${Math.random()}` // 确保不重复
  //   SESSION_DATA[userId] = {}
  // }
  // req.session = SESSION_DATA[userId]

  // 使用redis解析session
  let needSetCookie = false
  let userId = req.cookie.userid
  if (!userId) {
    needSetCookie = true
    userId = `${Date.now()}_${Math.random()}`
    // 初始化redis中的session值
    set(userId, {})
  }
  // 获取session
  req.sessionId = userId
  get(userId).then(sessionData => {
    if (sessionData === null) { // 如果根据userId获取到的sessionData为null时
      set(req.sessionId, {}) // 初始化redis中的session值
      req.session = {} // 设置session
    } else {
      // 设置session
      req.session = sessionData
    }
    console.log('req.session', req.sessionId)
    // 在处理路由前，需要处理post data
    return getPostData(req)
  }).then(postData => {
    req.body = postData;

    // 处理blog路由

    // const blogData = handleBlogRouter (req, res);
    // if (blogData) {
    //   res.end (JSON.stringify (blogData));
    //   return;
    // }
    // 修改为promise的方式
    const blogResult = handleBlogRouter(req, res);
    if (blogResult) {
      blogResult.then(blogData => {
        if (needSetCookie) {
          res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
        }
        res.end(JSON.stringify(blogData));
      });
      return;
    }

    // 处理user路由
    // const userData = handleUserRouter (req, res);
    // if (userData) {
    //   res.end (JSON.stringify (userData));
    //   return;
    // }

    const userResult = handleUserRouter(req, res)
    if (userResult) {
      userResult.then(userData => {
        if (needSetCookie) {
          res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
        }
        res.end(JSON.stringify(userData))
      })
      return
    }

    // 未命中路由 返回404
    res.writeHead(404, { 'Content-type': 'text-plain' });
    res.write('404 Not Found\n');
    res.end();
  });
};

module.exports = serverHandle;

//process.env.NODE_ENV
