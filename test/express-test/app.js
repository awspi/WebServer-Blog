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