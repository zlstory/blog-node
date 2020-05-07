const mysql = require('mysql')

// 创建连接对象
const con = mysql.createConnection({
  host: '152.136.46.55',
  user: 'root',
  password: '123456',
  port: '4280',
  database: 'myblog'
})

// 开始连接
con.connect()

// 执行sql语句
const sql = 'select * from blogs'

con.query(sql, (err, result) => {
  if(err){
    console.log(err)
    return
  }
  console.log(result)
})

// 关闭连接
con.end()