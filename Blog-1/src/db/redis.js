const redis= require('redis')
 const {REDIS_CONFIG}= require('../conf/db')

 //创建客户端
 const redisClient=redis.createClient(REDIS_CONFIG.port,REDIS_CONFIG.host)
 redisClient.on_connect('error',err=>{
   console.error(err)
 })

 const set=(key,val)=>{
   if(typeof val === 'object'){
     val=JSON.stringify(val)
   }
  redisClient.set(key,val,redis.print)
 }
 const get=(key)=>{
   const promise= new Promise((resolve, reject) =>{
     redisClient.get(key,(err,val)=>{
       if(err){
         reject(err)
         return
       }
       if(val==null){
        resolve(null)
        return
       }
       try {
         resolve(JSON.parse(val))//返回json对象
       } catch (error) {
         resolve(val)
       }

     })
   })
   return promise
}

module.exports ={set,get}