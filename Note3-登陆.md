# 登陆

- **核心:登录校验&登录信息存储**
- **目录**
- cookie和session
  - sessin写入redis
- 开发登陆功能，和前端联调（使用nginx反向代理）



## Cookie

- 什么是 cookie?
  - 储存在浏览器的一段字符串(最大5kb)
  - 跨域不共享
  - 格式如k1=v1; k2=v2; k3=v3; 因此可以存储结构化数据
  - 每次发送http请求,会将请求域的cookie一起发送给server
  - server可以修改cookie并返回给浏览器
  - 浏览器也可以通过js修改cookie(有限制)
    - js修改cookie 实际上是**追加**,而**不是覆盖**
- javascript操作cookie ,浏览器中查看cookie
- server端操作cookie , 实现登录验证

![cookie](/Users/wsp/Documents/NodeJs/WebServer-Blog/img/cookie.png)

### server端nodejs操作cookie

- ### 查看cookie

- ### 修改cookie

- ### 实现登陆验证

**path=/;**

app.js

```js
  //解析cookie
  req.cookie={}
  const cookieStr=req.headers.cookie||'' //cookie
  cookieStr.split(";").forEach(item =>{
    if(!item){
      return
    }
    const arr=item.split('=')
    const key =arr[0].trim() //加个trim 去首尾空格
    const val=arr[1].trim()
    req.cookie[key]=val
  })
  // console.log(req.cookie)

```

在router/user.js里测试

```js
  if(method ==='GET'&&req.path==='/api/user/login'){//先改为GET
    // const{username,password}=req.body
    const {username,password}=req.query
    const result=login(username,password)
    return result.then(data => {
      if(data.username){
        //操作cookie
        res.setHeader('Set-cookie',`username=${username}; path=/;http`)

        return new SuccessModel
      }else{
        return new ErrorModel('登陆失败')
      }
    })
  }   

//登陆验证测试
  if(method ==='GET'&&req.path==='/api/user/login-test'){
    if(req.cookie.username){
      return Promise.resolve(new SuccessModel)
    }else{
      return Promise.resolve(new ErrorModel('未登陆'))
    }
  }

```



### cookie做限制

**httpOnly** 不允许客户端用js对cookie进行修改

```js
    res.setHeader('Set-cookie',`username=${username}; path=/; httpOnly`)
```

**设置cookie过期时间**

```JS
//获取cookie过期时间
const getCookieExpires =() =>{
  const d=new Date();
  d.setTime(d.getTime()+(24*60*60*1000)) //设置一天后
  return d.toGMTString()
}
```

```js
 //操作cookie
res.setHeader('Set-cookie',`username=${username}; path=/; httpOnly; expires=${getCookieExpires()}`)
```



Cookie 问题:

- 会暴露username等等,不安全

如何解决?

- cookie中存储userid,server端对应username
- 解决方案:**session**

## Session

![session](/Users/wsp/Documents/NodeJs/WebServer-Blog/img/session.png)

app.js

```js
//session数据
const SESSION_DATA={}
```

```js
//解析session
  let needSetCookie=false
  let userId=req.cookie.userid
  if(userId) {
    if(!SESSION_DATA[userId]) {
      SESSION_DATA[userId]={}
    }
  }else{
    needSetCookie=true
    userId=`${Date.now()}_${Math.random()}`;//保证不重复
    SESSION_DATA[userId]={}
  }
  req.session=SESSION_DATA[userId] 
  console.log(req.session);
```

处理路由时检查需要setcookie

```js
if(needSetCookie){
	res.setHeader('Set-cookie',`userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
  }
```

router/user.js

```js
//设置session
        req.session.username = data.username
        req.session.realname=data.realname
