var createError = require('http-errors'); // 处理404
var express = require('express');
var path = require('path');
var fs= require('fs')
var cookieParser = require('cookie-parser'); // 解析cookie
var logger = require('morgan'); // 记录access log
const session = require('express-session') // 解析session
const RedisStore = require('connect-redis')(session)

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const blogRouter = require('./routes/blog');
const userRouter = require('./routes/user');

var app = express(); // 初始化实例

// view engine setup 前端设置 暂时不管
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

const ENV = process.env.NODE_ENV
if(ENV !== 'production') {
  app.use(logger('dev', {
    stream: process.stdout, // 日志在控制台 加不加都一样 是默认参数
  }));
} else { // 线上环境
  const logFileName = path.join(__dirname, 'logs', 'access.log')
  const writeStream = fs.createWriteStream(logFileName, {
    flags: 'a'
  })

  app.use(logger('combined', {
    stream: writeStream, // 日志写到文件中
  }));
}

app.use(logger('dev', {
  stream: process.stdout, // 加不加都一样 是默认参数
}));
app.use(express.json()); // content-type为json格式的情况，在路由中使用req.body可以获取到参数
app.use(express.urlencoded({ extended: false })); // content-type为其他格式时
app.use(cookieParser()); // 解析cookie
app.use(express.static(path.join(__dirname, 'public')));

const redisClient = require('./db/redis')
const sessionStore = new RedisStore({
  client: redisClient
})
//session配置 需在路由前
app.use(session({
  resave: false, //添加 resave 选项
  saveUninitialized: true, //添加 saveUninitialized 选项
  secret: 'WJiol_123#',
  cookie: {
    // path: '/',    // 默认配置
    // httpOnly: true,   // 默认配置
    maxAge: 24 * 60 * 60 * 1000 // 过期时间
  },
  store: sessionStore // 将session存到redis中去
}))


// 注册路由
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/blog', blogRouter);
app.use('/api/user', userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'dev' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
