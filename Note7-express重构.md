# express重构

## 基础

### 安装express

使用脚手架express-generator

```bash
sudo npm install express-generator -g
express express-test
```

```bash
 change directory:
     $ cd Blog-express

   install dependencies:
     $ npm install

   run the app:
     $ DEBUG=blog-express:* npm start
```

package.json加入dev之后直接执行 `npm run dev`即可启动项目

```json
  "scripts": {
    "start": "node ./bin/www",
    "dev":"cross-env NODE_ENV=dev nodemon ./bin/www.js",
    "prd":"cross-env NODE_ENV=production nodemon ./bin/www.js"
  },
```



### express的入口代码

app.js

```js
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');//cookie
var logger = require('morgan');//日志

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const bolgRouter=require('./routes/blog')


var app = express();

//view的渲染 不需要
// // view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());//express.json() 处理json格式
app.use(express.urlencoded({ extended: false }));//其他格式
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/blog', bolgRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'dev' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
     
```



### 处理路由

app.js

```
const bolgRouter=require('./routes/blog')
app.use('/api/blog', bolgRouter);
```



./router/blog.js

```
router.get('/list', function(req, res, next) {
  res.json({//直接返回.json文件
    errNo:0,
    data:[1,2,3]
  })
  
});

```



### express中间件

next()

```js
const express = require('express');

const app = express();

app.use((req, res, next) => {
  console.log('请求开始..', req.method, req.url)
  next()
})

app.use((req, res, next) => {
  //假设在处理cookie
  req.cookie = {
    id: 123
  }
  next()
})

app.use((req, res, next) => {
  //假设在处理postdata
  setTimeout(() => {
    req.body = {
      a: 100,
      b: 200
    }
    next()
  })
})

app.use('/api', (req, res, next) => {
  console.log('处理/api路由')
  next()
})
app.get('/api', (req, res, next) => {
  console.log('get /api路由')
  next()
})
app.post('/api', (req, res, next) => {
  console.log('post/api路由')
  next()
})
//模拟登陆验证
function loginCheck(req, res, next) {
  console.log('模拟登陆')
  setTimeout(() =>{
    next()
  })
}
app.get('/api/get-cookie',loginCheck, (req, res, next) => {//第三个参数就是匿名参数
  console.log('get /get-cookie')
  res.json({
    errNo: 0,
    data: req.cookie
  })
})
app.post('/api/get-postdata', (req, res, next) => {
  console.log('post /api/get-postdata')
  res.json({
    errNo: 0,
    data: req.body
  })
})

app.use((req, res, next) => {
  console.log('404');
  res.json({
    errNo: 0,
    data: "404"
  })
})

app.listen(3000, () => {
  console.log('server is running on port 3000')
})
```

## 初始化环境

- 安装mysql xss
- mysql controller resModel相关代码可以复用

将原有controlle router utilsr db model conf等目录的内容迁移



## 处理session

- express-session、connect-redis
- req.session保存登陆信息,登陆校验loginCheck做出express中间件

```js
router.get('/session-test',(req, res, next) => {
  const session=req.session;
  if(session.viewNum==null){
    session.viewNum=0
  }
  session.viewNum++;
  res.json({
    viewNum: session.viewNum
  })
})
```



## 链接redis

./db/redis.js

```
const redis= require('redis')
 const {REDIS_CONFIG}= require('../conf/db')

 //创建客户端
 const redisClient=redis.createClient(REDIS_CONFIG.port,REDIS_CONFIG.host)
 redisClient.on('error',err=>{
   console.error(err)
 })

module.exports=redisClient
```

app.js

```js
const session = require('express-session');
const RedisStore=require('connect-redis')(session);

const redisClient = require('./db/redis')
const sessionStore = new RedisStore({
  client: redisClient
})
app.use(session({
  secret:'PITHY_@)@@>$>%',
  cookie: {
    // path: '/',   // 默认配置
    // httpOnly: true,  // 默认配置
    maxAge: 24 * 60 * 60 * 1000
  },
  store: sessionStore
}))
```





## 登陆中间件

./middleware/loginCheck.js

```js
const {SuccessModel,ErrorModel}=require('../model/resModel')
module.exports =(req,res,next)=>{
  if (req.session.username) {
    next()
    return
  }else{
    res.json(
      new ErrorModel('未登陆')
    )
  }
}
```



## 开发路由

完善其他的路由

routes/blog.js

```js
router.get('/list', function(req, res, next) {
  let author = req.query.author || ''
  const keyword = req.query.keyword || ''
  if (req.query.isadmin) {
    console.log('is admin')
    // 管理员界面
    if (req.session.username == null) {
        console.error('is admin, but no login')
        // 未登录
        res.json(
            new ErrorModel('未登录')
        )
        return
    }
    // 强制查询自己的博客
    author = req.session.username
}


  const result = getList(author, keyword)
  return result.then(listData => {//return result.then
    res.json(
      new SuccessModel(listData)
    ) 
  })
});

router.get('/detail', (req, res, next)=> {
  const result = getDetail(req.query.id)
  return result.then(data => {
    res.json(new SuccessModel(data))
  })
  
});

router.post('/new',loginCheck, (req, res, next)=> {

  const author = req.session.username
  req.body.author = author
  const blogData = req.body
  const result = newBlog(blogData)
  
  return result.then(data => {
    res.json(new SuccessModel(data))
  })
})

router.post('/update',loginCheck, (req, res, next)=>{
  const result = updateBlog(req.query.id, req.body)
  return result.then(data => {
    if (data) {
      res.json(new SuccessModel())
      
    } else {
      res.json(new ErrorModel('博客更新失败'))
    }
  })
})

router.post('/del',loginCheck, (req, res, next)=>{
  console.log(1);
  const author = req.session.username
  const result = delBlog(req.query.id, author)
  return result.then(data => {
    if (data) {
      res.json(new SuccessModel())
    } else {
      res.json(new ErrorModel('删除博客失败'))
    }
  })
})
```



## 日志

- access log 记录,直接使用脚手架推荐的 **morgan**
- 自定义日志使用 console.log和console.err即可
- 日志文件拆分、日志内容分析

*https://github.com/expressjs/morgan*

app.js

```js
var logger = require('morgan');//日志
var path = require('path');
const fs= require('fs')

const ENV=process.env.NODE_ENV
if(ENV!=='production'){
  app.use(logger('dev'))
}else{//线上环境
    const logFileName=path.join(__dirname, 'logs','access.log')
    const writestream=fs.createWriteStream(logFileName,{
      flags:'a'
    })
    app.use(logger('combined',{
      stream: writestream
    }))
}
```



# express中间件

 分析

- app.use用来注册中间件,先收集起来
- 遇到http请求,根据path和method判断触发哪些
- 实现next机制,即_上一个通过next触发下一个
