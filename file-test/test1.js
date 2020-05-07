
const fs = require('fs')
const path = require('path')

const fileName = path.resolve(__dirname, 'data.txt')

// 读取文件内容
/* fs.readFile(fileName, (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  // data 是二进制类型，需要转换为字符串
  console.log(data.toString())
}) */

// 写入文件
/* const content = '这是新写入的内容\n'
const opt = {
  flag: 'a' // 表示追加写入，覆盖用'w'
}
fs.writeFile(fileName, content, opt, (err) => {
  if (err) {
    console.error(err)
    return
  }
}) */

// 判断文件是否存在
/* fs.exists(fileName, (exist) => {
  console.log('exist', exist)
}) */

// 标准输入输出
process.stdin.pipe(process.stdout)

const http = require('http')
const server = http.createServer((req, res) => {
  if(req.method === "POST") {
    req.pipe(res) // 最主要
  }
})
server.listen(8000)

// 复制文件
const fs = require('fs')
const path = require('path')

const fileName1 = path.resolve(__dirname, 'data.txt')
const fileName2 = path.resolve(__dirname, 'data-copy.txt')

const readStream = fs.createReadStream(fileName1)
const writeStream = fs.createWriteStream(fileName2)

readStream.pipe(writeStream)
readStream.on('data', chunk => {
  console.log(chunk.toString())
})

readStream.on('end', () => {
  console.log('copy done')
})
