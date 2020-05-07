const env = process.env.NODE_ENV // 环境参数

let MYSQL_CONF
let REDIS_CONF

if (env === 'dev') {
  // mysql
  MYSQL_CONF = { // 本地配置
    host: '152.136.46.55',
    user: 'root',
    password: '123456',
    port: '4280',
    database: 'myblog',
  }
  // redis
  REDIS_CONF = {
    port: 6379,
    host: '127.0.0.1'
  }
}

if (env === 'production') {
  MYSQL_CONF = { // 线上服务器的配置
    host: '152.136.46.55',
    user: 'root',
    password: '123456',
    port: '4280',
    database: 'myblog'
  }
  // redis
  REDIS_CONF = {
    port: 6379,
    host: '127.0.0.1'
  }
}

module.exports = {
  MYSQL_CONF,
  REDIS_CONF
}
