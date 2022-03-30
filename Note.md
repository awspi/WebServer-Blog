# WebServer Blog

## 介绍

### 目标

- 开发一个博客系统，具有博客的基本功能
- 只开发sever端，不关心前端

**通过案例学习NodeJs开发webserver**

**分为三阶段：**

1. 不使用任何框架开发Blog
2. 使用Express框架开发Blog，了解express一些中间件的原理
3. 使用koa2开发



### 需求

- 首页，作者主页，博客详情页
- 登陆页
- 管理中心，新建页，编辑页

### 技术方案

- 数据如何储存
- 如何与前端对接，即接口设计

#### 数据储存

- 博文

| id   | title | createtime | createtime | author |
| ---- | ----- | ---------- | ---------- | ------ |
| 1    | 标题1 | 内容1      | 1          | awspi  |
| 2    | 标题2 | 内容2      | 2          | pithy  |

- 用户

| id   | username | password | realname |
| ---- | -------- | -------- | -------- |
| 1    | awspi    | aaaaaaa  | wsp      |
| 2    | pithy    | baaaaaa  | wsp      |



#### 接口设计

| 描述         | 接口              | 方法 | url参数                           | 备注                     |
| ------------ | ----------------- | ---- | --------------------------------- | ------------------------ |
| 获取博客列表 | /api/blog/list    | get  | `author`作者 `keywords`搜索关键字 | 参数为空则不进行filter   |
| 获取博客内容 | /api/blog/detail  | get  | id                                |                          |
| 新增一篇博客 | /api/blog/new     | post |                                   | post中有新增的内容       |
| 更新一篇博客 | /api/blog/upgrate | post | id                                | postData有更新的内容     |
| 删除一篇博客 | /api/blog/del     | post | id                                |                          |
| 登陆         | /api/user/login   | post |                                   | postData中有用户名和密码 |



## 1.不使用任何框架开发

### 开发接口

- nodejs处理http请求

- 搭建开发环境

- 开发接口（咱不连接数据库，不考虑登陆）

  初始化路由:根据之前技术方案的设计,做出路由
  返回假数据:将路由和数据处理分离,以符合设计原则

#### http请求概述

- DNS解析,建立TCP连接,发送http请求
- **server接收到http请求,处理,并返回**
- 客户端接收到返回数据,处理数据(如渲染页面,执行js )

#### nodejs处理http请求

- get请求和querystring
- post请求和postdata
- 路由

简单示例:

```js
const http = require('http');

const server=http.createServer((req,res)=>{
  res.writeHead(200,{'Content-Type': 'text/html'})
  res.end('<h1>hello world</h1>');
})
server.listen(3000,()=>{
  console.log('listening on 3000 port')
})
// 浏览器访问 localhost:8000
```

#### 处理get请求

- get请求,即客户端要向server端获取数据,如查询博客列表
- 通过querystring来传递数，如a.html?a=100&b=200
- 浏览器直接访问,就发送get请求

The `querystring` API is considered Legacy. While it is still maintained, new code should use the `URLSearchParams` API instead.

解决方法：安装 querystringify代替querystring	

```bash
npm i querystringify
```

目前没弃用，为了方便就暂不导入

```js
const http = require('http');
const querystring = require('querystring');
const server=http.createServer((req, res)=>{
  console.log('method:',req.method)
  const url = req.url
  console.log('url:',url);
  req.query=querystring.parse(url.split('?')[1])
  res.end(
    JSON.stringify(req.query)
  )
})
server.listen(3000,()=>{
  console.log('listening on 3000 port')
})
```



#### 处理post请求

- post请求,即客户端要像服务端传递数据,如新建博客
- 通过post data传递数据，后面会演示
- 浏览器无法直接模拟,需要手写js ,或者使用postman 

```js
const http = require('http');
const server=http.createServer((req, res)=>{
  if(req.method==='POST'){
    //数据格式
    console.log('content-type: ',req.headers['content-type']);
    //接收数据
    let postData=""
    req.on('data',chunk=>{//数据流
      postData += chunk.toString()//chunk本身是二进制
    })
    req.on('end',()=>{
      console.log('postData: '+postData)
      res.end('hello world')//异步 在这里返回
    })

  }
})
server.listen(3000,()=>{
  console.log('listening on 3000 port')
})
```

##### promise

post请求是异步的，需要理解promise



#### nodejs处理路由

- https://github.com/
- https://github.com/username
- https://github.com/username/xxx

```js
const http = require('http');
const server=http.createServer((req, res)=>{
   const url=req.url
   const path=url.split('?')[0]
   res.end(path)//返回路由
})
server.listen(3000,()=>{
  console.log('listening on 3000 port')
})
```

#### 处理http请求的综合示例

```js
const http = require('http')
const querystring=require('querystring')

const server=http.createServer((req, res)=>{
  const method = req.method
  const url=req.url
  const path=url.split('?')[0]
  const query=querystring.parse(url.split('?')[1])

  //设置返回格式为json
  res.setHeader('Content-type', 'application/json')//text/html
  
  //返回的数据
  const resData={
     method,
     url,
     path,
     query
  }
  //返回
  if(method === 'GET'){
    res.end(
      JSON.stringify(resData)
      )
  }
  
  if(method === 'POST'){
    let postData=''
    req.on('data',chunk=>{
      postData+=chunk.toString()
    })
    req.on('end',()=>{
      resData.postData=postData
      res.end(
        JSON.stringify(resData)
      )
    })
  }

})

server.listen(3000,()=>{
  console.log('listening on 3000 port')
})
```

