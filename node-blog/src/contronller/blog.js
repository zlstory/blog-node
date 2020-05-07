const { exec } = require('../db/mysql')

const getList = (author, keyword) => {
  let sql = `select * from blogs where 1=1 `
  if(author){
    sql += `and author = '${author}'`
  }
  if(keyword){
    sql += `and title like '%${keyword}%'`
  }

  sql += `order by createtime desc;`
  
  // 返回的是promise,所以在contronller/user.js中 需要使用result.then()来接收
  return exec(sql)
}

const getDetail = (id) => {
  const sql = `select * from blogs where id='${id}'`
  return exec(sql).then(rows => {
    return rows[0]
  })
}

const newBlog = (blogdata = {}) => {
  // blogData: 博客对象， 包含title content author属性
  const title = blogdata.title
  const content = blogdata.content
  const author = blogdata.author
  const createtime = Date.now()

  const sql = `
    insert into blogs (title, content, createtime, author) 
    values ('${title}','${content}', ${createtime}, '${author}');
  `
  return exec(sql).then(insertData => {
    return {
      id: insertData.insertId
    }
  })
  
}

const updateBlog = (id, blogData={}) => {
  // id：更新博客的id
  // blogData: 博客对象， 包含title content属性
  
  const title = blogData.title
  const content = blogData.content

  const sql = `
    update blogs set title='${title}', content='${content}' where id=${id};
  `
  return exec(sql).then(updateData => {
    if(updateData.affectedRows > 0 ){
      return true
    }
    return false
  })

}

const delBlog = (id, author) => {
  // id就是需要删除的博客id
  const sql = `delete from blogs where id='${id}' and author='${author}'`
  return exec(sql).then(deleteData => {
    if(deleteData.affectedRows > 0 ){
      return true
    }
    return false
  })
}
module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
}