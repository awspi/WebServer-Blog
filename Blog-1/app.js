const querystring = require('querystring')
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')
const { access } = require('./src/utils/log')
const { get, set } = require('./src/db/redis')
//获取cookie过期时间
const getCookieExpires = () => {
  const d = new Date();
  d.setTime(d.getTime() + (24 * 60 * 60 * 1000)) //设置一天后
  return d.toGMTString()
}

//session数据
const SESSION_DATA = {}

//用于处理post
const getPostData = (req) => {
  const promise = new Promise((resolve, reject) => {
    if (req.method !== 'POST') {//不是post返回空
      resolve({})
      return
    }

    //headers不是header
    if (req.headers['content-type'] !== 'application/json') {//不满足格式返回空
      resolve({})
      return
    }
    let postData = ''
    req.on('data', chunk => {
      postData += chunk.toString()
    })
    req.on('end', () => {
      if (postData == '') {
        resolve({})
        return
      }
      resolve(JSON.parse(postData))
    })



  })
  return promise
}

const serverHandle = (req, res) => {

  //记录access log
  access(`${req.method} -- ${req.url} -- ${req.headers['user-agent']}`)

  //设置返回格式
  res.setHeader('Content-Type', 'application/json')

  //获取path
  const url = req.url
  req.path = url.split('?')[0]

  //解析 query
  req.query = querystring.parse(url.split('?')[1])

  //解析cookie
  req.cookie = {}
  const cookieStr = req.headers.cookie || '' //cookie
  cookieStr.split(";").forEach(item => {
    if (!item) {
      return
    }
    const arr = item.split('=')
    const key = arr[0].trim() //加个trim 去首尾空格
    const val = arr[1].trim()
    req.cookie[key] = val
  })
  // console.log(req.cookie)

  // //解析session
  // let needSetCookie=false
  // let userId=req.cookie.userid
  // if(userId) {
  //   if(!SESSION_DATA[userId]) {
  //     SESSION_DATA[userId]={}
  //   }
  // }else{
  //   needSetCookie=true
  //   userId=`${Date.now()}_${Math.random()}`;//保证不重复
  //   SESSION_DATA[userId]={}
  // }
  // req.session=SESSION_DATA[userId] 

  // 解析 session （使用 redis）
  let needSetCookie = false
  let userId = req.cookie.userid
  if (!userId) {
    needSetCookie = true
    userId = `${Date.now()}_${Math.random()}`
    // 初始化 redis 中的 session 值
    set(userId, {})
  }
  // 获取 session
  req.sessionId = userId
  get(req.sessionId).then(sessionData => {
    if (sessionData == null) {
      // 初始化 redis 中的 session 值
      set(req.sessionId, {})
      // 设置 session
      req.session = {}
    } else {
      // 设置 session
      req.session = sessionData
    }
    // console.log('req.session ', req.session)

    // 处理 post data
    return getPostData(req)
  }).then(postData => {
    req.body = postData//之后可以通过req.body获取postData
    
    //处理blog路由
    const blogResult = handleBlogRouter(req, res)
    if (blogResult) {
      blogResult.then(blogData => {
        if (needSetCookie) {
          res.setHeader('Set-cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
        }
        res.end(
          JSON.stringify(blogData)
        )
      })
      return
    }

    // const blogData=handleBlogRouter(req,res)
    // if(blogData){
    //   res.end(
    //     JSON.stringify(blogData)
    //   )
    //   return
    // }

    //处理user路由
    const userData = handleUserRouter(req, res)
    if (userData) {
      userData.then(userData => {
        if (needSetCookie) {
          res.setHeader('Set-cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
        }
        res.end(JSON.stringify(userData))
      })
      return
    }

    //未命中路由 返回404
    res.writeHead(404, { "Content-type": "text/plain" })
    res.write("404 Not Found\n")
  })


}

module.exports = serverHandle