```

```js
//使用
if(req.session.username)
```



**当前使用session的问题**

- 目前session是js变量,放在nodejs内存中

  - 进程内存有限,访问量大,内存暴增
  - 正式上线是多线程,进程之间内存无法共享

  <img src="/Users/wsp/Documents/NodeJs/WebServer-Blog/img/session-1.png" alt="session-1" style="zoom:80%;" />

  <img src="/Users/wsp/Documents/NodeJs/WebServer-Blog/img/session-2.png" alt="session-2" style="zoom:80%;" />

  <img src="/Users/wsp/Documents/NodeJs/WebServer-Blog/img/session-3.png" alt="session-3" style="zoom:80%;" />

  

  

## redis

- web server最常用的缓存数据库,数据存放在内存中
- 相比于mysql,访问速度快(内存和硬盘不是一个数量级的 )
- 但是成本更高,可存储的数据量更小(内存的硬伤)

**session为何适用redis**

- session访问频繁,对性能要求极高
- session可不考虑断电丢失数据的问题(内存的硬伤)
- session数据量不会太大(相比于mysql中存储的数据)

**网站数据为何不适用redis**

- 操作频率不是太高(相比于session操作)
- 断电不能丢失,必须保留
- 数据量太大，内存成本太高

安装

```
brew install redis
```

启动

```
redis-server
redis-cli
```

命令

```
set myname pithy
get myname
del myname
keys *
shutdown 关闭
```



### nodejs链接redis

npm install默认安装的Redis client for Node.js为V4.0.0版本，一些接口已经改变,直接使用会提示`ClientClosedError`

需要安装旧版本

```bash
npm uninstall --save redis //卸载新版本
npm install --save redis@3.1.2 //安装旧版本
```

redis-test.js

```js
const redis = require('redis')
//创建客户端
const redisClient=redis.createClient(6379,'127.0.0.1')
redisClient.on('error', err=>{
  console.error(err)
})

//test
redisClient.set('myname','pithy',redis.print)
redisClient.get('myname',(err,val)=>{
  if(err){
    console.error(err)
    return
  }
  console.log('val',val)
  
  //退出
  redisClient.quit()
})
```

conf/db.js

```js
let REDIS_CONFIG
REDIS_CONFIG={
    port:6379,
    host: '127.0.0.1'
  }
```

db/redis.js

```js
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
```

## 完成登陆代码

```js
//登陆验证函数
const loginCheck=(req)=>{
  if(!req.session.username){
    return Promise.resolve(new ErrorModel('未登陆'))
  }
}
```

```js
   //查询登陆状态
   const loginCheckResult =loginCheck(req)
    if(loginCheckResult){
      //未登陆
      return loginCheck
    }
```



## 联调

使用nginx

### 前端 http-server

```
npm i http-server -g
http-server -p 8001

```

### 后端 nodemon

```
npm run dev
```

### 数据库redis

```
redis-server
```



### nginx配置

- 高性能的web服务器,开源免费
- 一般用于做静态服务、负载均衡
- **反向代理** 

![nginx1](/Users/wsp/Documents/NodeJs/WebServer-Blog/img/nginx1.png)

**安装**

```
brew install nginx
```

**nginx命令**

```
测试配置文件格式是否正确 nginx -t
启动 nginx
重启 nginx -s reload
停止 nginx -s stop
```



- nginx反向代理的配置

查看配置文件所在目录

`brew info nginx`

​	The default port has been set in <u>/opt/homebrew/etc/nginx/nginx.conf</u> to 8080 so that

打开配置文件

`sudo vi /opt/homebrew/etc/nginx/nginx.conf`

加入

```nginx
        location /{
proxy_pass http://localhost:8001;
}
        location /api/{
proxy_pass http://localhost.com:8000;
proxy_set_header Host $host;
}
```



## 总结

- cookie是什么? session 是什么?如何实现登录?
- redis在这里扮演什么角色?有什么核心的价值?
- nginx的反向代理配置,联调过程中的作用

## 踩坑

- 前端安装http-server 在blog目录下, -g安装总是失败,不加-g,安装后http-server无效命令,最后在系统终端安装成功

- nginx配置,conf文件位置不一样,需要先查一下再修改

  - conf localhost后面加了.com,导致没有效果,排查了很久

- 后端

  - 处理blog路由 needSetCookie,设置header时候userId写成username了

    - 获取blog列表,已经登陆过的话不用再登陆if(!req.query.isadmin){}没写`!`

  - user登陆函数const {username,password}=**req.body*写成*req.query了

    

​		
