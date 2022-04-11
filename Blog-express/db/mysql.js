const mysql= require('mysql')
const{MYSQL_CONFIG}=require('../conf/db')
//创建链接对象
const con=mysql.createConnection(MYSQL_CONFIG)
//开始链接
con.connect();

//统一执行sql函数
function exec(sql){
  const promise=new Promise((resolve,reject)=>{
    con.query(sql,(err,result)=>{
      if(err) {
        reject(err)
        return
      }
      resolve(result)
    })
  })
  return promise
}

module.exports = {
  exec,
  escape: mysql.escape
}