const env=process.env.NODE_ENV//环境变量
const mysql = require('mysql')
//配置
let MYSQL_CONFIG
if(env==='dev'){
  MYSQL_CONFIG={
    host: 'localhost',
    user: 'root',
    password: '12345678',
    port:'3306',
    database: 'myblog'
  }
}
if(env==='production'){
  MYSQL_CONFIG=mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    port:'3306',
    database: 'myblog'
  })
}
module.exports ={ MYSQL_CONFIG}