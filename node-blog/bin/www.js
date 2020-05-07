const http = require('http') // 引入http模块

const POST = 8000

const serverHandle = require('../app')
const server = http.createServer(serverHandle)
server.listen(POST)