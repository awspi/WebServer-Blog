const redis= require('redis')
 const {REDIS_CONFIG}= require('../conf/db')

 //创建客户端
 const redisClient=redis.createClient(REDIS_CONFIG.port,REDIS_CONFIG.host)
 redisClient.on('error',err=>{
   console.error(err)
 })

module.exports=redisClient