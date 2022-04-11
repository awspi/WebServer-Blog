const env=process.env.NODE_ENV//环境变量
const mysql = require('mysql')
//配置
let MYSQL_CONFIG
let REDIS_CONFIG
if(env==='dev'){
  MYSQL_CONFIG={
    host: 'localhost',
    user: 'root',
    password: '12345678',
    port:'3306',
    database: 'myblog'
  }
  REDIS_CONFIG={
    port:6379,
    host: '127.0.0.1'
  }
}
if(env==='production'){
  MYSQL_CONFIG={
    host: 'localhost',
    user: 'root',
    password: '12345678',
    port:'3306',
    database: 'myblog'
  }
  REDIS_CONFIG={
    port:6379,
    host: '127.0.0.1'
  }
}
module.exports ={
  MYSQL_CONFIG,
  REDIS_CONFIG
}