#### 搭建开发环境

- 从0搭建，不使用任何框架
- 使用**nodemon**监测环境变化，自动重启node
- 使用**cross-env**设置环境变量

#### 初始化路由

本部分代码为刚创建时的简单实现，不包含后续更新，只作理解

- **www.js**  createServer的逻辑和业务没关系

```js
const http = require('http')

const PORT = 8000
const serverHandle = require('../app')

const server = http.createServer(serverHandle)
server.listen(PORT)
```

- **app.js**  基本设置、返回类型、获取path、处理路由 

```js
const handleBlogRouter=require('./src/router/blog')
const handleUserRouter=require('./src/router/user')

const serverHandle=(req, res) => {
  //设置返回格式
  res.setHeader('Content-Type', 'application/json')

  //获取path
  const url=req.url
  req.path=url.split('?')[0]

  //处理blog路由
  const blogData=handleBlogRouter(req,res)
  if(blogData){
    res.end(
      JSON.stringify(blogData)
    )
    return
  }

  //处理user路由
  const userData=handleUserRouter(req,res)
  if(userData){
    res.end(
      JSON.stringify(userData)
    )
    return
  }

  //未命中路由 返回404
  res.writeHead(404,{"Content-type":"text/plain"})
  res.write("404 Not Found\n")
}

module.exports=serverHandle
```



- **blog.js** 只负责路由：获取路由，返回正确的格式，其他不参与

```js
const handleBlogRouter=(req,res)=>{
  const method=req.method

  //获取博客列表
  if(method=='GET'&&req.path==='/api/blog/list'){
    return{
      msg:'这是获取博客列表的接口 '
    }
  }

  //获取博客详情
  if(method=='GET'&&req.path==='/api/blog/detail'){
    return{
      msg:'这是获取博客详情的接口'
    }
  }

  //新建一篇博客
  if(method=='POST'&&req.path==='/api/blog/new'){
    return{
      msg:'这是新建一篇博客的接口'
    }
  }

  //更新一篇博客
  if(method=='POST'&&preq.pathath==='/api/blog/upgrate'){
    return{
      msg:'这是更新一篇博客的接口'
    }
  }

  //更新一篇博客
  if(method=='POST'&&req.path==='/api/blog/del'){
    return{
      msg:'这是删除一篇博客的接口'
    }
  }
}

module.exports=handleBlogRouter
```

- **user.js**

```js
const handleUserRouter = (req, res) => {
  const method=req.method


  //登陆
  if(method ==='POST'&&req.path==='/api/user/login'){
    return {
      msg:'这是登陆的接口'
    }
  }

}
module.exports = handleUserRouter
```

#### model

数据模型

只关心数据格式

- **resModel.js**

```js
class BaseModel{
  constructor(data,message){
    if(typeof data==='string'){
      this.message=data;
      data=null
      message=null
    }
    if(data){
      this.data=data
    }
    if(message){
      this.message=message
    }
  }
}
class SuccessModel extends BaseModel{
  constructor(data,message){
    super(data,message)
    this.errNo=0
  }
}
class ErrorModel extends BaseModel{
  constructor(data,message){
    super(data,message)
    this.errNo=-1
  }
}
module.exports={
  SuccessModel,
  ErrorModel
}
```



#### controller 

只关心数据

- **blog.js**

```js
const getList=(author,keyword)=>{//获取博客列表
  //返回假数据
  return [
    {
      id:1,
      title:'title1',
      content:'content1',
      createTime:1648569048,
      author:'Pithy'
    },
    {
      id:2,
      title:'title2',
      content:'content2',
      createTime:1648569055,
      author:'AWSPI'
    }
  ]
}

const getDetail=(id)=>{
  return {
    id:1,
    title:'title1',
    content:'content1',
    createTime:1648569048,
    author:'Pithy'
  }
}


//返回的是对象，因为之后还有其他的函数
module.exports={
  getList,
  getDetail
}
```



#### 处理postdata

使用promise处理异步数据

```js

//用于处理post
const getPostData=(req)=>{
  const promise = new Promise((resolve, reject) =>{
    if(req.method!=='POST'){//不是post返回空
      resolve({})
      return
    }
    if(req.header['Content-Type']!=='application/json'){//不满足格式返回空
      resolve({})
      return
    }
    let postData=''
    req.on('data',chunk =>{
      postData+=chunk.toString()
    })
    req.on('end',() =>{
      if(postData==''){
        resolve({})
        return
      }
      resolve(JSON.parse(postData))
    })



  })
  return promise
}
```



```js
 //处理postData
  getPostData(req).then(postData=>{
    req.body=postData//之后可以通过req.body获取postData

    //处理blog路由
    const blogData=handleBlogRouter(req,res)
    if(blogData){
      res.end(
        JSON.stringify(blogData)
      )
      return
    }

    //处理user路由
    const userData=handleUserRouter(req,res)
    if(userData){
      res.end(
        JSON.stringify(userData)
      )
      return
    }

    //未命中路由 返回404
    res.writeHead(404,{"Content-type":"text/plain"})
    res.write("404 Not Found\n")
  })

```

